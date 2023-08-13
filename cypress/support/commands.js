Cypress.Commands.add('successfulLogin', ()=> {
    cy.visit('login.html')
    cy.get('#email').type('kelvinian87@gmail.com')
    cy.get('#password').type('Garfield')
    cy.get('#login-button').click()
   
})

Cypress.Commands.add('unsuccessfulLoginWithUnregisteredEmail', () => {
    cy.visit('login.html')
    cy.get('#email').type('random@mail.com')
    cy.get('#password').type('Garfield')
   cy.get('#login-button').click()
})
Cypress.Commands.add('unsuccessfulLoginWithWrongPassword', () => {
    cy.visit('login.html')
    cy.get('#email').type('kelvinian87@gmail.com')
    cy.get('#password').type('Garfieldd')
    cy.get('#login-button').click()
})

Cypress.Commands.add('unsuccessfulLoginWithWrongEmailFormat', () => {
    cy.visit('login.html')
    cy.get('#email').type('random@mailcom')
    cy.get('#password').type('Garfield')
    cy.get('#login-button').click()
})

Cypress.Commands.add('showsAnErrorMessageForEmptyInput', ()=>{
    cy.visit('login.html')
    cy.get('#login-button').click()
})

Cypress.Commands.add('successfulLoginNavigatesToDashboard', () => {
    cy.visit('login.html')
    cy.get('#email').type('kelvinian87@gmail.com')
    cy.get('#password').type('Garfield')
    cy.get('#login-button').click()
})

Cypress.Commands.add('navigateToRegisterPage', () => {
    cy.visit('login.html')
    cy.get('#signup-button').click()
})

