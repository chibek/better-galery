module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
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
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
