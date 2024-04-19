import RegisterPage from "../pageObjects/RegisterPage";

const registerPage = new RegisterPage();

describe("Register Page", () => {
  beforeEach(() => {
    cy.log("QKART_URL:", Cypress.env("QKART_FRONTEND"));

    if (!Cypress.env("QKART_FRONTEND")) {
      cy.log("QKART_URL is not defined");
    }

    // cy.visit(`${Cypress.env("QKART_FRONTEND")}/register`);
    registerPage.visitRegisterPage();
  });

  it("should display register form", () => {
    registerPage.getTitle().should("contain", "Register");
    registerPage.getLogo().should("exist");
    registerPage.getExploreButton().contains("Back to explore");
    registerPage.getLoginLink().contains("Login here");
  });

  it("should show error message if username is empty", () => {
    registerPage.getPasswordInput().type("sam12345");
    registerPage.getRegisterButton().click();
    registerPage.getErrorMessage().should("contain", "required");
  });

  it("should show error message if username is less than 6 characters", () => {
    registerPage.getUsernameInput().type("sam");
    registerPage.getPasswordInput().type("sammunde");
    registerPage.getConfirmPasswordInput().type("sammunde");
    registerPage.getRegisterButton().click();
    registerPage.getErrorMessage().should("contain", "6");
  });

  it("should show error message if password is empty", () => {
    registerPage.getUsernameInput().type("sam123");
    registerPage.getRegisterButton().click();
    registerPage.getErrorMessage().should("contain", "required");
  });

  it("should show error message if password is less than 6 characters", () => {
    registerPage.getUsernameInput().type("sam123");
    registerPage.getPasswordInput().type("sam");
    registerPage.getConfirmPasswordInput().type("sam");
    registerPage.getRegisterButton().click();
    registerPage.getErrorMessage().should("contain", "6");
  });

  it("should show error message if password and confirm password are not same", () => {
    registerPage.getUsernameInput().type("sam123");
    registerPage.getPasswordInput().type("sam123");
    registerPage.getConfirmPasswordInput().type("sam");
    registerPage.getRegisterButton().click();
    registerPage.getErrorMessage().should("contain", "do not match");
  });

  it("should send a successful POST request to register a new user", () => {
    cy.registerUser({ username: "sam123", password: "sammunde" });
    cy.url().should("include", "/login");
  });

  it("should show error alert with message sent from backend if registration fails", () => {
    cy.mockRegisterError("Username is already taken");
    registerPage.getUsernameInput().type("sam123");
    registerPage.getPasswordInput().type("sammunde");
    registerPage.getConfirmPasswordInput().type("sammunde");
    registerPage.getRegisterButton().click();
    registerPage
      .getErrorMessage()
      .should("contain", "Username is already taken");
  });

  it("'back to explore' button on Header should route to products", () => {
    cy.goToExplorePage();
    cy.url().should("eq", `${Cypress.env("QKART_FRONTEND")}/`);
  });

  // to do
});
