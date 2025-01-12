import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  env: {
    'cypress-react-selector': {
      root: '#__next_css__DO_NOT_USE__',
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  }
});
