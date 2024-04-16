class LoginPage {
  visitLoginPage() {
    cy.visit(Cypress.env("QKART_FRONTEND"));
  }

  getLoginFormTitle() {
    return cy.get(".MuiStack-root > :nth-child(1)");
  }

  getLogo() {
    return cy.get('img[src="logo_dark.svg"]');
  }

  getLoginLink() {
    return cy.get(".MuiStack-root > :nth-child(1)");
  }

  getBackToExploreButton() {
    return cy.get(".header > .MuiButtonBase-root");
  }

  getRegisterNowLink() {
    return cy.get("a");
  }

  getUsernameInput() {
    return cy.get("#username");
  }

  getPasswordInput() {
    return cy.get("#password");
  }

  getLoginButton() {
    return cy.get(".MuiStack-root > .MuiButtonBase-root");
  }

  getErrorMessage() {
    return cy.get("#notistack-snackbar");
  }

  // Add more methods as needed...
}

export default LoginPage;
