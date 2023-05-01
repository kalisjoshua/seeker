import { resolve } from "deno/path/mod.ts";

import { reader, walker } from "./_reader.ts";
import { searchPatterns } from "./searchPatterns.ts";
import { WalkOptions } from "https://deno.land/std@0.184.0/fs/walk.ts";

const __deps = {
  reader,
  resolve,
  walker,
};

/** Create a flat map/record/tree of the modules and their local dependencies;
 * the resulting map will be only one level deep, a key/value pairing of module
 * to a list of dependencies found within. Modules without dependencies will be
 * excluded in the returned value. Only one map will be returned, if multiple
 * source directories are initially provided all dependencies will be joined.
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
  const files = Array.isArray(dirs)
    ? dirs.map((dir) => __deps.walker(dir, options)).flat()
    : __deps.walker(dirs, options);

  return files
    .map(({ path }) => findFileDependencies(path))
    .filter(({ deps }) => deps.length)
    .reduce((acc, { deps, path }) => ({ ...acc, [path]: deps }), {});
}

function findFileDependencies(path: string) {
  return {
    path: __deps.resolve(path),
    deps: __deps.reader(path)
      .split("\n")
      .filter((line) => searchPatterns.some((pattern) => pattern.test(line)))
      .reduce(matchingFilepathReducer, []),
  };
}

function matchingFilepathReducer(acc: Array<string>, line: string) {
  const match = searchPatterns
    .flatMap((pattern) => pattern.exec(line))
    .slice(2)
    .at(0);

  if (match) {
    acc.push(__deps.resolve(match));
  }

  return acc;
}

export { __deps, collectModules };
