import { api, getToken, removeToken, removeUser } from '../api.js';

export class StudentDashboard {
  constructor() {
    this.currentView = 'quizzes';
    this.quizzes = [];
    this.results = [];
    this.token = getToken();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  async render(root) {
    root.innerHTML = `
      <div class="student-dashboard">
        <nav class="navbar">
          <div class="container">
            <h2>Quiz App - Student Dashboard</h2>
            <div class="nav-links">
              <span class="user-info">Welcome, ${this.user.name}</span>
              <button class="btn btn-secondary" id="logoutBtn">Logout</button>
            </div>
          </div>
        </nav>

        <div class="container dashboard-content">
          <div class="sidebar">
            <button class="nav-btn active" data-view="quizzes">Available Quizzes</button>
            <button class="nav-btn" data-view="results">My Results</button>
            <button class="nav-btn" data-view="profile">Profile</button>
          </div>

          <div class="main-content" id="mainContent">
            <!-- Content will be rendered here -->
          </div>
        </div>
      </div>
    `;

    this.attachEventListeners(root);
    await this.renderView('quizzes', root);
  }

  attachEventListeners(root) {
    root.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        await this.renderView(e.target.dataset.view, root);
      });
    });

    root.querySelector('#logoutBtn').addEventListener('click', () => {
      removeToken();
      removeUser();
      window.location.hash = '#login';
    });
  }

  async renderView(view, root) {
    this.currentView = view;
    const mainContent = root.querySelector('#mainContent');

    switch (view) {
      case 'quizzes':
        await this.renderQuizzes(mainContent);
        break;
      case 'results':
        await this.renderResults(mainContent);
        break;
      case 'profile':
        this.renderProfile(mainContent);
        break;
    }
  }

  async renderQuizzes(container) {
    container.innerHTML = '<div class="spinner"></div>';
    try {
      this.quizzes = await api.student.getAssignedQuizzes(this.token);

      let html = '<div class="quizzes-section"><h2>Available Quizzes</h2>';

      if (this.quizzes.length === 0) {
        html += '<p>No quizzes assigned to you yet.</p>';
      } else {
        html += '<div class="quiz-grid">';

        for (const quiz of this.quizzes) {
          const taken = await api.student.hasQuizBeenTaken(quiz.id, this.token);
          const status = taken ? 'Completed' : 'Not Started';
          const btnText = taken ? 'Review' : 'Start Quiz';

          html += `
            <div class="quiz-card card">
              <h3>${quiz.title}</h3>
              <p>${quiz.description}</p>
              <p><strong>Questions:</strong> ${quiz.questions.length}</p>
              <p><strong>Status:</strong> <span class="${taken ? 'badge-success' : 'badge-warning'}">${status}</span></p>
              <button class="btn btn-primary" onclick="window.startQuiz(${quiz.id})">${btnText}</button>
            </div>
          `;
        }

        html += '</div>';
      }

      html += '</div>';
      container.innerHTML = html;

      window.startQuiz = (quizId) => this.startQuiz(quizId, container);
    } catch (error) {
      container.innerHTML = '<div class="alert alert-danger">Error loading quizzes</div>';
    }
  }

  async startQuiz(quizId, container) {
    try {
      const quiz = await api.student.getQuiz(quizId);
      this.renderQuizTaking(container, quiz);
    } catch (error) {
      alert('Error loading quiz');
    }
  }

  renderQuizTaking(container, quiz) {
    let html = `
      <div class="quiz-taking-section">
        <div class="quiz-header">
          <h2>${quiz.title}</h2>
          <p>${quiz.description}</p>
          <div id="progressBar">
            <div id="progress" style="width: 0%"></div>
          </div>
          <p id="progressText">Question 1 of ${quiz.questions.length}</p>
        </div>

        <form id="quizForm">
    `;

    quiz.questions.forEach((question, index) => {
      const isFirst = index === 0 ? 'active' : '';
      html += `
        <div class="question-section card ${isFirst}" id="question_${index}">
          <h3>Question ${index + 1}</h3>
          <p><strong>${question.question}</strong></p>
          <div class="options">
      `;

      question.options.forEach((option, optionIndex) => {
        html += `
          <label class="option-label">
            <input type="radio" name="question_${index}" value="${optionIndex}">
            <span>${option}</span>
          </label>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
          <div class="quiz-footer">
            <button type="button" class="btn btn-secondary" id="prevBtn">Previous</button>
            <button type="button" class="btn btn-primary" id="nextBtn">Next</button>
            <button type="submit" class="btn btn-success hidden" id="submitBtn">Submit Quiz</button>
          </div>
        </form>
      </div>
    `;

    container.innerHTML = html;

    let currentQuestion = 0;
    const form = container.querySelector('#quizForm');
    const prevBtn = container.querySelector('#prevBtn');
    const nextBtn = container.querySelector('#nextBtn');
    const submitBtn = container.querySelector('#submitBtn');

    const showQuestion = () => {
      // Hide all questions
      document.querySelectorAll('.question-section').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
      });

      // Show current question
      const currentEl = document.querySelector(`#question_${currentQuestion}`);
      if (currentEl) {
        currentEl.classList.remove('hidden');
        currentEl.classList.add('active');
      }

      const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
      container.querySelector('#progress').style.width = progress + '%';
      container.querySelector('#progressText').textContent = `Question ${currentQuestion + 1} of ${quiz.questions.length}`;

      prevBtn.disabled = currentQuestion === 0;
      nextBtn.classList.toggle('hidden', currentQuestion === quiz.questions.length - 1);
      submitBtn.classList.toggle('hidden', currentQuestion !== quiz.questions.length - 1);
    };

    prevBtn.addEventListener('click', () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (currentQuestion < quiz.questions.length - 1) {
        currentQuestion++;
        showQuestion();
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const answers = quiz.questions.map((_, index) => {
        const selected = form.querySelector(`input[name="question_${index}"]:checked`);
        return selected ? parseInt(selected.value) : -1;
      });

      try {
        const result = await api.student.submitQuiz(quiz.id, answers, this.token);
        const percentage = (result.score / result.totalQuestions) * 100;
        alert(`Quiz submitted!\nScore: ${result.score}/${result.totalQuestions} (${percentage.toFixed(2)}%)`);
        await this.renderView('quizzes', container.closest('.student-dashboard'));
      } catch (error) {
        alert('Error submitting quiz');
      }
    });

    // Initialize - show first question
    showQuestion();
  }

  async renderResults(container) {
    container.innerHTML = '<div class="spinner"></div>';
    try {
      this.results = await api.student.getResults(this.token);

      let html = '<div class="results-section"><h2>My Results</h2>';

      if (this.results.length === 0) {
        html += '<p>You haven\'t completed any quizzes yet.</p>';
      } else {
        html += '<table class="table"><thead><tr><th>Quiz</th><th>Score</th><th>Percentage</th><th>Date Completed</th></tr></thead><tbody>';

        for (const result of this.results) {
          const quiz = await api.student.getQuiz(result.quizId);
          const date = new Date(result.completedAt).toLocaleString();
          const percentage = (result.score / result.totalQuestions) * 100;

          html += `
            <tr>
              <td>${quiz.title}</td>
              <td>${result.score}/${result.totalQuestions}</td>
              <td>${percentage.toFixed(2)}%</td>
              <td>${date}</td>
            </tr>
          `;
        }

        html += '</tbody></table>';
      }

      html += '</div>';
      container.innerHTML = html;
    } catch (error) {
      container.innerHTML = '<div class="alert alert-danger">Error loading results</div>';
    }
  }

  renderProfile(container) {
    container.innerHTML = `
      <div class="profile-section card">
        <h2>Student Profile</h2>
        <div class="profile-info">
          <p><strong>Student ID:</strong> <span style="font-size: 18px; color: #667eea; font-weight: bold;">${this.user.id}</span></p>
          <p><strong>Name:</strong> ${this.user.name}</p>
          <p><strong>Email:</strong> ${this.user.email}</p>
          <p><strong>Role:</strong> Student</p>
          <div style="background: #f0f4ff; padding: 12px; margin-top: 20px; border-left: 4px solid #667eea; border-radius: 4px;">
            <p style="margin: 0; color: #666; font-size: 12px;">💡 <strong>Tip:</strong> Share your Student ID (${this.user.id}) with your admin to get quizzes assigned to you!</p>
          </div>
        </div>
      </div>
    `;
  }
}

