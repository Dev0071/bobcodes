// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('successfulLogin', ()=> {
    cy.visit('http://127.0.0.1:5501/Frontend/')
    cy.get('#email').type('kelvinian87@gmail.com')
    cy.get('#password').type('Garfield')
    cy.get('#login-button').click()
})

Cypress.Commands.add('unsuccessfulLoginWithUnregisteredEmail', () => {
    cy.visit('http://127.0.0.1:5501/Frontend/')
    cy.get('#email').type('random@mail.com')
    cy.get('#password').type('Garfield')
   // cy.get('#login-button').click()
})
Cypress.Commands.add('unsuccessfulLoginWithWrongPassword', () => {
    cy.visit('http://127.0.0.1:5501/Frontend/')
    cy.get('#email').type('kelvinian87@gmail.com')
    cy.get('#password').type('Garfieldd')
    cy.get('#login-button').click()
})

Cypress.Commands.add('unsuccessfulLoginWithWrongEmailFormat', () => {
    cy.visit('http://127.0.0.1:5501/Frontend/')
    cy.get('#email').type('random@mailcom')
    cy.get('#password').type('Garfield')
    cy.get('#login-button').click()
})

