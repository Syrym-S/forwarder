import assert from "node:assert/strict";
import test from "node:test";
import IMask from "imask";
import { handlePhonePaste } from "../src/shared/helpers/handle-phone-paste.js";

function pastePhone(text, onChange) {
  let prevented = false;
  handlePhonePaste(
    {
      clipboardData: { getData: () => text },
      preventDefault: () => { prevented = true; },
    },
    onChange,
  );
  return prevented;
}

test("pasted full numbers keep every national digit and use one +7 prefix", () => {
  for (const initialValue of ["", "+7 (", "+7 (999) 111-22-33"]) {
    for (const pasted of [
      "87011234567",
      "8 (701) 123-45-67",
      "+7 (701) 123-45-67",
      "77011234567",
      "7011234567",
      "701 123 45 67",
      "\u00a08\u00a0701\u00a0123\u00a045\u00a067\n",
    ]) {
      const mask = IMask.createMask({ mask: "+{7} (000) 000-00-00" });
      mask.value = initialValue;

      assert.equal(pastePhone(pasted, (value) => { mask.value = value; }), true);
      assert.equal(mask.value, "+7 (701) 123-45-67", pasted);
      assert.equal(mask.unmaskedValue, "77011234567", pasted);
      assert.equal(mask.isComplete, true);
    }
  }
});

test("a ten-digit national number starting with 7 or 8 keeps its first digit", () => {
  for (const [pasted, expected] of [
    ["7771234567", "+7 (777) 123-45-67"],
    ["8001234567", "+7 (800) 123-45-67"],
  ]) {
    let value;
    assert.equal(pastePhone(pasted, (phone) => { value = phone; }), true);
    assert.equal(value, expected);
  }
});

test("plain profile fields receive the same normalized phone", () => {
  let value;
  assert.equal(pastePhone("8 701 123 45 67", (phone) => { value = phone; }), true);
  assert.equal(value, "+7 (701) 123-45-67");
});

test("partial numbers, empty text and other country codes keep normal paste behavior", () => {
  for (const pasted of ["", "phone", "8", "701", "123-45-67", "+44 20 7946 0958", "12345678901"]) {
    assert.equal(pastePhone(pasted, () => assert.fail("unexpected change")), false, pasted);
  }
});
