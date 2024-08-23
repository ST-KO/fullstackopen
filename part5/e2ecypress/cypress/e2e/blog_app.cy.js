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

  describe("When logged in", function () {
    beforeEach(function () {
      cy.contains("login").click();
      cy.get("#username").type("siko");
      cy.get("#password").type("123456");
      cy.get("#login-button").click();
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title").type("a blog created by cypress");
      cy.get("#author").type("cypress");
      cy.get("#url").type("http://cypress.com");
      cy.get("#create-button").click();

      cy.get(".success").should(
        "contain",
        `a new blog a blog created by cypress by cypress added`
      );
    });

    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.contains("new blog").click();
        cy.get("#title").type("another blog created by cypress");
        cy.get("#author").type("cypress");
        cy.get("#url").type("http://cypress.com");
        cy.get("#create-button").click();
      });

      it("users can like a blog", function () {
        cy.get(".blogs")
          .should("contain", "another blog created by cypress")
          .contains("view")
          .click();

        cy.get(".like-button").click();

        cy.get(".blog-likes").should("contain", "1");
      });

      it("users can delete their blogs", function () {
        cy.get(".blogs")
          .should("contain", "another blog created by cypress")
          .contains("view")
          .click();

        cy.get(".delete-button").click();
        cy.on("window:confirm", function () {
          return true;
        });

        cy.contains("another blog created by cypress").should("not.exist");
      });
    });
  });
});
