import '@percy/cypress';

describe("Home page", () => {
    it("Should display home page", () => {
        cy.visit("/");
        
        cy.percySnapshot("Home page");
    });
});