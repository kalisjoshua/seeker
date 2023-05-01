import { assertEquals } from "deno/testing/asserts.ts";

import { findCircular } from "./findCircular.ts";

Deno.test("findCircular - no circular deps", function () {
  assertEquals(findCircular({}), []);

  assertEquals(
    findCircular(
      {
        "a.ts": ["b.ts"],
        "b.ts": ["c.ts"],
        "c.ts": ["d.ts"],
        "d.ts": ["e.ts"],
      },
    ),
    [],
  );
});

Deno.test("findCircular - basic circular deps", function () {
  assertEquals(
    findCircular(
      {
        "a.ts": ["b.ts"],
        "b.ts": ["a.ts"],
      },
    ),
    [
      ["a.ts", "b.ts"],
    ],
  );
});

Deno.test("findCircular - multiple circular deps", function () {
  assertEquals(
    findCircular(
      {
        "a.ts": ["b.ts"],
        "b.ts": ["a.ts"],

        "x.ts": ["y.ts"],
        "y.ts": ["z.ts"],
        "z.ts": ["x.ts"],
      },
    ),
    [
      ["a.ts", "b.ts"],
      ["x.ts", "y.ts", "z.ts"],
    ],
  );
});

Deno.test("findCircular - deep circular deps", function () {
  assertEquals(
    findCircular(
      {
        "a.ts": ["b.ts"],
        "b.ts": ["c.ts"],
        "c.ts": ["d.ts"],
        "d.ts": ["e.ts"],
        "e.ts": ["a.ts"],
      },
    ),
    [
      [
        "a.ts",
        "b.ts",
        "c.ts",
        "d.ts",
        "e.ts",
      ],
    ],
  );
});
