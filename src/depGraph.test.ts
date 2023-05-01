import { assertEquals } from "deno/testing/asserts.ts";

import { seeker } from "./mod.ts";

Deno.test("check for circular dependencies", function () {
  const actual = seeker(".");

  assertEquals(actual, { circular: [], orphans: [] });
});
