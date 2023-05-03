import { WalkEntry } from "deno/fs/walk.ts";
import { assertEquals } from "deno/testing/asserts.ts";

import { __deps, collectModules } from "./collectModules.ts";

let fsMock: Record<string, string>;
let modules: Array<WalkEntry>;

function addModule(dir: string, name: string, content: string) {
  const path = `${dir}${name}`;

  fsMock[path] = content;

  modules.push({
    path,
    name,
    isFile: true,
    isDirectory: false,
    isSymlink: false,
  });
}

function reset() {
  fsMock = {};
  modules = [];
}

__deps.getDependencies = (path: string) => ({
  [path]: {
    "src/hasDependencies.ts": [
      "./depA.ts",
      "./depB.ts",
      "./depC.ts",
      "./depD.ts",
    ],
    // "src/orphan.ts": [],
  }[path],
} as Record<string, Array<string>>);
__deps.resolve = (path: string) => path;
__deps.walker = () => modules;

Deno.test("collectModules", function () {
  reset();

  addModule(
    "src/",
    "hasDependencies.ts",
    `
    import * as fs from "https://deno.land/std@0.184.0/fs/mod.ts"

    import { depA } from "./depA.ts"
    import { depB } from "./depB.ts"

    export * from "./depC.ts";

    export {
      item1,
      item2,
      item3,
      item4,
    } from "./depD.ts";

    // ...
  `,
  );

  addModule(
    "src/",
    "depOrphan.ts",
    `
    import * as fs from "std/path/mod.ts"

    // no local imports; should be filtered out
  `,
  );

  const exp = {
    "src/hasDependencies.ts": [
      "./depA.ts",
      "./depB.ts",
      "./depC.ts",
      "./depD.ts",
    ],
  };

  assertEquals(collectModules("."), exp);
});
