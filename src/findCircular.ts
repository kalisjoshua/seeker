function findCircular(paths: Record<string, Array<string>>) {
  function recur(
    depChain: Array<string>,
    depList: Array<string>,
  ): Array<string> {
    if (!depList.length) return [];

    return depList
      .flatMap((dependency) =>
        depChain.includes(dependency)
          ? depChain.concat(dependency)
          : recur(depChain.concat(dependency), paths[dependency] || [])
      );
  }

  return Object.entries(paths)
    .reduce((acc, [module, depList]) => {
      const loop = recur([module], depList).slice(0, -1);
      const prev = acc.at(-1);
      const repeat = prev?.includes(module);

      if (loop.length && (!prev || !repeat)) {
        acc.push(loop);
      }

      return acc;
    }, [] as Array<Array<string>>);
}

export { findCircular };
