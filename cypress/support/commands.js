import RegisterPage from "../integration/pageObjects/RegisterPage";

const registerPage = new RegisterPage();

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
// ############### register command ######

Cypress.Commands.add("registerUser", ({ username, password }) => {
  cy.intercept("POST", `${Cypress.env("QKART_BACKEND")}/auth/register`, {
    statusCode: 201,
    body: { success: true },
  }).as("registerRequest");

  registerPage.getUsernameInput().type(username);
  registerPage.getPasswordInput().type(password);
  registerPage.getConfirmPasswordInput().type(password);
  registerPage.getRegisterButton().click();

  cy.wait("@registerRequest");
});

Cypress.Commands.add("mockRegisterError", (errorMessage) => {
  cy.intercept("POST", `${Cypress.env("QKART_BACKEND")}/auth/register`, {
    statusCode: 400,
    body: { success: false, message: errorMessage },
  }).as("registerRequest");
});

Cypress.Commands.add("goToExplorePage", () => {
  registerPage.getExploreButton().click();
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
