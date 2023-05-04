/** Search through the graph, following imports, to find the dependencies that
 * create circular relationships. Returns an array of results; the results are
 * arrays of paths showing circular dependency chains.
 */
function findCircular(tree: Record<string, Array<string>>) {
  const startingValue: Array<Array<string>> = [];

  return Object.entries(tree)
    .reduce((acc, [module, depList]) => {
      const loop = simplify(traverse([module], depList, tree));
      const priorElement = acc.at(-1);
      const isUniqueLoop = !priorElement || !priorElement?.includes(loop[0]);

      if (loop.length && isUniqueLoop) {
        acc.push(loop);
      }

      return acc;
    }, startingValue);
}

// reduce the list of modules (string/path) to the minimal set that shows
// circular dependency
// e.g. [a, b, c, d, b] should be reducecd to [b, c, d]
function simplify(loop: Array<string>) {
  const last = loop.pop();

  return last ? loop.slice(loop.indexOf(last)) : [];
}

// recurse over the tree
function traverse(
  depChain: Array<string>,
  depList: Array<string>,
  tree: Record<string, Array<string>>,
): Array<string> {
  if (!depList.length) return [];

  return depList
    .flatMap((dependency) =>
      depChain.includes(dependency)
        ? depChain.concat(dependency)
        : traverse(depChain.concat(dependency), tree[dependency] || [], tree)
    );
}

export { findCircular };
