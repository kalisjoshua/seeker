import { assertEquals, stub } from "../deps.ts";

import { __deps, report } from "./report.ts";

const setStubValues = function () {
  const ORPHANS = ["testing value"];
  const CIRCULAR = [ORPHANS];

  const expected: {
    circular?: ReturnType<typeof __deps.findCircular>;
    orphans?: ReturnType<typeof __deps.findOrphans>;
  } = {};

  stub(__deps, "findCircular", () => (expected.circular || []));
  stub(__deps, "findOrphans", () => (expected.orphans || []));

  function setStubValues(loop: boolean, lonely: boolean) {
    expected.circular = loop ? CIRCULAR : [];
    expected.orphans = lonely ? ORPHANS : [];

    return expected;
  }

  return setStubValues;
}();

Deno.test("report - no values", function () {
  setStubValues(false, false);

  const { circular, orphans } = report(".");

  assertEquals(circular.length, 0);
  assertEquals(orphans.length, 0);
});

Deno.test("report - both values", function () {
  const expected = setStubValues(true, true);

  assertEquals(report("."), expected);
});

Deno.test("report - only circular", function () {
  const expected = setStubValues(true, false);

  assertEquals(report("."), expected);
});

Deno.test("report - only orphans", function () {
  const expected = setStubValues(false, true);

  assertEquals(report("."), expected);
});
