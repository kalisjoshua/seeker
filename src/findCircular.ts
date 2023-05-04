type Tree = Record<string, Array<string>>;

function findCircular(tree: Tree) {
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

function simplify(loop: Array<string>) {
  const last = loop.pop();

  return last ? loop.slice(loop.indexOf(last)) : [];
}

// recurse over the tree
function traverse(
  depChain: Array<string>,
  depList: Array<string>,
  tree: Tree,
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
