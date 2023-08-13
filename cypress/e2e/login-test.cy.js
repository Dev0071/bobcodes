describe('Login Page Test', function () {

    it('should show a success message on login', function () {
        cy.successfulLogin()
        cy.get('#error-message').should('contain', 'Login successful')
    });

    it('should show an error message when account does not exist', function () {
        cy.unsuccessfulLoginWithUnregisteredEmail()
        cy.get('#error-message').should('contain', 'Could not find an account associated with the email address')
    })

    it('shows a wrong password message when a wrong password is provided', function () {
        cy.unsuccessfulLoginWithWrongPassword()
        cy.get("#error-message").should('contain', 'Incorrect Password')
    })

    it('should display an error message on wrong email formatting', function () {
        cy.unsuccessfulLoginWithWrongEmailFormat()
        cy.get('#error-message').should('contain', 'Invalid email format')
    })

    it('should show an error message if the input is blank', function(){
        cy.showsAnErrorMessageForEmptyInput()
        cy.get('#error-message').should('contain', 'All fields are required')
    })
    it('should navigate to the admin dashboard after a succesful login', function(){
        cy.successfulLoginNavigatesToDashboard()
        cy.url().should('include', 'http://127.0.0.1:5501/Frontend/index.html')
    })

    it('should navigate to the registration page', function (){
        cy.navigateToRegisterPage()
       cy.url().should('include', 'http://127.0.0.1:5501/Frontend/signup.html')
    })
});