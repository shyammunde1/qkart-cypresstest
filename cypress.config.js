const { defineConfig } = require("cypress");

module.exports = defineConfig({
  defaultCommandTimeout: 5000,
  env: {
    QKART_FRONTEND: "https://qkart-frontend-six-flame.vercel.app",
    QKART_BACKEND: "https://qkart-frontend1-jfw4.onrender.com/api/v1",
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "cypress/integration/qkart/*.js",
  },
});
