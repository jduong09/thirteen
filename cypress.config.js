import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  env: {
    'cypress-react-selector': {
      root: '#__cy_root',
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
