const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const importPlugin = require("eslint-plugin-import");

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      import: importPlugin,
      "simple-import-sort": simpleImportSort,
    },

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },

    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"],
            ["^.+\\.(css|scss|sass)$", "^.+\\.(png|jpe?g|svg|gif|webp)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "import/no-unresolved": "error",
    },
  },

  { ignores: ["dist/*"] },
]);
