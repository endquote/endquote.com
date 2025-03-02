// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // https://eslint.vuejs.org/rules/
  {
    rules: {
      // this seems to fight with prettier https://github.com/vuejs/eslint-plugin-vue/issues/2232#issuecomment-1625723163
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "any",
          },
        },
      ],
    },
  },
);
