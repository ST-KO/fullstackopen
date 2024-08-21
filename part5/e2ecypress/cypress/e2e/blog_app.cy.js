describe("Blog app", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Si Ko",
      username: "siko",
      password: "123456",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3003/");
  });

  it("Login form is shown", function () {
    cy.contains("login").click();
    cy.contains("Log in to application");
    cy.contains("username");
    cy.contains("password");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("siko");
      cy.get("#password").type("123456");
      cy.get("#login-button").click();

      cy.contains("siko logged in");
    });

    it("fails with wrong credentials", function () {
      cy.contains("login").click();
      cy.get("#username").type("siko");
      cy.get("#password").type("wrong");
      cy.get("#login-button").click();

      // cy.get(".error").contains("Wrong credentials");
      cy.get(".error")
        .should("contain", "Wrong credentials")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
  });
});
