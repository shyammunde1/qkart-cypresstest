import ProductsPage from "../pageObjects/ProductsPage";

const productPage = new ProductsPage();

describe("Products Page - Header", () => {
  beforeEach(() => {
    productPage.visitProductsPage();
  });

  it("should have a header with logo", () => {
    productPage.getLogo().should("exist");
  });

  it("should have login button on Header route to login page", () => {
    productPage.getLoginButton().click();
    cy.url().should("include", "/login");
  });

  it("should have register button on Header route to register page when logged out", () => {
    productPage.getRegisterButton().click();
    cy.url().should("include", "/register");
  });

  it("should have a search bar", () => {
    productPage.getSearchBar().should("exist");
  });
});

describe("Products Page - Header: Logged in", () => {
  beforeEach(() => {
    // Load the fixture containing valid credentials
    cy.fixture("login.json").then((credentials) => {
      const user = credentials.validCredentials.username;
      const password = credentials.validCredentials.password;

      productPage.visitProductsPage();
      productPage.getLoginButton().click();

      // Use the custom login command with username and password
      cy.loginApiCall({ username: user, password: password });
    });
  });

  it("should have username & avatar in header if logged in", () => {
    productPage.getUserName().should("be.visible");
    productPage.getAvatar().should("be.visible");
  });

  it("should have logout button in header when logged in", () => {
    productPage.getLogoutBtn().should("be.visible");
  });

  it("logout button should clear local storage items", () => {
    productPage.getLogoutBtn().click();

    // Assert local storage items are cleared
    cy.window().then((win) => {
      expect(win.localStorage.getItem("username")).to.be.null;
      expect(win.localStorage.getItem("token")).to.be.null;
      expect(win.localStorage.getItem("balance")).to.be.null;
    });
  });
});

describe("Products Page", () => {
  beforeEach(() => {
    // Intercept the GET request for products and respond with data from the fixture file
    cy.intercept(
      "GET",
      "https://qkart-frontend1-jfw4.onrender.com/api/v1/products",
      { fixture: "products.json" }
    ).as("getProducts");

    // Intercept the GET request for the cart and respond with data from the fixture file
    cy.intercept(
      "GET",
      "https://qkart-frontend1-jfw4.onrender.com/api/v1/cart",
      { fixture: "cart.json" }
    ).as("getCart");

    // Visit the products page URL directly
    productPage.visitProductsPage();

    // Add a wait time to ensure that the page is fully loaded
    cy.wait(1000); // Adjust the wait time as needed
  });

  it("should make a GET request to load products", () => {
    // Wait for the intercepted request
    cy.wait("@getProducts").then((interception) => {
      expect(interception.request.url).to.equal(
        `https://qkart-frontend1-jfw4.onrender.com/api/v1/products`
      );
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it("shows items on the products page load", () => {
    // Check for elements representing products on the page
    cy.get(".MuiCardMedia-root").should("have.length", 3);
    cy.get(".MuiCardActions-root").should("have.length", 3);
    cy.get(".MuiCardContent-root").should("have.length", 3);
    //find all the products on qkart
    cy.get(
      ".MuiGrid-container > .MuiGrid-item > .MuiPaper-root.MuiCard-root"
    ).should("have.length", 3);
  });

  it("should make a GET request to search", () => {
    // Intercept the search request and validate the URL
    cy.intercept(
      "GET",
      "https://qkart-frontend1-jfw4.onrender.com/api/v1/products/search?value=smash",
      (req) => {
        // Validate the URL
        expect(req.url).to.include("/api/v1/products/search?value=smash");
      }
    ).as("searchRequest");

    // Type search query
    productPage.getSearchInput().type("smash");
    cy.wait(1000); // Adjust the wait time as needed

    // Verify that the search functionality works
    cy.url().should("include", "/products"); // Check if the URL contains "/products" only
    // cy.get(".MuiCardMedia-root").should("have.length", 1);
    cy.get(
      ".MuiGrid-container > .MuiGrid-item > .MuiPaper-root.MuiCard-root"
    ).should("have.length", 1);

    // (Optional) Wait for the search request to complete
    cy.wait("@searchRequest");
  });

  it("should show all products if search empty", () => {
    // Clear the search field and verify that all products are displayed
    productPage.getSearchInput().clear();
    // cy.get(".MuiCardMedia-root").should("have.length", 3);
    cy.get(
      ".MuiGrid-container > .MuiGrid-item > .MuiPaper-root.MuiCard-root"
    ).should("have.length", 3);
  });

  it("should show matching products if found", () => {
    productPage.getSearchInput().type("smash");
    cy.wait(1000);
    cy.get(
      ".MuiGrid-container > .MuiGrid-item > .MuiPaper-root.MuiCard-root"
    ).should("have.length", 1);
    cy.contains(".MuiTypography-h5", "YONEX Smash Badminton Racquet").should(
      "exist"
    );
  });

  it("should show 'No Products Found' if search string does not get any items", () => {
    // Type a search query that doesn't match any products and verify the message
    productPage.getSearchInput().type("smasher");
    cy.wait(2000); // Adjust the wait time as needed
    cy.get("h3").should("exist");
  });

  it("updates search items as search string updates", () => {
    // Type a search query and verify that products are updated as the search string changes
    productPage.getSearchInput().type("leather");
    cy.wait(1000); // Adjust the wait time as needed
    cy.contains(".MuiTypography-h5", "Tan Leatherette Weekender Duffle").should(
      "exist"
    );
    cy.contains(
      ".MuiTypography-h5",
      "The Minimalist Slim Leather Watch"
    ).should("exist");
    productPage.getSearchInput().clear().type("leathere");
    cy.wait(2000); // Adjust the wait time as needed
    cy.contains(".MuiTypography-h5", "Tan Leatherette Weekender Duffle").should(
      "exist"
    );
    cy.contains(
      ".MuiTypography-h5",
      "The Minimalist Slim Leather Watch"
    ).should("not.exist");
  });

  it("debounces the searching API calls", () => {
    //
    cy.intercept(
      "GET",
      "https://qkart-frontend1-jfw4.onrender.com/api/v1/products/search?value=badminton",
      (req) => {
        // Validate the URL
        expect(req.url).to.include("/api/v1/products/search?value=badminton");
      }
    ).as("searchRequest");
    // Type a search query and verify that API calls are debounced
    productPage.getSearchInput().type("badminton");
    cy.wait(100); // Wait for debounce
    cy.url().should("not.include", "/products?search=badminton"); // Check if the URL has not changed yet
    cy.wait(2000); // Wait for debounce timeout
    cy.url().should("include", "/products"); // Check if the URL has changed after debounce timeout
  });
});
