describe("Flujo de login con Microsoft", () => {
  it("Debe abrir localhost:5001 y hacer clic en el botón de inicio de sesión", () => {
    cy.visit("http://localhost:5001");
    cy.contains("Iniciar sesión con Microsoft 365").click();
  });
});
