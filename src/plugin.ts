import { DenoEnv } from "./env.ts";
import { NAMESPACE, SYMBOL, template } from "./constants.ts";
import { format } from "@miyauci/format";
import { escape } from "@std/regexp";
import type { Plugin } from "esbuild";

const key = "deno-env:";

/** Create plugin to inject `Deno.env` mock to global.
 *
 * @param values Environment variables at invocation.
 * @returns An esbuild plugin.
 * @example
 *  ```ts
 * import { denoEnvPlugin } from "@miyauci/esbuild-deno-env";
 * import { build } from "esbuild";
 *
 * declare const env: { ENDPOINT: string };
 *
 * await build({
 *  stdin: {
 *    contents: `Deno.env.get("ENDPOINT");`,
 *  },
 *  plugins: [denoEnvPlugin(env)],
 *  bundle: true,
 *  format: "esm",
 * });
 * ```
 */
export function denoEnvPlugin(values?: Record<string, string>): Plugin {
  return {
    name: "deno-env",
    setup(build) {
      const { initialOptions } = build;
      if (initialOptions.inject) initialOptions.inject.push(key);
      else initialOptions.inject = [key];

      const contents = createContents(values);
      const escapedKey = escape(key);
      const filter = new RegExp(`^${escapedKey}$`);

      // Injected specifier's namespace is always empty.
      build.onResolve({ filter, namespace: "" }, (args) => {
        return { path: args.path, namespace: NAMESPACE, sideEffects: false };
      });

      build.onLoad({ filter: /.*/, namespace: NAMESPACE }, () => {
        return { contents };
      });
    },
  };
}

export function createContents(record?: Record<string, string>): string {
  return format(template, {
    class: DenoEnv.toString(),
    className: DenoEnv.name,
    symbol: SYMBOL,
    init: record ? JSON.stringify(record) : "",
  }, { placeholders: [{ prefix: "[", suffix: "]" }] });
}
