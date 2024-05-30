/** `Deno.env` mock. */
export class DenoEnv implements Deno.Env {
  #env: Map<string, string>;
  constructor(init: Record<string, string> = {}) {
    this.#env = new Map(Object.entries(init));
  }

  get(key: string): string | undefined {
    return this.#env.get(key);
  }

  delete(key: string): void {
    this.#env.delete(key);
  }

  set(key: string, value: string): void {
    this.#env.set(key, value);
  }

  has(key: string): boolean {
    return this.#env.has(key);
  }

  toObject(): { [index: string]: string } {
    return Object.fromEntries(this.#env);
  }
}
