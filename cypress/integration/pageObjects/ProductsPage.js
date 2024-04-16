class ProductsPage {
  visitProductsPage() {
    cy.visit(`${Cypress.env("QKART_FRONTEND")}/products`);
  }

  getLogo() {
    return cy.get("img[src='logo_dark.svg']");
  }

  getLoginButton() {
    return cy.get(".MuiStack-root > :nth-child(1)");
  }

  getRegisterButton() {
    return cy.get(".MuiStack-root > :nth-child(2)");
  }

  getSearchBar() {
    return cy.get("#mui-1");
  }

  getUserName() {
    return cy.get(".MuiStack-root > p");
  }

  getAvatar() {
    return cy.get(".MuiAvatar-root");
  }

  getLogoutBtn() {
    return cy.get(".MuiStack-root > .MuiButtonBase-root");
  }

  getSearchInput() {
    return cy.get("#mui-1");
  }

  // Add more methods as needed...

  // Example method:
  getProductCard() {
    return cy.get(".MuiCard-root");
  }
}

export default ProductsPage;
