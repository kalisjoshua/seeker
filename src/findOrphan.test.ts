import { assertEquals } from "deno/testing/asserts.ts";

import { findOrphan } from "./findOrphan.ts";

Deno.test("findOrphan - no orphans", function () {
  assertEquals(findOrphan({}), []);

  assertEquals(
    findOrphan({
      "mod.ts": ["b.ts"],
      "b.ts": ["c.ts"],
      "c.ts": ["d.ts"],
    }),
    [],
  );
});

Deno.test("findOrphan - orphan", function () {
  assertEquals(
    findOrphan({
      "mod.ts": ["b.ts", "c.ts"],
      "b.ts": ["c.ts"],
      "d.ts": ["e.ts"],
    }),
    [
      "d.ts",
    ],
  );
});
