import { WalkOptions, walkSync } from "https://deno.land/std@0.184.0/fs/mod.ts";
import { resolve } from "https://deno.land/std@0.184.0/path/mod.ts";

import { getDependencies } from "./getDependencies.ts";

const defOpts = {
  includeDirs: false,
  match: [/\.ts$/],
};

const __deps = {
  getDependencies,
  resolve,
  walker: (dir: string, options: WalkOptions = defOpts) =>
    Array.from(walkSync(dir, options)),
};

/** Create a flat map/record/tree of the modules and their local dependencies;
 * the resulting map will be only one level deep, a key/value pairing of module
 * to a list of dependencies found within. Only one map will be returned, if
 * multiple source directories are provided all dependencies will be joined.
 *
 * @param {Array<string> | string} dirs - The directory/directories to search
 * for modules within.
 * @param {WalkOptions} options - {@link WalkOptions}
 *
 * @example
 * ``` typescript
 * import { collectModules } from "seeker/collectModules.ts"
 *
 * // single directory
 * const result = collectModules("./src")
 *
 * // many directories
 * const result = collectModules([
 *   "./src",
 *   "./_tools",
 *   "./lib",
 * ])
 *
 * // If the modules found have dependencies the return value
 * // will be a simple (non-nested) map/record/tree of the
 * // key/value relationships.
 * ```
 */
function collectModules(
  dirs: Array<string> | string,
  options?: WalkOptions,
): Record<string, Array<string>> {
  return Object.fromEntries(
    (Array.isArray(dirs) ? dirs : [dirs])
      .flatMap((dir) => __deps.walker(__deps.resolve(dir), options))
      .map(({ path }) => [
        path,
        __deps.getDependencies(path)[path] || [],
      ]),
  );
}

export { __deps, collectModules };
