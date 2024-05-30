module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.js',
      options: {
        semi: true,
        singleQuote: true,
        spaceBeforeFunctionParen: false,
        spaceAfterKeywords: true,
        // Add or modify the overrides here
      },
    },
  ],
};
