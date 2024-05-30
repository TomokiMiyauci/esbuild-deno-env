import { createContents } from "./plugin.ts";
import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

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
