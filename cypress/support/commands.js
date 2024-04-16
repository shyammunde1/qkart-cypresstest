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

// ############### login command ######

Cypress.Commands.add("loginApiCall", ({ username, password }) => {
  cy.get("#username").type(username);
  cy.get("#password").type(password);
  cy.get(".MuiStack-root > .MuiButtonBase-root").click();

  // Wait for login success
  cy.url().should("include", "/login"); // Assuming successful login redirects away from the login page

  // Wait for the token to be set in localStorage
  cy.wait(2000); // Adjust the wait time as needed

  // Retrieve the token from localStorage
  const token = window.localStorage.getItem("token");
  console.log(token);

  // Store the token in a Cypress variable for later use
  Cypress.env("token", token);
});

Cypress.Commands.add("mockLoginError", (errorMessage) => {
  cy.intercept("POST", `${Cypress.env("QKART_BACKEND")}/auth/login`, {
    statusCode: 400,
    body: { success: false, message: errorMessage },
  }).as("loginRequest");
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
