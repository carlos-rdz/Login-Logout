describe('Visits Home Page', function() {
    it('Goes to localhost:3000', function() {
      cy.visit('http://localhost:3000')
    })
  })
describe('Visits Login', function() {
    it('Goes to localhost:3000', function() {
      cy.visit('http://localhost:3000/login')
    })
  })
describe('Visits Signup', function() {
    it('Goes to localhost:3000', function() {
      cy.visit('http://localhost:3000/signup')
    })
  })