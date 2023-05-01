import { assertEquals } from "deno/testing/asserts.ts";
import { stub } from "deno/testing/mock.ts";

import { __deps, seeker } from "./seeker.ts";

const TESTING_VALUE = "Testing value.";
const TESTING_MAP = { mod: [TESTING_VALUE] };

const stubs = {
  collect: stub(__deps, "collectModules", () => TESTING_MAP),
  circular: stub(__deps, "findCircular", () => [[TESTING_VALUE]]),
  orphans: stub(__deps, "findOrphan", () => [TESTING_VALUE]),
};

Deno.test("seeker", function () {
  const actual = seeker(".");
  const exp = {
    circular: [[TESTING_VALUE]],
    orphans: [TESTING_VALUE],
  };

  assertEquals(stubs.collect.calls.length, 1);
  assertEquals(stubs.circular.calls.length, 1);
  assertEquals(stubs.orphans.calls.length, 1);

  assertEquals(stubs.circular.calls[0].args[0], TESTING_MAP);
  assertEquals(stubs.orphans.calls[0].args[0], TESTING_MAP);

  assertEquals(actual, exp);
});
