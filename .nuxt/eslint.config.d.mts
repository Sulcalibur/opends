import type { FlatConfigComposer } from "../node_modules/.pnpm/eslint-flat-config-utils@2.1.4/node_modules/eslint-flat-config-utils/dist/index.mjs"
import { defineFlatConfigs } from "../node_modules/.pnpm/@nuxt+eslint-config@1.12.1_@typescript-eslint+utils@8.50.1_eslint@9.39.2_jiti@1.21.7__t_e6be5443f8fb0762a6d6bea050d0cfe1/node_modules/@nuxt/eslint-config/dist/flat.mjs"
import type { NuxtESLintConfigOptionsResolved } from "../node_modules/.pnpm/@nuxt+eslint-config@1.12.1_@typescript-eslint+utils@8.50.1_eslint@9.39.2_jiti@1.21.7__t_e6be5443f8fb0762a6d6bea050d0cfe1/node_modules/@nuxt/eslint-config/dist/flat.mjs"

declare const configs: FlatConfigComposer
declare const options: NuxtESLintConfigOptionsResolved
declare const withNuxt: typeof defineFlatConfigs
export default withNuxt
export { withNuxt, defineFlatConfigs, configs, options }