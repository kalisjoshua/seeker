import { assertEquals, assertMatch } from "deno.json//testing/asserts.ts";

import { report } from "./mod.ts";

Deno.test("check report results for seeker", function () {
  const { circular, orphans } = report(".");
  const [found = ""] = orphans;

  assertEquals(orphans.length, 1);
  assertMatch(found, /_for_unit_tests_only\.ts$/);

  assertEquals(circular, []);
});
