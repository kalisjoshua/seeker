import { WalkOptions, walkSync } from "deno/fs/mod.ts";

const decoder = new TextDecoder("utf-8");
const __deps = {
  walkSync,
};

function reader(path: string) {
  return decoder.decode(Deno.readFileSync(path));
}

function walker(dir: string, options?: WalkOptions) {
  return Array.from(__deps.walkSync(dir, {
    includeDirs: false,
    match: [/\.ts$/],
    skip: [/test\.ts$/],
    ...options,
  }));
}

export { __deps, reader, walker };
