import { create } from "zustand";
import { useProfileStore } from "../profile/profile-store.js";
import { editProfileApi } from "../profile/api.js";
import {
  forgetWebPushToken, getSavedWebPushToken, getWebPushPermission, registerWebPush,
} from "../../../services/firebase.js";
import { removePushToken, savePushToken, waitForPageConfig } from "../../../services/web-push-api.js";
import { createWebPushManager } from "../../../services/web-push-manager.js";
import { atWebPushStage, describeWebPushError } from "../../../services/web-push-errors.js";

const manager = createWebPushManager({
  register: (options) => atWebPushStage("firebase-token", () => registerWebPush(options)),
  saveToken: savePushToken,
  removeToken: removePushToken,
  permission: getWebPushPermission,
  savedToken: getSavedWebPushToken,
  forgetToken: forgetWebPushToken,
  readProfile: async () => {
    await waitForPageConfig();
    return atWebPushStage("profile-load", () => useProfileStore.getState().getProfileData());
  },
  updateProfile: async (pushEnabled) => {
    await atWebPushStage("profile-update", () => editProfileApi({ pushEnabled }));
    useProfileStore.setState((state) => ({ profileData: { ...state.profileData, pushEnabled } }));
  },
});

let pending = null;
let initialization = null;

function run(action) {
  if (pending) return pending;
  useWebPushStore.setState({ busy: true, error: null });
  pending = action()
    .catch((error) => {
      const details = describeWebPushError(error);
      // Log only diagnostic fields, never Axios request configs or authorization tokens.
      console.error("[WebPush]", details);
      useWebPushStore.setState({ error: details.messageKey });
      throw error;
    })
    .finally(() => {
      pending = null;
      useWebPushStore.setState({ busy: false });
    });
  return pending;
}

export const useWebPushStore = create(() => ({
  busy: false,
  initialized: false,
  error: null,
  initialize: () => {
    if (!initialization) {
      initialization = run(() => manager.restore())
        .catch(() => { initialization = null; })
        .finally(() => useWebPushStore.setState({ initialized: true }));
    }
    return initialization;
  },
  retry: () => {
    if (pending) return pending.catch(() => {});
    initialization = null;
    return useWebPushStore.getState().initialize();
  },
  setEnabled: (enabled) => run(() => enabled ? manager.enable() : manager.disable()),
}));

export async function unregisterPushBeforeLogout() {
  // A failed startup must not prevent a fresh cleanup attempt with current authorization.
  if (pending) await pending.catch(() => {});
  return run(() => manager.logout());
}
