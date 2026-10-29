// Reads every JSON file in /tokens and writes one CSS variables file.
// The site imports this file and must use only these variables.
export default {
  source: ['tokens/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'src/styles/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
  },
};
