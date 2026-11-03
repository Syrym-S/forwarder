import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createWebPushManager } from "../src/services/web-push-manager.js";
import { firebaseWorkerPlugin } from "../tooling/firebase-worker-plugin.js";
import { readFirebaseConfig } from "../src/services/firebase-config.js";
import { atWebPushStage, describeWebPushError } from "../src/services/web-push-errors.js";

function setup(overrides = {}) {
  const calls = [];
  let enabled = false;
  const manager = createWebPushManager({
    register: async (options) => { calls.push(["register", options]); return "fcm-browser-token"; },
    saveToken: async (token) => { calls.push(["save", token]); },
    removeToken: async (token) => { calls.push(["remove", token]); },
    readProfile: async () => ({ pushEnabled: enabled }),
    updateProfile: async (value) => { calls.push(["profile", value]); enabled = value; },
    permission: () => "granted",
    savedToken: () => "fcm-browser-token",
    forgetToken: () => { calls.push(["forget"]); },
    ...overrides,
  });
  return { manager, calls, enabled: () => enabled };
}

test("enable commits the preference only after the service accepts this device", async () => {
  const { manager, calls, enabled } = setup();
  await manager.enable();
  assert.deepEqual(calls, [["register", undefined], ["save", "fcm-browser-token"], ["profile", true]]);
  assert.equal(enabled(), true);
});

test("denied/dismissed browser permission never saves a token or enables the profile", async () => {
  const { manager, calls, enabled } = setup({ register: async () => null });
  await assert.rejects(manager.enable(), /web_push_permission_required/);
  assert.deepEqual(calls, []);
  assert.equal(enabled(), false);
});

test("notification service failure leaves the preference disabled", async () => {
  const { manager, calls, enabled } = setup({ saveToken: async () => { throw new Error("502"); } });
  await assert.rejects(manager.enable(), /502/);
  assert.equal(enabled(), false);
  assert.equal(calls.some(([action]) => action === "profile"), false);
});

test("profile failure rolls back this token without masking the original error", async () => {
  let removed;
  const { manager } = setup({
    updateProfile: async () => { throw new Error("profile 502"); },
    removeToken: async (token) => { removed = token; throw new Error("service offline"); },
  });
  await assert.rejects(manager.enable(), /profile 502/);
  assert.equal(removed, "fcm-browser-token");
});

test("failed disable keeps browser cleanup uncommitted for a retry", async () => {
  const { manager, calls } = setup({ updateProfile: async () => { throw new Error("502"); } });
  await assert.rejects(manager.disable(), /502/);
  assert.deepEqual(calls, []);
});

test("successful disable relies on the backend's deletion of every device", async () => {
  const { manager, calls } = setup();
  await manager.disable();
  assert.deepEqual(calls, [["profile", false], ["forget"]]);
});

for (const pushEnabled of [false, true]) {
  for (const permission of ["default", "denied", "granted", "unsupported"]) {
    test(`startup with preference=${pushEnabled}, permission=${permission} never prompts`, async () => {
      const { manager, calls } = setup({
        readProfile: async () => ({ pushEnabled }),
        permission: () => permission,
      });
      await manager.restore();
      assert.deepEqual(calls, pushEnabled && permission === "granted"
        ? [["register", { requestPermission: false }], ["save", "fcm-browser-token"]]
        : []);
    });
  }
}

test("logout removes the exact current-browser token before forgetting it", async () => {
  const { manager, calls } = setup();
  await manager.logout();
  assert.deepEqual(calls, [["remove", "fcm-browser-token"], ["forget"]]);
});

test("logout without a token never calls delete-all", async () => {
  const { manager, calls } = setup({ savedToken: () => null, permission: () => "default" });
  await manager.logout();
  assert.deepEqual(calls, [["forget"]]);
});

test("logout can recover a previously issued token without requesting permission", async () => {
  const { manager, calls } = setup({ savedToken: () => null, readProfile: async () => ({ pushEnabled: true }) });
  await manager.logout();
  assert.deepEqual(calls, [["register", { requestPermission: false }], ["remove", "fcm-browser-token"], ["forget"]]);
});

test("failed token deletion retains the token and rejects logout", async () => {
  const { manager, calls } = setup({ removeToken: async () => { throw new Error("service offline"); } });
  await assert.rejects(manager.logout(), /service offline/);
  assert.deepEqual(calls, []);
});

function worker(scope = "https://example.com/", clientWindows = []) {
  const imports = [];
  const shown = [];
  const handlers = {};
  const opened = [];
  let receive;
  const source = readFileSync(new URL("../tooling/firebase-messaging-sw.js.template", import.meta.url), "utf8")
    .replace("__FIREBASE_CONFIG__", JSON.stringify({
      production: { apiKey: "public", projectId: "test", messagingSenderId: "1", appId: "prod-app" },
      staging: { apiKey: "public", projectId: "test", messagingSenderId: "1", appId: "staging-app" },
    }))
    .replaceAll("__FIREBASE_SDK_VERSION__", "13.2.0");
  runInNewContext(source, {
    URL,
    self: {
      location: { origin: new URL(scope).origin },
      registration: { scope, showNotification: async (title, options) => { shown.push({ title, ...options }); } },
      addEventListener: (name, handler) => { handlers[name] = handler; },
      clients: {
        matchAll: async () => clientWindows,
        openWindow: async (url) => { opened.push(url); },
      },
    },
    importScripts: (url) => { imports.push(url); },
    firebase: { initializeApp() {}, messaging: () => ({ onBackgroundMessage: (callback) => { receive = callback; } }) },
  });
  const click = async () => {
    let pending;
    let closed = false;
    let stopped = false;
    handlers.notificationclick({
      notification: { data: shown[0].data, close: () => { closed = true; } },
      stopImmediatePropagation: () => { stopped = true; },
      waitUntil: (promise) => { pending = promise; },
    });
    await pending;
    assert.equal(closed, true);
    assert.equal(stopped, true);
  };
  return { imports, shown, handlers, receive, opened, click };
}

test("background notification payloads are not displayed twice", async () => {
  const { receive, shown } = worker();
  await receive({ notification: { title: "Automatic Firebase notification" } });
  assert.equal(shown.length, 0);
});

test("data-only messages display once and reject unrelated origins", async () => {
  const { receive, shown } = worker("https://example.com/staging/");
  await receive({ data: { title: "New event", body: "Details", link: "https://external.example/" } });
  assert.equal(shown.length, 1);
  assert.equal(shown[0].body, "Details");
  assert.equal(shown[0].data.forwarderPushUrl, "https://example.com/staging/forwarder/");
});

test("backend data-only payload preserves translated text and opens data.link across trusted domains", async () => {
  const { receive, shown, click, opened } = worker("https://forwarder.360logistics.kz/staging/");
  const data = {
    title: "Начата загрузка",
    body: "Водитель начал загрузку по рейсу №1024",
    link: "https://360logistics.kz/customer/leads/6721f0c2a8b4e93d1c0f5a17",
    type: "shipping.loading_started.6721f0c2a8b4e93d1c0f5a17",
    url: "https://example.com/incorrect-legacy-field",
  };
  await receive({ messageId: "message-1", data });
  assert.equal(shown.length, 1);
  assert.equal(shown[0].title, data.title);
  assert.equal(shown[0].body, data.body);
  assert.equal(shown[0].data.type, data.type);
  await click();
  assert.deepEqual(opened, [data.link]);
});

for (const scope of ["https://forwarder.360logistics.kz/", "https://forwarder.360logistics.kz/staging/"]) {
  test(`an empty link opens this environment's cabinet: ${scope}`, async () => {
    const { receive, click, opened } = worker(scope);
    await receive({ data: { title: "Event", body: "Details", link: "" } });
    await click();
    assert.deepEqual(opened, [new URL("forwarder/", scope).href]);
  });
}

test("a notification click focuses an already open target instead of opening a duplicate", async () => {
  const link = "https://forwarder.360logistics.kz/staging/forwarder/leads/123";
  let focused = false;
  const { receive, click, opened } = worker("https://forwarder.360logistics.kz/staging/", [
    { url: link, focus: async () => { focused = true; } },
  ]);
  await receive({ data: { title: "Event", link } });
  await click();
  assert.equal(focused, true);
  assert.deepEqual(opened, []);
});

for (const link of [
  "javascript:alert(1)",
  "http://360logistics.kz/customer/leads/123",
  "https://360logistics.kz.external.example/",
  "https://user:password@360logistics.kz/",
]) {
  test(`unsafe notification link falls back to the current cabinet: ${link}`, async () => {
    const { receive, click, opened } = worker("https://forwarder.360logistics.kz/staging/");
    await receive({ data: { title: "Event", link } });
    await click();
    assert.deepEqual(opened, ["https://forwarder.360logistics.kz/staging/forwarder/"]);
  });
}

test("both worker imports use the installed SDK version in generated output", () => {
  const plugin = firebaseWorkerPlugin();
  plugin.configResolved({ mode: "test", envDir: fileURLToPath(new URL("../", import.meta.url)) });
  let file;
  plugin.generateBundle.call({ emitFile: (value) => { file = value; } });
  assert.equal(file.fileName, "firebase-messaging-sw.js");
  assert.equal(file.source.includes("__FIREBASE_"), false);
  const { version } = JSON.parse(readFileSync(new URL("../node_modules/firebase/package.json", import.meta.url), "utf8"));
  assert.equal(file.source.match(new RegExp(`firebasejs/${version.replaceAll(".", "\\.")}/`, "g")).length, 2);
});

test("staging can use an independent appId with the same project credentials", () => {
  const env = { VITE_FIREBASE_APP_ID: "prod", VITE_FIREBASE_STAGING_APP_ID: "staging", VITE_FIREBASE_PROJECT_ID: "shared" };
  assert.equal(readFirebaseConfig(env).appId, "prod");
  assert.equal(readFirebaseConfig(env, { staging: true }).appId, "staging");
  assert.equal(readFirebaseConfig(env, { staging: true }).projectId, "shared");
});

test("a missing worker is identified separately from token and profile failures", async () => {
  await assert.rejects(atWebPushStage("firebase-token", () =>
    atWebPushStage("service-worker", () => { throw new TypeError("Script returned 404"); })), (error) => {
    const details = describeWebPushError(error);
    assert.equal(details.stage, "service-worker");
    assert.equal(details.messageKey, "web_push_worker_failed");
    assert.equal(details.message, "Script returned 404");
    return true;
  });
});

test("diagnostics retain HTTP status without exposing request tokens or response bodies", async () => {
  const cause = Object.assign(new Error("Request failed with status code 502"), {
    response: { status: 502, data: { private: "backend-response" } },
    config: {
      url: "https://user:private-password@notification.staging.360logistics.kz/api/push-token?token=private-query#private-fragment",
      method: "post",
      headers: { Authorization: "Bearer private-token" },
      data: { token: "private-fcm-token" },
    },
  });
  await assert.rejects(atWebPushStage("push-register", () => { throw cause; }), (error) => {
    const details = describeWebPushError(error);
    assert.equal(details.status, 502);
    assert.equal(details.messageKey, "web_push_registration_failed");
    assert.equal(details.requestUrl, "https://notification.staging.360logistics.kz/api/push-token");
    assert.equal(details.method, "POST");
    assert.equal(JSON.stringify(details).includes("private"), false);
    return true;
  });
});

test("permission errors keep their specific explanation", async () => {
  await assert.rejects(atWebPushStage("firebase-token", () => { throw new Error("web_push_permission_required"); }), (error) => {
    assert.equal(describeWebPushError(error).messageKey, "web_push_permission_required");
    return true;
  });
});
