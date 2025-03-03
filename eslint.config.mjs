// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
  {
    rules: {
      // this is a convention in prisma
      "@typescript-eslint/no-empty-object-type": "off",
      // sometimes you've gotta do it
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
