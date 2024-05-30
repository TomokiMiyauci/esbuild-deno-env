export const NAMESPACE = "deno-env";

export const template = `[class]

const env = /* @__PURE__ */ new [className]([init]);

export { env as "[symbol]" };
`;

export const SYMBOL = "Deno.env";
