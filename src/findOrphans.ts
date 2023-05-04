const defaultExclude = [
  /\bmod\.ts$/, // Is this a good idea?
  /test\.ts$/,
];

/** Search through the graph, following imports, to find the dependencies that
 * are not depended on by any other modules. These are modules that have likely
 * been useful at some point but have been forgotten and should be removed.
 */
function findOrphans(
  graph: Record<string, Array<string>>,
  exclude = defaultExclude,
) {
  const deps = Object.entries(graph)
    .flatMap(([_, deps]) => deps);
  const unique = new Set(deps);
  const modules = Object.keys(graph);

  return Array.from(modules)
    .filter((mod) =>
      !unique.has(mod) && !exclude.some((regex) => regex.test(mod))
    );
}

export { findOrphans };
