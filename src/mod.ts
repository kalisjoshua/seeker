export { collectModules } from "./collectModules.ts";
export { findCircular } from "./findCircular.ts";
export { findOrphans } from "./findOrphans.ts";
export { report } from "./report.ts";

/* example CLI usage
import { report } from "./mod.ts";

if (!Deno.args.length) throw new Error("No paths provided.");

report(Deno.args);
*/
