type Info = {
  modules: Array<{
    dependencies?: Array<{
      code?: { specifier: string };
    }>;
    local: string;
    specifier: string;
  }>;
};

const decoder = new TextDecoder("utf-8");
const rFile = /^file:\/\//;
const rHttp = /^http/;

/** Get the dependencies graph of a given module. */
function getDependencies(path: string, includeExternal = false) {
  const modules = getModules(path);
  const record: Record<string, Array<string>> = {};

  return modules
    .reduce((acc, { dependencies = [], local, specifier }) => {
      const deps = dependencies
        .map((dep) => (dep.code?.specifier || "").replace(rFile, ""))
        // filter local/external __dependencies__ (of the module)
        .filter((route) => !includeExternal ? !rHttp.test(route) : true);

      // filter local/external __modules__
      if (deps.length && (includeExternal || !rHttp.test(specifier))) {
        acc[local] = deps;
      }

      return acc;
    }, record);
}

// use `deno info --json [path]` to get dependency graph info
function getModules(path: string) {
  const options = { args: ["info", "--json", path] };
  const command = new Deno.Command(Deno.execPath(), options);
  const cmdResult = command.outputSync();

  if (cmdResult.stderr.length) {
    throw new Error(decoder.decode(cmdResult.stderr));
  }

  const { modules }: Info = JSON.parse(decoder.decode(cmdResult.stdout));

  return modules;
}

export { getDependencies };
