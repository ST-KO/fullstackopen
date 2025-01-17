describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Matti Luukkainen",
      username: "siko",
      password: "123456",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user);
    cy.visit("");
  });

  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2024"
    );
  });

  it("login form can be opened", function () {
    cy.contains("login").click();
  });

  it("user can log in", function () {
    cy.contains("login").click();
    cy.get("#username").type("siko");
    cy.get("#password").type("123456");
    cy.get("#login-button").click();

    cy.contains("siko logged-in");
  });

  it.only("login fails with wrong password", function () {
    cy.contains("login").click();
    cy.get("#username").type("siko");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();

    cy.contains("Wrong credentials");
    // cy.get(".error").contains("Wrong credentials");
    cy.get(".error")
      .should("contain", "Wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");

    cy.get("html").should("not.contain", "siko logged in");
  });

  describe("when logged in", function () {
    describe("and several nots exist", function () {
      beforeEach(function () {
        cy.login({ username: "siko", password: "123456" });
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "thrid note", important: false });
        // cy.contains("login").click();
        // cy.get("#username").type("siko");
        // cy.get("#password").type("123456");
        // cy.get("#login-button").click();
      });

      it("one of those can be made important", function () {
        cy.contains("second note").parent().find("button").as("theButton");
        cy.get("@theButton").click();
        cy.get("@theButton").should("contain", "make note important");
      });
    });

    it("a new note can be created", function () {
      cy.contains("new note").click();
      cy.get("input").type("a note created by cypress");
      cy.contains("save").click();
      cy.contains("a note created by cypress");
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        // cy.contains("new note").click();
        // cy.get("input").type("another note cypress");
        // cy.contains("save").click();

        cy.createNote({
          content: "another note cypress",
          important: true,
        });
      });

      it("it can be made not important", function () {
        cy.contains("another note cypress")
          .contains("make not important")
          .click();

        cy.contains("another note cypress").contains("make important");
      });
    });
  });
});
