import CartPage from "../pageObjects/CartPage";

const cartPage = new CartPage();

describe("Shopping Cart Functionality", () => {
  beforeEach(() => {
    // Login before each test
    cy.loginForCart().then((response) => {
      const token = Cypress.env("token");
      const username = Cypress.env("username"); // Retrieve username from Cypress.env
      const balance = Cypress.env("balance"); // Retrieve balance from Cypress.env
      if (token) {
        cy.visit("https://qkart-frontend-six-flame.vercel.app/", {
          onBeforeLoad: (window) => {
            window.localStorage.setItem("token", token);
            window.localStorage.setItem("username", username);
            window.localStorage.setItem("balance", balance);
          },
        });
      } else {
        throw new Error("Token not found");
      }
    });
  });

  it("should fetch products and display them", () => {
    cy.visit("https://qkart-frontend-six-flame.vercel.app/products");

    // Verify that products are fetched and displayed
    cy.get(".MuiCardMedia-root").should("have.length", 12); // Assuming there are 3 products in the mocked data
  });

  it("should add product to cart", () => {
    // Assuming there's an "Add to Cart" button for each product
    cy.visit("https://qkart-frontend-six-flame.vercel.app/products");

    // Get all elements matching the button selector
    cy.get("button.css-54wre3").then((buttons) => {
      // Iterate through the buttons
      for (let i = 0; i < buttons.length; i++) {
        // Check if it is the 12th occurrence
        if (i === 1) {
          // Index starts from 0, so 11 corresponds to the 12th element
          // Click on the button
          cy.wrap(buttons[i]).click();
          // Break out of the loop since we've found and clicked the 12th button
          break;
        }
      }
    });

    // Verify that product is added to the cart
    cy.get(".css-zgtx0t").should("have.length", 1); // Assuming there's a cart item container
  });

  it("should remove product from cart", () => {
    // Assuming there's a "Remove" button for each item in the cart
    cartPage.visitCartPage();

    // Click on "Remove" button for a product
    cartPage.getRemoveButton().click();

    // Verify that product is removed from the cart
    cartPage.getCartContainer().should("have.length", 0); // Assuming there's a cart item container
  });

  it("should navigate to checkout page", () => {
    // Assuming there's a "Checkout" button
    cartPage.visitCartPage();
    cy.get("button.css-54wre3").then((buttons) => {
      // Iterate through the buttons
      for (let i = 0; i < buttons.length; i++) {
        // Check if it is the 12th occurrence
        if (i === 1) {
          // Index starts from 0, so 11 corresponds to the 12th element
          // Click on the button
          cy.wrap(buttons[i]).click();
          // Break out of the loop since we've found and clicked the 12th button
          break;
        }
      }
    });
    // Click on "Checkout" button
    cy.contains("Checkout").click();

    // Verify that user is navigated to the checkout page
    cy.url().should("include", "/checkout");
  });
});
