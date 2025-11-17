import { api, getToken, setToken, setUser, removeToken, removeUser } from './api.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { StudentDashboard } from './pages/StudentDashboard.js';

class App {
  constructor() {
    this.currentPage = null;
    this.currentUser = null;
    this.init();
  }

  async init() {
    this.setupRouter();
    this.render();
  }

  setupRouter() {
    window.addEventListener('hashchange', () => this.render());
  }

  getCurrentPage() {
    const hash = window.location.hash.slice(1) || 'login';
    const [page, ...params] = hash.split('/');
    return { page, params };
  }

  async render() {
    const { page } = this.getCurrentPage();
    const token = getToken();
    const root = document.getElementById('root');
    root.innerHTML = '';

    if (token) {
      try {
        // User is logged in, show dashboard
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.role === 'ADMIN') {
          const dashboard = new AdminDashboard();
          await dashboard.render(root);
        } else {
          const dashboard = new StudentDashboard();
          await dashboard.render(root);
        }
      } catch (error) {
        console.error('Error rendering dashboard:', error);
        this.logout();
      }
    } else {
      // Not logged in, show auth pages
      if (page === 'register') {
        const registerPage = new RegisterPage();
        registerPage.render(root);
      } else {
        const loginPage = new LoginPage();
        loginPage.render(root);
      }
    }
  }

  logout() {
    removeToken();
    removeUser();
    window.location.hash = '#login';
    this.render();
  }
}

// Initialize app
new App();

