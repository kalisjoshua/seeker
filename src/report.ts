import { collectModules } from "./collectModules.ts";
import { findCircular } from "./findCircular.ts";
import { findOrphans } from "./findOrphans.ts";

type Report = {
  circular?: ReturnType<typeof findCircular>;
  orphans?: ReturnType<typeof findOrphans>;
};

const __deps = {
  collectModules,
  findCircular,
  findOrphans,
};

function report(...args: Parameters<typeof collectModules>): Report {
  const depsGraph = __deps.collectModules(...args);
  const fullReport = {
    circular: __deps.findCircular(depsGraph),
    orphans: __deps.findOrphans(depsGraph),
  };

  return Object.fromEntries(
    Object.entries(fullReport)
      .filter(([_, { length }]) => length),
  );
}

export { __deps, report };
