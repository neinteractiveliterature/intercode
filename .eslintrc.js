module.exports = {
  ecmaFeatures: {
    modules: true,
    jsx: true,
  },

  env: {
    amd: true,
    browser: true,
    es6: true,
    jquery: false,
    node: true,
  },

  extends: "airbnb",
  parser: "babel-eslint",
};
