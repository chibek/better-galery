module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo"]],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          alias: {
            "@app": "./src/app",
            "@components": "./src/components",
            "@styles": "./src/styles",
            "@hooks": "./src/hooks",
            "@utils": "./src/utils",
            "@api": "./src/api",
            "@db": "./src/db",
            "@drizzle": "./drizzle",
            "@views": "./src/views",
          },
        },
      ],
      "react-native-worklets/plugin",
      ["inline-import", { extensions: [".sql"] }],
    ],
  };
};
