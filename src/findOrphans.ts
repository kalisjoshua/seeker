const defaultExclude = [
  /\bmod\.ts$/,
  /test\.ts$/,
];

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
