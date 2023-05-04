import { assertEquals } from "../deps.ts";

import { findOrphans } from "./findOrphans.ts";

Deno.test("findOrphans - no orphans", function () {
  assertEquals(findOrphans({}), []);

  assertEquals(
    findOrphans({
      "mod.ts": ["b.ts"],
      "b.ts": ["c.ts"],
      "c.ts": ["d.ts"],
      "mod_test.ts": ["mod.ts"],
      "mod-test.ts": ["mod.ts"],
    }),
    [],
  );
});

Deno.test("findOrphans - orphan", function () {
  assertEquals(
    findOrphans({
      "mod.ts": ["b.ts", "c.ts"],
      "b.ts": ["c.ts"],
      "d.ts": ["e.ts"],
    }),
    [
      "d.ts",
    ],
  );
});
