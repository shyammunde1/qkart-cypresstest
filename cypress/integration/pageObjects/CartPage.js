class CartPage {
  visitCartPage() {
    cy.visit("https://qkart-frontend-six-flame.vercel.app/cart");
  }

  getRemoveButton() {
    return cy.get('[data-testid="RemoveOutlinedIcon"]');
  }

  getCheckoutButton() {
    return cy.contains("Checkout");
  }

  getCartContainer() {
    return cy.get(".css-zgtx0t");
  }

  // Add more methods as needed...

  // Example method:
  getCartItems() {
    return cy.get(".css-zgtx0t"); // Assuming this is the container for cart items
  }
}

export default CartPage;
