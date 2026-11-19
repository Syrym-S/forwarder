import assert from "node:assert/strict";
import test from "node:test";
import axios from "axios";
import { createAuthSession } from "../src/services/auth-session.js";

function setup({ pathname = "/forwarder/leads/123", mode, error } = {}) {
  const redirects = [];
  const requests = [];
  let requestError = error;
  const api = axios.create({
    adapter: async (config) => {
      requests.push(config);
      if (requestError) throw requestError;
      return { status: 200, data: { id: 42 }, headers: {}, config };
    },
  });
  const session = createAuthSession({
    api,
    location: { pathname, replace: (path) => redirects.push(path) },
    getMode: () => mode,
  });
  return { api, session, redirects, requests, expire: (value) => { requestError = value; } };
}

const failure = (status, code) => Object.assign(new Error("Request failed"), {
  response: { status, data: { code } },
});

for (const [pathname, mode, login] of [
  ["/forwarder/leads/123", undefined, "/auth/login"],
  ["/staging/forwarder/leads/123", undefined, "/staging/auth/login"],
  ["/", "staging", "/staging/auth/login"],
]) {
  test(`an anonymous visitor at ${pathname} goes to ${login}`, async () => {
    const { session, redirects } = setup({ pathname, mode, error: failure(401) });
    assert.equal(await session.checkBeforeMount(), false);
    assert.deepEqual(redirects, [login]);
  });
}

test("a valid server session opens the cabinet using a credentialed profile request", async () => {
  const { session, requests, redirects } = setup();
  assert.equal(await session.checkBeforeMount(), true);
  assert.equal(requests[0].url, "forwarder/profile/v1/get");
  assert.equal(requests[0].withCredentials, true);
  assert.ok(requests[0].timeout > 0);
  assert.deepEqual(redirects, []);
});

test("session expiration during parallel API requests redirects once and preserves errors", async () => {
  const { api, session, expire, redirects } = setup();
  assert.equal(await session.checkBeforeMount(), true);
  const error = failure(401);
  expire(error);
  const results = await Promise.allSettled([api.get("leads"), api.get("notifications")]);
  assert.ok(results.every((result) => result.status === "rejected" && result.reason === error));
  assert.deepEqual(redirects, ["/auth/login"]);
});

test("an expired WordPress nonce redirects to login", async () => {
  const { session, redirects } = setup({ error: failure(403, "rest_cookie_invalid_nonce") });
  assert.equal(await session.checkBeforeMount(), false);
  assert.deepEqual(redirects, ["/auth/login"]);
});

for (const error of [failure(403, "rest_forbidden"), failure(403, "registration_not_verified"), failure(500), new Error("Network Error")]) {
  test(`a non-authentication error (${error.response?.data?.code || error.response?.status || error.message}) does not sign out`, async () => {
    const { session, redirects } = setup({ error });
    assert.equal(await session.checkBeforeMount(), true);
    assert.deepEqual(redirects, []);
  });
}

for (const pathname of ["/auth", "/auth/login", "/auth/register", "/auth/forgot-password", "/staging/auth/reset-password"]) {
  test(`the public auth page ${pathname} does not check the session or redirect on login errors`, async () => {
    const { session, api, requests, redirects } = setup({ pathname, error: failure(401) });
    assert.equal(await session.checkBeforeMount(), true);
    assert.equal(requests.length, 0);
    await assert.rejects(api.post("auth/v1/auth"));
    assert.deepEqual(redirects, []);
  });
}
