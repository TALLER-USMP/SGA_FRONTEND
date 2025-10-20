describe('Prueba de login y registro', () => {

  it('Inicia sesión correctamente', () => {
    cy.visit('http://localhost:3000/login')  // Ajusta la URL a tu app
    cy.get('input[name=email]').type('usuario@correo.com')
    cy.get('input[name=password]').type('123456')
    cy.get('button[type=submit]').click()
    cy.contains('Bienvenido').should('exist')  // Validación simple
  })

  it('Crea un nuevo registro', () => {
    cy.visit('http://localhost:3000/registro')  // Ajusta la URL a tu app
    cy.get('input[name=nombre]').type('Prueba Cypress')
    cy.get('input[name=descripcion]').type('Registro de prueba')
    cy.get('button[type=submit]').click()
    cy.contains('Registro creado').should('exist')  // Validación
  })

})
