module.exports = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'all',
  plugins: [require.resolve('@prettier/plugin-ruby')],
  overrides: [
    {
      files: ['*.rb', '*.rake'],
      options: {
        parser: 'ruby',
        trailingComma: 'none',
      },
    },
  ],
};
