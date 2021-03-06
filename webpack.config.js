const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const OUTPUT_PATH = __dirname + "/app";

const main = {
  mode: "development",
  entry: "./src/main.ts",
  target: "electron-main",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: "ts-loader" }],
      },
    ],
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".ts", ".json", ".tsx"],
  },
  output: {
    path: OUTPUT_PATH,
    filename: "main.js",
  },
};

const renderer = {
  mode: "development",
  entry: "./src/renderer.tsx",
  target: "electron-renderer",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts(x?)$/,
        include: /src/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".ts", ".json", ".tsx"],
  },
  output: {
    path: OUTPUT_PATH,
    filename: "renderer.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyPlugin([
      { from: "package.json", to: `${OUTPUT_PATH}/package.json` },
      { from: "LICENSE", to: `${OUTPUT_PATH}/LICENSE` },
    ]),
  ],
};

const gitEditor = {
  mode: "development",
  entry: "./src/git-editor.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
    ],
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".ts", ".json", ".tsx"],
  },
  output: {
    path: OUTPUT_PATH,
    filename: "git-editor.js",
  },
};

module.exports = [main, renderer, gitEditor];
