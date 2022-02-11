// import "babel-plugin-transform-runtime"
module.exports = (api) => {
  // Cache configuration is a required option
  api.cache(false);

  const presets = ["@babel/preset-typescript", "@babel/preset-env"];

  const plugins = ["@babel/plugin-transform-runtime"];

  return { presets, plugins };
};
