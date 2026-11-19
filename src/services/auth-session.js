export function isAuthPath(pathname) {
  return /^\/(?:staging\/)?auth(?:\/|$)/.test(pathname);
}

function isAuthenticationError(error) {
  const response = error?.response;
  return response?.status === 401 || (
    response?.status === 403 &&
    response.data?.code === "rest_cookie_invalid_nonce"
  );
}

export function createAuthSession({ api, location, getMode }) {
  let redirecting = false;

  function redirectIfUnauthorized(error) {
    if (isAuthPath(location.pathname) || !isAuthenticationError(error)) {
      return false;
    }

    if (!redirecting) {
      redirecting = true;
      const isStaging = getMode() === "staging" ||
        location.pathname.startsWith("/staging/");
      location.replace(isStaging ? "/staging/auth/login" : "/auth/login");
    }
    return true;
  }

  // Keep watching protected requests after the initial session check.
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      redirectIfUnauthorized(error);
      return Promise.reject(error);
    },
  );

  return {
    async checkBeforeMount() {
      if (isAuthPath(location.pathname)) return true;

      try {
        // Use the server session, without a cached or hard-coded nonce.
        await api.get("forwarder/profile/v1/get", {
          withCredentials: true,
          timeout: 10000,
        });
      } catch (error) {
        redirectIfUnauthorized(error);
        // Offline, server, and permission errors remain with the app's handlers.
      }

      return !redirecting;
    },
  };
}
