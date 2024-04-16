import CheckoutPage from "../pageObjects/checkoutPage";

const checkoutPage = new CheckoutPage();

describe("Checkout Page", () => {
  beforeEach(() => {
    cy.loginForCart().then((response) => {
      const token = Cypress.env("token");
      const username = Cypress.env("username");
      const balance = Cypress.env("balance");
      if (token) {
        cy.intercept("GET", `${Cypress.env("QKART_BACKEND")}/products`, {
          fixture: "products.json",
        }).as("getProducts");

        cy.intercept(
          "GET",
          `https://qkart-frontend1-jfw4.onrender.com/api/v1/cart`,
          {
            fixture: "cart.json",
          }
        ).as("getCart");

        cy.intercept("GET", `${Cypress.env("QKART_BACKEND")}/user/addresses`, {
          fixture: "addresses.json",
        }).as("getAddresses");

        cy.intercept("POST", `${Cypress.env("QKART_BACKEND")}/user/addresses`, {
          fixture: "updatedAddresses.json",
        }).as("postAddress");

        cy.intercept(
          "DELETE",
          `${Cypress.env(
            "QKART_BACKEND"
          )}/user/addresses/Tzd6OaX9Zaz2aEPX9ks1n`,
          { fixture: "empty.json" }
        ).as("deleteAddress");

        cy.intercept("POST", `${Cypress.env("QKART_BACKEND")}/cart/checkout`, {
          statusCode: 200,
          body: { success: true },
        }).as("postCheckout");

        cy.visit("https://qkart-frontend-six-flame.vercel.app/checkout", {
          onBeforeLoad: (window) => {
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("username", username);
            window.localStorage.setItem("balance", balance);
          },
        }).then(() => {
          //to do resolve the promises here
        });
      } else {
        throw new Error("Token not found");
      }
    });
  });

  it("should retrieve products", () => {
    cy.wait("@getProducts").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it("should retrieve addresses of the user", () => {
    cy.wait("@getAddresses").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it("should show items by parsing the response data", () => {
    cy.contains("UNIFACTOR Mens Running Shoes").should("exist");
    cy.contains("YONEX Smash Badminton Racquet").should("exist");
    cy.contains("$50").should("exist");
    cy.contains("$100").should("exist");
  });

  it("should not allow to edit quantity", () => {
    cy.get(
      ".cart > .css-zgtx0t:nth-child(1) > .css-1gjj37g > .css-69i1ev > .css-0"
    ).should("have.length", 1);

    cy.get("[data-testid='RemoveOutlinedIcon']").should("not.exist");
    cy.get("[data-testid='AddOutlinedIcon']").should("not.exist");
  });

  it("should show user addresses", () => {
    cy.contains("Some address").should("exist");
  });

  it("should have delete button for user addresses", () => {
    checkoutPage.getDeleteAddressButton().should("exist");
  });

  it("should have add new address button", () => {
    checkoutPage.getAddNewAddressButton().should("exist");
  });

  it("should have a place order button", () => {
    checkoutPage.getPlaceOrderButton().should("exist");
  });

  it("should show error message if no address selected for checkout", () => {
    checkoutPage.getPlaceOrderButton().click();
    checkoutPage.getErrorMessage().should("exist");
  });

  it("should show error message if low balance", () => {
    cy.window().then((win) => {
      win.localStorage.setItem("balance", "0");
    });
    cy.contains("Some address").click();
    checkoutPage.getPlaceOrderButton().click();
    cy.contains("not have enough balance").should("exist");
  });

  it("has add new address button which shows textfield with action buttons", () => {
    cy.get(".css-rfvjbl").click();
    cy.get("#mui-1").should("exist");
    cy.get(".css-177pwqq:first-child").should("exist");
    cy.get(".css-j7qwjs > .MuiStack-root > .MuiButton-text").should("exist");
  });

  it("allows to add new address", () => {
    checkoutPage.getAddNewAddressButton().click();
    checkoutPage
      .getAddressTextField()
      .type("parshuram niwas hibbat muked nanded maharashtra 431715");
    cy.get(".css-177pwqq:first-child").click();
    cy.contains("new address for me is here").should("exist");
  });

  it("allows to delete address", () => {
    cy.get(".address-item > .MuiButtonBase-root").click();
    cy.contains("Some address").should("not.exist");
  });

  it("should make an API call on clicking make payement button", () => {
    cy.contains("Some address").click();
    checkoutPage.getPlaceOrderButton().click();
    cy.wait("@postCheckout")
      .its("request.body")
      .should("deep.eq", { addressId: "Tzd6OaX9Zaz2aEPX9ks1n" });
  });

  it("should route to '/thanks' after checkout successful", () => {
    cy.contains("Some address").click();
    checkoutPage.getPlaceOrderButton().click();
    cy.location("pathname").should("eq", "/thanks");
  });
});
