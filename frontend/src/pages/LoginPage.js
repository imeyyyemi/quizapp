import { api, setToken, setUser } from '../api.js';

export class LoginPage {
  render(root) {
    root.innerHTML = `
      <div class="auth-container">
        <div class="auth-card">
          <h1>Quiz App Login</h1>
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <div id="errorMessage" class="alert alert-danger hidden"></div>
            <button type="submit" class="btn btn-primary btn-block">Login</button>
          </form>
          <p class="auth-link">Don't have an account? <a href="#register">Register here</a></p>
        </div>
      </div>
    `;

    const form = root.querySelector('#loginForm');
    form.addEventListener('submit', (e) => this.handleLogin(e, root));
  }

  async handleLogin(e, root) {
    e.preventDefault();
    const email = root.querySelector('#email').value;
    const password = root.querySelector('#password').value;
    const errorDiv = root.querySelector('#errorMessage');

    try {
      const response = await api.auth.login(email, password);
      if (response.token) {
        setToken(response.token);
        setUser({
          id: response.userId,
          name: response.name,
          email: response.email,
          role: response.role
        });
        window.location.hash = '#dashboard';
      } else {
        errorDiv.textContent = response.message || 'Login failed';
        errorDiv.classList.remove('hidden');
      }
    } catch (error) {
      errorDiv.textContent = 'An error occurred. Please try again.';
      errorDiv.classList.remove('hidden');
    }
  }
}

