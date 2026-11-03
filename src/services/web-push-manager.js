// Keep the backend ordering explicit and testable without browser/Firebase credentials.
export function createWebPushManager({
  register, saveToken, removeToken, readProfile, updateProfile,
  permission, savedToken, forgetToken,
}) {
  return {
    async restore() {
      const profile = await readProfile();
      if (profile.pushEnabled === true && permission() === "granted") {
        const token = await register({ requestPermission: false });
        if (token) await saveToken(token);
      }
      return profile;
    },
    async enable() {
      const token = await register();
      if (!token) throw new Error("web_push_permission_required");
      await saveToken(token);
      // Only commit the preference after the notification service has accepted the token.
      try {
        await updateProfile(true);
      } catch (error) {
        // Avoid deliveries for a preference that could not be saved. Keep the cached
        // token if rollback fails so logout can still try removing this device.
        await removeToken(token).catch(() => {});
        throw error;
      }
    },
    async disable() {
      // Backend removes all devices atomically; a 502 must leave the checkbox unchanged.
      await updateProfile(false);
      forgetToken();
    },
    async logout() {
      let token = savedToken();
      if (!token && permission() === "granted") {
        const profile = await readProfile();
        if (profile.pushEnabled === true) token = await register({ requestPermission: false });
      }
      if (token) await removeToken(token);
      forgetToken();
    },
  };
}
