describe("Blog app", () => {
  beforeEach(function () {
    cy.visit("http://localhost:3003/");
  });

  it("Login form is shown", function () {
    cy.contains("login").click();
    cy.contains("Log in to application");
    cy.contains("username");
    cy.contains("password");
  });
});
