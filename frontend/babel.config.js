const plugins = []                            //
if (process.env.NODE_ENV !== "production"){   // experimental, can be commented (react-refresh)
  plugins.push("react-refresh/babel")         //
}

module.exports = {
  presets: [
    "@babel/preset-env",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: plugins, // experimental, can be commented (react-refresh)
};
