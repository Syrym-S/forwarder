import assert from "node:assert/strict";
import test from "node:test";
import { createFormControl } from "react-hook-form";
import { normalizeRouteAddress } from "../src/components/lead-form/api/route-address-search.api.js";
import { getRouteAddressFields } from "../src/components/lead-form/lib/route-address-fields.js";

const address = normalizeRouteAddress({
  geometry: { type: "Point", coordinates: [76.95, 43.24] },
  properties: { city: "Almaty", street: "Abay", housenumber: "10", country: "Kazakhstan" },
});

function createRouteForm(context) {
  const form = createFormControl({
    defaultValues: {
      from_location: { address: "Old origin" },
      to_location: { address: "Old destination" },
      waypoints: [{ address: "Old waypoint", type: "loading" }],
      point_schedules: [{ start_at: "2026-11-10", end_at: "2026-11-11", point_index: 1 }],
    },
  });
  context.after(form.subscribe({ formState: { values: true }, callback() {} }));
  return form;
}

function updateAddress(form, point, location) {
  for (const [name, value] of getRouteAddressFields(point, location)) {
    form.setValue(name, value);
  }
}

test("suggestions update route coordinates without replacing waypoint types or schedules", (context) => {
  const form = createRouteForm(context);
  const schedules = form.getValues("point_schedules");

  for (const point of ["from", "cross.0", "to"]) {
    updateAddress(form, point, address.location);
  }

  const values = form.getValues();
  assert.deepEqual(values.from_location, address.location);
  assert.deepEqual(values.to_location, address.location);
  assert.deepEqual(values.waypoints, [{ ...address.location, type: "loading" }]);
  assert.deepEqual(values.point_schedules, schedules);
  assert.equal(values.fromLat, 43.24);
  assert.equal(values.fromLng, 76.95);
  assert.equal(values.toLat, 43.24);
  assert.equal(values.toLng, 76.95);
});

test("editing an address clears its old location and keeps the text and other route points", (context) => {
  const form = createRouteForm(context);
  for (const point of ["from", "cross.0", "to"]) {
    updateAddress(form, point, address.location);
  }

  form.setValue("waypoints[0].address", "New waypoint");
  updateAddress(form, "cross.0");
  assert.deepEqual(form.getValues("waypoints[0]"), {
    address: "New waypoint", type: "loading", city: "", country: "", region: "", lat: "", lng: "", lon: "",
  });
  assert.deepEqual(form.getValues("from_location"), address.location);
  assert.deepEqual(form.getValues("to_location"), address.location);

  form.setValue("from_location.address", "New origin");
  updateAddress(form, "from");
  assert.equal(form.getValues("from_location.address"), "New origin");
  assert.equal(form.getValues("from_location.lat"), "");
  assert.equal(form.getValues("from_location.lng"), "");
  assert.equal(form.getValues("from_location.lon"), "");
  assert.equal(form.getValues("fromLat"), "");
  assert.equal(form.getValues("fromLng"), "");

  form.setValue("to_location.address", "");
  updateAddress(form, "to");
  assert.equal(form.getValues("to_location.address"), "");
  assert.equal(form.getValues("toLat"), "");
  assert.equal(form.getValues("toLng"), "");
});
