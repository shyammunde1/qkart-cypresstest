class CheckoutPage {
  visitCheckoutPage() {
    cy.visit("https://qkart-frontend-six-flame.vercel.app/checkout");
  }

  getPlaceOrderButton() {
    return cy.get(".css-177pwqq");
  }

  getAddNewAddressButton() {
    return cy.get(".css-rfvjbl");
  }

  getDeleteAddressButton() {
    return cy.get(".address-item > .MuiButtonBase-root");
  }

  getAddressTextField() {
    return cy.get("#mui-1");
  }

  getActionButtons() {
    return cy.get(".css-j7qwjs > .MuiStack-root > .MuiButton-text");
  }

  getErrorMessage() {
    return cy.get("#notistack-snackbar");
  }

  // Add more methods as needed...

  // Example method:
  getAddressItems() {
    return cy.get(".address-item"); // Assuming this is the container for address items
  }
}

export default CheckoutPage;
