import { assertEquals } from "deno/testing/asserts.ts";
import { stub } from "deno/testing/mock.ts";

import { __deps, report } from "./report.ts";

let expected: {
  circular?: ReturnType<typeof __deps.findCircular>;
  orphans?: ReturnType<typeof __deps.findOrphans>;
} = {};

stub(__deps, "findCircular", () => (expected.circular || []));
stub(__deps, "findOrphans", () => (expected.orphans || []));

Deno.test("report - no values", function () {
  assertEquals(report("."), {});
});

Deno.test("report - circular", function () {
  expected = {
    circular: [["testing value"]],
  };

  assertEquals(report("."), expected);
});

Deno.test("report - orphans", function () {
  expected = {
    orphans: ["testing value"],
  };

  assertEquals(report("."), expected);
});

Deno.test("report - both", function () {
  expected = {
    circular: [["testing value"]],
    orphans: ["testing value"],
  };

  assertEquals(report("."), expected);
});
