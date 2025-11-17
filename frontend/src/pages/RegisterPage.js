import { api, setToken, setUser } from '../api.js';

export class RegisterPage {
  render(root) {
    root.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <h1>Create Account</h1>
          <form id="registerForm">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <div id="errorMessage" class="alert alert-danger hidden"></div>
            <button type="submit" class="btn btn-primary btn-block">Register</button>
          </form>
          <p class="auth-link">Already have an account? <a href="#login">Login here</a></p>
        </div>
      </div>
    `;

    const form = root.querySelector('#registerForm');
    form.addEventListener('submit', (e) => this.handleRegister(e, root));
  }

  async handleRegister(e, root) {
    e.preventDefault();
    const name = root.querySelector('#name').value;
    const email = root.querySelector('#email').value;
    const password = root.querySelector('#password').value;
    const errorDiv = root.querySelector('#errorMessage');

    try {
      const response = await api.auth.register(name, email, password);
      if (response.token) {
        setToken(response.token);
        setUser({
          id: response.userId,
          name: response.name,
          email: response.email,
          role: response.role
        });

        // Show success message with assigned ID
        alert(`✅ Registration Successful!\n\nYour Student ID: ${response.userId}\n\nPlease save this ID - you'll need it to take quizzes!`);

        window.location.hash = '#dashboard';
      } else {
        errorDiv.textContent = response.message || 'Registration failed';
        errorDiv.classList.remove('hidden');
      }
    } catch (error) {
      errorDiv.textContent = 'An error occurred. Please try again.';
      errorDiv.classList.remove('hidden');
    }
  }
}

