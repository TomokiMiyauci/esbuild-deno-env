import { createContents, denoEnvPlugin } from "./plugin.ts";
import { afterAll, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { build, stop } from "esbuild";

describe("createContents", () => {
  it("should return contents with no args", () => {
    expect(createContents()).toBe(`class DenoEnv {
  #env;
  constructor(init = {}){
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
}

const env = /* @__PURE__ */ new DenoEnv();

export { env as "Deno.env" };
`);
  });

  it("should return contents with JSON value", () => {
    expect(createContents({ a: "", b: "b", "c": "d" })).toBe(`class DenoEnv {
  #env;
  constructor(init = {}){
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
}

const env = /* @__PURE__ */ new DenoEnv({"a":"","b":"b","c":"d"});

export { env as "Deno.env" };
`);
  });
});

describe("denoEnvPlugin", () => {
  afterAll(async () => {
    await stop();
  });
  it("should inject Deno.env to bundle", async () => {
    const result = await build({
      stdin: {
        contents: `Deno.env.get("test");`,
      },
      write: false,
      bundle: true,
      format: "esm",
      plugins: [
        denoEnvPlugin({ test: "test-value" }),
      ],
    });

    expect(result.outputFiles[0].text).toBe(`// deno-env:deno-env:
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
var env = /* @__PURE__ */ new DenoEnv({ "test": "test-value" });

// <stdin>
env.get("test");
`);
  });

  it("should not inject Deno.env if `Deno.env` is not used", async () => {
    const result = await build({
      stdin: {
        contents: `console.log("test");`,
      },
      write: false,
      bundle: true,
      format: "esm",
      plugins: [
        denoEnvPlugin({ test: "test-value" }),
      ],
    });

    expect(result.outputFiles[0].text).toBe(`// <stdin>
console.log("test");
`);
  });

  it("should use first plugin if multiple plugin are registered", async () => {
    const result = await build({
      stdin: {
        contents: `Deno.env.get("test");`,
      },
      write: false,
      bundle: true,
      format: "esm",
      plugins: [
        denoEnvPlugin({ test: "test1" }),
        denoEnvPlugin({ test: "test2" }),
      ],
    });

    expect(result.outputFiles[0].text).toBe(`// deno-env:deno-env:
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
var env = /* @__PURE__ */ new DenoEnv({ "test": "test1" });

// <stdin>
env.get("test");
`);
  });
});
