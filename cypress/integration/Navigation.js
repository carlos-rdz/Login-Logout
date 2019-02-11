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

describe('Tests out forgot password Link', function() {
    it('click link forgot password to test link', function() {
      cy.visit('http://localhost:3000/login')
      cy.contains('Forgot Password')
    })
  })

describe('Visits Signup', function() {
    it('Goes to localhost:3000', function() {
      cy.visit('http://localhost:3000/signup')
    })
  })