import LoginPage from "../pageObjects/LoginPage";

const loginPage = new LoginPage();

describe("Login Page", () => {
  beforeEach(() => {
    loginPage.visitLoginPage();
  });

  it("should display Register form title", () => {
    loginPage.getLoginFormTitle().should("exist");
  });

  it("should display header with logo", () => {
    loginPage.getLogo().should("exist");
  });

  it("should display 'login here' link", () => {
    loginPage.getLoginLink().should("exist");
  });

  it("should navigate to the login Page", () => {
    loginPage.getLoginLink().click();
    cy.url().should("include", "/login");
  });

  context("Login Form Validation", () => {
    beforeEach(() => {
      loginPage.getLoginLink().click();
    });

    it("should have header with 'back to explore' button", () => {
      loginPage.getBackToExploreButton().should("exist");
    });

    it("should have register now link", () => {
      loginPage.getRegisterNowLink().should("exist");
    });

    it("should throw error if username field is empty", () => {
      loginPage.getLoginButton().click();
      loginPage.getErrorMessage().should("contain", "Username is required");
    });

    it("should throw error if password field is empty", () => {
      loginPage.getUsernameInput().type("sam123");
      loginPage.getLoginButton().click();
      loginPage.getErrorMessage().should("contain", "password is required");
    });
  });

  context("Login form Submission", () => {
    beforeEach(() => {
      // Intercept the POST request to the login endpoint before each test
      cy.intercept("POST", `${Cypress.env("QKART_BACKEND")}/auth/login`).as(
        "loginRequest"
      );
    });

    it("should send a POST request to the backend with valid credentials", () => {
      // Use the custom login command to perform the login action with valid credentials
      cy.fixture("login.json").then((credentials) => {
        const user = credentials.validCredentials.username;
        const password = credentials.validCredentials.password;

        loginPage.visitLoginPage();
        loginPage.getLoginLink().click();

        // Use the custom login command with username and password
        cy.loginApiCall({ username: user, password: password });

        // Wait for the intercepted request to be made
        cy.wait("@loginRequest").its("request.body").should("deep.equal", {
          username: user,
          password: password,
        });
      });
    });

    it("should show error alert with message sent from backend if request fails with invalid credentials", () => {
      // Mock login error for invalid credentials
      cy.fixture("login.json").then((credentials) => {
        const user = credentials.invalidCredentials.username;
        const password = credentials.invalidCredentials.password;

        loginPage.getLoginLink().click();

        cy.mockLoginError("Password is incorrect");

        // Fill in the login form with invalid credentials

        loginPage.getUsernameInput().type(user);
        loginPage.getPasswordInput().type(password);
        loginPage.getLoginButton().click();

        // Check if the error alert is displayed
        loginPage.getErrorMessage().should("contain", "Password is incorrect");

        // Verify the backend response
        cy.wait("@loginRequest").its("response.body").should("deep.equal", {
          success: false,
          message: "Password is incorrect",
        });
      });
    });
    it("should redirect to products page after success with valid credentials", () => {
      // Use the custom login command to perform the login action with valid credentials
      cy.fixture("login.json").then((credentials) => {
        const user = credentials.validCredentials.username;
        const password = credentials.validCredentials.password;

        loginPage.visitLoginPage();
        loginPage.getLoginLink().click();

        // Use the custom login command with username and password
        cy.loginApiCall({ username: user, password: password });

        // Check if the page redirects to the products page
        cy.url().should("include", "/");

        // Wait for the intercepted request to be made
        cy.wait("@loginRequest").its("request.body").should("deep.equal", {
          username: user,
          password: password,
        });
      });
    });
  });
});
