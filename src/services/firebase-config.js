export function readFirebaseConfig(env, { staging = false } = {}) {
  return {
    apiKey: env.VITE_FIREBASE_API_KEY || "",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "",
    messagingSenderId: env.VITE_FIREBASE_SENDER_ID || "",
    appId: (staging && env.VITE_FIREBASE_STAGING_APP_ID) || env.VITE_FIREBASE_APP_ID || "",
  };
}

export function hasFirebaseConfig(config) {
  return Boolean(config.apiKey && config.projectId && config.messagingSenderId && config.appId);
}
