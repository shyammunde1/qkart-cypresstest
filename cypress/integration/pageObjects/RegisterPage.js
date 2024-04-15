class RegisterPage {
  visitRegisterPage() {
    cy.visit(`${Cypress.env("QKART_FRONTEND")}/register`);
  }

  getTitle() {
    return cy.get(".title");
  }

  getLogo() {
    return cy.get('img[src="logo_dark.svg"]');
  }

  getExploreButton() {
    return cy.get(".explore-button");
  }

  getLoginLink() {
    return cy.get("a").contains("Login here");
  }

  getUsernameInput() {
    return cy.get("#username");
  }

  getPasswordInput() {
    return cy.get("#password");
  }

  getConfirmPasswordInput() {
    return cy.get("#confirmPassword");
  }

  getRegisterButton() {
    return cy.get("button.MuiButton-containedPrimary");
  }

  getErrorMessage() {
    return cy.get("#notistack-snackbar");
  }

  // Add more methods as needed...
}

export default RegisterPage;
