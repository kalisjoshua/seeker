# Seeker - A Dependency Graph Inspector

Working in large codebases comes with it's own challenges. Analyzing the dependency graph should not be one. Seeker reduces the burden of analysis by searching for:

  1. Circular dependencies
  2. Orphan files


## Use

Seeker can be used in unit testing to check for violations and exceptions.

```ts
import { assertEquals } from "std_lib/testing/asserts.ts";

import { report } from "user_land/circular/src/mod.ts";

Deno.test("seeker", function () {
  // either provide the root of the project or individual directories
  const result = report("..");

  // test that no circular dependencies or orphans exist
  assertEquals(result, {});
});

```


## Circular Dependencies

Obvious circular dependencies can sometimes easily go unnoticed, while deeply nested circular dependencies may not ever be something that gets noticed by maintainers over any length of time.

The simplest circular dependencie being:

```ts
// mod.ts
import libA from "./libA.ts";

export const GREETING = "Hello";

export function send(name: string) {
  libA(name);
}
```

```ts
// libA.ts
import { GREETING } from "./mod.ts";

export function libA(name: string) {
  console.log(`${GREATING} ${name}!`);
}
```

While circular dependencies might not always be a problem, they should still likely still be avoided.


## Orphan Files

Orphan files - files that aren't used in any way - don't cause problems but they do bloat the size of a project and add to the cognitive overhead when maintainers, and other curious developers, are searching through files looking for something interesting.
