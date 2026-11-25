// Injectable so registration, permission and timeout behavior can be checked without FCM.
export function createNativePushClient({ push, settings, rememberToken, timeoutMs = 20000 }) {
  let permission = "default";
  let registration;
  return {
    permission: () => permission,
    async refresh() {
      const status = await push.checkPermissions();
      permission = status.receive === "granted" ? "granted"
        : status.receive === "denied" ? "denied" : "default";
      return permission;
    },
    async register({ requestPermission = true } = {}) {
      if (!(await settings.getStatus()).configured) throw new Error("web_push_not_configured");
      await this.refresh();
      if (permission === "default" && requestPermission) {
        const result = await push.requestPermissions();
        permission = result.receive === "granted" ? "granted"
          : result.receive === "denied" ? "denied" : "default";
      }
      if (permission !== "granted") return null;
      if (registration) return registration;
      registration = (async () => {
        const listeners = [];
        let timer;
        try {
          let resolveToken;
          let rejectToken;
          const token = new Promise((resolve, reject) => { resolveToken = resolve; rejectToken = reject; });
          listeners.push(await push.addListener("registration", ({ value }) => {
            if (value) resolveToken(value);
            else rejectToken(new Error("web_push_token_failed"));
          }));
          listeners.push(await push.addListener("registrationError", () => rejectToken(new Error("web_push_token_failed"))));
          timer = setTimeout(() => rejectToken(new Error("web_push_token_failed")), timeoutMs);
          // Attach rejection handling before invoking native registration.
          const result = await Promise.all([token, push.register()]);
          rememberToken(result[0]);
          return result[0];
        } finally {
          clearTimeout(timer);
          await Promise.allSettled(listeners.map((listener) => listener.remove()));
        }
      })();
      try { return await registration; }
      finally { registration = null; }
    },
    async setEnabled(enabled) {
      await settings.setDeliveryEnabled({ enabled });
      if (!enabled) await push.removeAllDeliveredNotifications();
    },
  };
}
