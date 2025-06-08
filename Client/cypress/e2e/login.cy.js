describe('Login Page - Error Handling', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  // Completed 15/05/2025
  it('shows error for empty fields', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('יש למלא מייל וסיסמה').should('exist');
  });

  // Completed 15/05/2025
  it('shows error for invalid credentials', () => {
    cy.get('[data-cy="login-email"]').type('wrong@email.com');
    cy.get('[data-cy="login-password"]').type('wrongpassword');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('אימייל או סיסמה שגויים').should('exist');
  });

  // Completed 15/05/2025
  it('shows error for invalid email format', () => {
    cy.get('[data-cy="login-email"]').type('notanemail');
    cy.get('[data-cy="login-password"]').type('somepassword');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('אימייל או סיסמה שגויים').should('exist');
  });
});
