# esbuild-deno-env

[![JSR](https://jsr.io/badges/@miyauci/format)](https://jsr.io/@miyauci/esbuild-deno-env)
[![codecov](https://codecov.io/gh/TomokiMiyauci/esbuild-deno-env/graph/badge.svg?token=7gxIwWKnxy)](https://codecov.io/gh/TomokiMiyauci/esbuild-deno-env)
[![GitHub](https://img.shields.io/github/license/TomokiMiyauci/esbuild-deno-env)](https://github.com/TomokiMiyauci/esbuild-deno-env/blob/main/LICENSE)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg)](https://github.com/RichardLitt/standard-readme)

An [esbuild](https://github.com/evanw/esbuild) plugin for
[Deno.env](https://docs.deno.com/runtime/manual/basics/env_variables#built-in-denoenv).

## Table of Contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)

## Install

deno:

```bash
deno add @miyauci/esbuild-deno-env
```

node:

```bash
npx jsr add @miyauci/esbuild-deno-env
```

## Usage

The `denoEnvPlugin` adds a mock
[`Deno.env`](https://docs.deno.com/runtime/manual/basics/env_variables#built-in-denoenv)
to the bundle through esbuild [`inject`](https://esbuild.github.io/api/#inject).

It receives the initial values of the environment variables.

```ts
import { denoEnvPlugin } from "@miyauci/esbuild-deno-env";
import { build } from "esbuild";

declare const env: { ENDPOINT: string };

await build({
  stdin: {
    contents: `Deno.env.get("ENDPOINT");`,
  },
  plugins: [denoEnvPlugin(env)],
  bundle: true,
  format: "esm",
});
```

output:

```js
// deno-env:deno-env:
var DenoEnv = class {
  #env;
  constructor(init = {}) {
    this.#env = new Map(Object.entries(init));
  }
  get(key) {
    return this.#env.get(key);
  }
  set(key, value) {
    this.#env.set(key, value);
  }
  delete(key) {
    this.#env.delete(key);
  }
  has(key) {
    return this.#env.has(key);
  }
  toObject() {
    return Object.fromEntries(this.#env);
  }
};
var env = /* @__PURE__ */ new DenoEnv({ "ENDPOINT": "<ENDPOINT>" });

// <stdin>
console.log(env.get("ENDPOINT"));
```

## API

See [jsr doc](https://jsr.io/@miyauci/esbuild-deno-env) for all APIs.

## Contributing

See [contributing](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2024 Tomoki Miyauchi
