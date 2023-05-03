import { assertEquals } from "deno/testing/asserts.ts";

import { report } from "./mod.ts";

Deno.test("check for circular dependencies", function () {
  const actual = report(".");

  assertEquals(actual, {});
});
