import { collectModules } from "./collectModules.ts";
import { findCircular } from "./findCircular.ts";
import { findOrphan } from "./findOrphan.ts";

const __deps = {
  collectModules,
  findCircular,
  findOrphan,
};

function seeker(...args: Parameters<typeof collectModules>) {
  const map = __deps.collectModules(...args);

  return {
    circular: __deps.findCircular(map),
    orphans: __deps.findOrphan(map),
  };
}

export { __deps, seeker };
