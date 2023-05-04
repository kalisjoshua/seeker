import { collectModules } from "./collectModules.ts";
import { findCircular } from "./findCircular.ts";
import { findOrphans } from "./findOrphans.ts";

const __deps = {
  collectModules,
  findCircular,
  findOrphans,
};

/** Generate the report for inspection/review/use in unit tests or other...
 *
 * @example
 * ```ts
 * import { assertEquals } from "https://deno.land/std@0.184.0/testing/asserts.ts";
 *
 * import { report } from "https://api.deno.land/webhook/gh/seeker@1.0.0/mod.ts";
 *
 * Deno.test("dependency graph inspection", function () {
 *   const { circular, orphans } = report("..");
 *
 *   assertEquals(circular.length, 0);
 *   assertEquals(orphans.length, 0);
 * });
 * ```
 */
function report(...args: Parameters<typeof collectModules>) {
  const depsGraph = __deps.collectModules(...args);

  return {
    circular: __deps.findCircular(depsGraph),
    orphans: __deps.findOrphans(depsGraph),
  };
}

export { __deps, report };
