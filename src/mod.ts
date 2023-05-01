export { collectModules } from "./collectModules.ts";
export { findCircular } from "./findCircular.ts";
export { findOrphan } from "./findOrphan.ts";
export { seeker } from "./seeker.ts";

/* example CLI usage
import { collectModules, findCircular } from "./mod.ts";

if (!Deno.args.length) throw new Error("No paths provided.");

findCircular(collectModules(Deno.args));
*/
