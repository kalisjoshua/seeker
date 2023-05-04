import { assertEquals, assertMatch } from "deno/testing/asserts.ts";

import { report } from "./mod.ts";

Deno.test("check for circular dependencies", function () {
  const { orphans = [], ...rest } = report(".");
  const [found = ""] = orphans;

  assertEquals(orphans.length, 1);
  assertMatch(found, /_for_unit_tests_only\.ts$/);

  assertEquals(rest, {});
});
