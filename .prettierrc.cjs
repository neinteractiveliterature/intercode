module.exports = {
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "all",
  "plugins": [require.resolve("@prettier/plugin-ruby")],
  "overrides": [
    {
      "files": "*.rb",
      "options": {
        "trailingComma": "none"
      }
    }
  ]
};
