const defaultExclude = [
  /mod\.ts$/,
];

function findOrphan(
  graph: Record<string, Array<string>>,
  exclude = defaultExclude,
) {
  const deps = Object.entries(graph)
    .flatMap(([_, deps]) => deps);
  const unique = new Set(deps);
  const modules = Object.keys(graph);

  console.log(graph)

  return Array.from(modules)
    .filter((mod) =>
      !unique.has(mod) && !exclude.every((regex) => regex.test(mod))
    );
}

export { findOrphan };
