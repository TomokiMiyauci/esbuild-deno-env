import { DenoEnv } from "./env.ts";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

interface This {
  env: DenoEnv;
}

describe("DenoEnv", () => {
  beforeEach<This>(function () {
    this.env = new DenoEnv();
  });

  it<This>("should return undefined if the key does not exist", function () {
    expect(this.env.get("unknown")).toBe(undefined);
  });

  it<This>("should return value if the key exist", function () {
    this.env.set("unknown", "value");
    expect(this.env.get("unknown")).toBe("value");
  });

  it<This>("should set value", function () {
    this.env.set("unknown", "value");
    expect(this.env.get("unknown")).toBe("value");
  });

  it<This>("should return true if the key has", function () {
    expect(this.env.has("unknown")).toBeFalsy();
    this.env.set("unknown", "value");
    expect(this.env.has("unknown")).toBeTruthy();
  });

  it<This>("should delete key", function () {
    this.env.set("unknown", "value");
    expect(this.env.has("unknown")).toBeTruthy();
    this.env.delete("unknown");
    expect(this.env.has("unknown")).toBeFalsy();
  });

  it<This>("should return all entries", function () {
    expect(this.env.toObject()).toEqual({});

    this.env.set("unknown", "value");
    expect(this.env.toObject()).toEqual({ unknown: "value" });

    this.env.delete("unknown");
    expect(this.env.toObject()).toEqual({});
  });
});
