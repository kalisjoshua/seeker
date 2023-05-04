import { assertEquals, assertThrows, stub } from "../deps.ts";

import { getDependencies } from "./getDependencies.ts";

const { setStubbedValues } = function () {
  const bufferLike = (str: string) =>
    new Uint8Array(str.split("").map((char) => char.charCodeAt(0)));

  const EMPTY_STUB_VALUE: Uint8Array = [] as unknown as Uint8Array;
  const stubbedValue = {
    stderr: EMPTY_STUB_VALUE,
    stdout: EMPTY_STUB_VALUE,
  };
  const setStubbedValues = (stderr?: string, stdout?: string) => {
    stubbedValue.stderr = stderr ? bufferLike(stderr) : EMPTY_STUB_VALUE;
    stubbedValue.stdout = stdout ? bufferLike(stdout) : EMPTY_STUB_VALUE;
  };

  stub(
    Deno,
    "Command",
    () => ({ outputSync: () => stubbedValue }),
  );

  return { setStubbedValues };
}();

function setModules(modules: Array<Array<string | Array<string>>> = []) {
  const PROJECT = "folder/src/";
  const FILE = `file://${PROJECT}`;
  const rHTTP = /^http/i;

  setStubbedValues(
    "",
    JSON.stringify({
      modules: modules.map(([name, ...deps]) => ({
        dependencies: deps
          .filter(({ length }) => length)
          .map(([name, specifier]) => ({
            specifier: specifier ? name : `./${name}`,
            code: { specifier: specifier ?? `${FILE}${name}` },
          })),
        local: rHTTP.test(name as string) ? name : `${PROJECT}${name}.ts`,
        specifier: rHTTP.test(name as string) ? name : `${FILE}/${name}.ts`,
      })),
    }),
  );
}

Deno.test("getDependencies - throws", function () {
  const err = "This is a testing error";
  setStubbedValues(err);

  assertThrows(() => {
    getDependencies("doesn't matter");
  }, "err");
});

Deno.test("getDependencies - no modules", function () {
  setModules();

  const result = getDependencies("anything");

  assertEquals(result, {});
});

Deno.test("getDependencies - one module, no dependencies", function () {
  setModules([
    [
      "isolated.ts",
    ],
  ]);

  const result = getDependencies("anything");

  assertEquals(result, {});
});

Deno.test("getDependencies - various", function () {
  setModules([
    [
      "only_remote_deps.ts",
      ["deno/fs/mod.ts", "https://deno.land/std@X.XXX.X/fs/mod.ts"],
      ["deno/path/mod.ts", "https://deno.land/std@X.XXX.X/path/mod.ts"],
    ],
    [
      "mixed_deps.ts",
      ["deno/fs/mod.ts", "https://deno.land/std@X.XXX.X/fs/mod.ts"],
      ["deno/path/mod.ts", "https://deno.land/std@X.XXX.X/path/mod.ts"],
      ["alpha.ts"],
      ["beta.ts"],
    ],
    [
      "only_local_deps.ts",
      ["charlie.ts"],
      ["epsilion.ts"],
    ],
    [
      "zero_deps.ts",
    ],
    [
      "https://deno.land/std@X.XXX.X/fs/copy.ts",
      ["../path/mod.ts", "https://deno.land/std@X.XXX.X/path/mod.ts"],
      ["./ensure_dir.ts", "https://deno.land/std@X.XXX.X/fs/ensure_dir.ts"],
    ],
  ]);

  assertEquals(getDependencies("anything"), {
    "folder/src/mixed_deps.ts.ts": [
      "folder/src/alpha.ts",
      "folder/src/beta.ts",
    ],
    "folder/src/only_local_deps.ts.ts": [
      "folder/src/charlie.ts",
      "folder/src/epsilion.ts",
    ],
  });

  assertEquals(getDependencies("anything", true), {
    "folder/src/mixed_deps.ts.ts": [
      "https://deno.land/std@X.XXX.X/fs/mod.ts",
      "https://deno.land/std@X.XXX.X/path/mod.ts",
      "folder/src/alpha.ts",
      "folder/src/beta.ts",
    ],
    "folder/src/only_local_deps.ts.ts": [
      "folder/src/charlie.ts",
      "folder/src/epsilion.ts",
    ],
    "folder/src/only_remote_deps.ts.ts": [
      "https://deno.land/std@X.XXX.X/fs/mod.ts",
      "https://deno.land/std@X.XXX.X/path/mod.ts",
    ],
    "https://deno.land/std@X.XXX.X/fs/copy.ts": [
      "https://deno.land/std@X.XXX.X/path/mod.ts",
      "https://deno.land/std@X.XXX.X/fs/ensure_dir.ts",
    ],
  });
});
