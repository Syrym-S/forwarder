import assert from "node:assert/strict";
import test from "node:test";
import { isInternationalLead } from "../src/shared/lib/international-route.js";

const domesticRoute = {
  from_location: { country: "KZ" },
  to_location: { country: "Kazakhstan" },
};
const internationalRoute = {
  ...domesticRoute,
  to_location: { country: "RU" },
};

test("uses the route countries before the user chooses a value", () => {
  assert.equal(isInternationalLead(domesticRoute), false);
  assert.equal(isInternationalLead(internationalRoute), true);
  assert.equal(isInternationalLead({ ...internationalRoute, is_international: null }), true);
  assert.equal(isInternationalLead({
    ...domesticRoute,
    waypoints: [{ country: "RU" }],
  }), true);
});

test("allows manually enabling international transport on a domestic route", () => {
  assert.equal(isInternationalLead({ ...domesticRoute, is_international: true }), true);
});

test("keeps an explicit false value even when the route crosses a border", () => {
  assert.equal(isInternationalLead({ ...internationalRoute, is_international: false }), false);
});

test("preserves the manual choice when route points change", () => {
  for (const is_international of [true, false]) {
    assert.equal(isInternationalLead({ ...domesticRoute, is_international }), is_international);
    assert.equal(isInternationalLead({ ...internationalRoute, is_international }), is_international);
  }
});
