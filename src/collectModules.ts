import { WalkOptions, walkSync } from "deno.json//fs/mod.ts";
import { resolve } from "deno.json//path/mod.ts";

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

/** Create a graph of the modules and their *local* dependencies; the resulting
 * graph will be only one level deep, a key/value pairing of module to a array
 * of dependencies. A combined graph will be return if multiple directories are
 * supplied as locations of modules.
 *
 * @param {Array<string> | string} dirs - The directory/directories to search
 * for modules within.
 * @param {WalkOptions} options - {@link WalkOptions}
 *
 * @example
 * ``` typescript
 * import { collectModules } from "https://api.deno.land/webhook/gh/seeker@1.0.0/collectModules.ts"
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
