const { defineConfig } = require("cypress");

async function setupNodeEvents(on, config) {
  // implement node event listeners here
  require("cypress-mochawesome-reporter/plugin")(on);
  return config;
}

module.exports = defineConfig({
  reporter: "cypress-mochawesome-reporter",
  env: {
    QKART_FRONTEND: "https://qkart-frontend-six-flame.vercel.app",
    QKART_BACKEND: "https://qkart-frontend1-jfw4.onrender.com/api/v1",
  },
  reporterOptions: {
    charts: true,
    reportPageTitle: "Qkart Test Report",
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },
  projectId: "d2pyp7",

  e2e: {
    setupNodeEvents,
    specPattern: "cypress/integration/qkart/*.js",
    experimentalModifyObstructiveThirdPartyCode: true,
    defaultCommandTimeout: 10000,
  },
});
