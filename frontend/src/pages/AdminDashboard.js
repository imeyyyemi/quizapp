import { api, getToken, removeToken, removeUser } from '../api.js';

export class AdminDashboard {
  constructor() {
    this.currentView = 'quizzes';
    this.quizzes = [];
    this.token = getToken();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  async render(root) {
    root.innerHTML = `
      <div class="admin-dashboard">
        <nav class="navbar">
          <div class="container">
            <h2>Quiz Admin Panel</h2>
            <div class="nav-links">
              <span class="user-info">Welcome, ${this.user.name}</span>
              <button class="btn btn-secondary" id="logoutBtn">Logout</button>
            </div>
          </div>
        </nav>

        <div class="container dashboard-content">
          <div class="sidebar">
            <button class="nav-btn active" data-view="quizzes">My Quizzes</button>
            <button class="nav-btn" data-view="create">Create Quiz</button>
            <button class="nav-btn" data-view="assign">Assign Quizzes</button>
            <button class="nav-btn" data-view="students">Students</button>
            <button class="nav-btn" data-view="results">Results</button>
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
      case 'create':
        this.renderCreateQuiz(mainContent);
        break;
      case 'assign':
        await this.renderAssignQuizzes(mainContent);
        break;
      case 'students':
        await this.renderStudents(mainContent);
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
      this.quizzes = await api.admin.getQuizzes(this.token);

      let html = '<div class="quizzes-section"><h2>My Quizzes</h2>';

      if (this.quizzes.length === 0) {
        html += '<p>No quizzes created yet.</p>';
      } else {
        html += '<table class="table"><thead><tr><th>Title</th><th>Questions</th><th>Assigned To</th><th>Created</th><th>Actions</th></tr></thead><tbody>';

        this.quizzes.forEach(quiz => {
          const date = new Date(quiz.createdAt).toLocaleDateString();
          const assignedCount = quiz.assignedTo ? quiz.assignedTo.length : 0;
          html += `
            <tr>
              <td>${quiz.title}</td>
              <td>${quiz.questions.length}</td>
              <td>
                <span class="badge-info">${assignedCount} student(s)</span>
                ${assignedCount > 0 ? `<button class="btn btn-sm btn-info" onclick="window.viewAssignedStudents(${quiz.id})">View</button>` : ''}
              </td>
              <td>${date}</td>
              <td>
                <button class="btn btn-primary btn-sm" onclick="window.editQuiz(${quiz.id})">Edit</button>
                <button class="btn btn-secondary btn-sm" onclick="window.viewQuizResults(${quiz.id})">Results</button>
                <button class="btn btn-danger btn-sm" onclick="window.deleteQuiz(${quiz.id})">Delete</button>
              </td>
            </tr>
          `;
        });

        html += '</tbody></table>';
      }

      html += '</div>';
      container.innerHTML = html;

      // Set up global functions for button handlers
      window.editQuiz = (id) => this.editQuiz(id);
      window.viewQuizResults = (id) => this.viewQuizResults(id);
      window.viewAssignedStudents = (id) => this.viewAssignedStudents(id);
      window.deleteQuiz = (id) => this.deleteQuiz(id);
    } catch (error) {
      container.innerHTML = '<div class="alert alert-danger">Error loading quizzes</div>';
    }
  }

  renderCreateQuiz(container) {
    container.innerHTML = `
      <div class="create-quiz-section">
        <h2>Create New Quiz</h2>
        <form id="quizForm">
          <div class="form-group">
            <label for="title">Quiz Title</label>
            <input type="text" id="title" name="title" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" rows="3"></textarea>
          </div>

          <div id="questionsContainer"></div>

          <button type="button" class="btn btn-secondary" id="addQuestionBtn">+ Add Question</button>
          <button type="submit" class="btn btn-primary mt-20">Create Quiz</button>
        </form>
      </div>
    `;

    const form = container.querySelector('#quizForm');
    const addBtn = container.querySelector('#addQuestionBtn');
    let questionCount = 0;

    addBtn.addEventListener('click', () => {
      questionCount++;
      this.addQuestionField(container, questionCount);
    });

    form.addEventListener('submit', (e) => this.handleCreateQuiz(e, container));

    // Add one default question
    this.addQuestionField(container, ++questionCount);
  }

  addQuestionField(container, index) {
    const questionsContainer = container.querySelector('#questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.className = 'card question-card';
    questionDiv.innerHTML = `
      <h4>Question ${index}</h4>
      <div class="form-group">
        <label>Question Text</label>
        <input type="text" name="question_${index}" placeholder="Enter question" required>
      </div>
      <div class="options-container">
        <div class="form-group">
          <label>Option A</label>
          <input type="text" name="option_${index}_0" placeholder="Option A" required>
        </div>
        <div class="form-group">
          <label>Option B</label>
          <input type="text" name="option_${index}_1" placeholder="Option B" required>
        </div>
        <div class="form-group">
          <label>Option C</label>
          <input type="text" name="option_${index}_2" placeholder="Option C" required>
        </div>
        <div class="form-group">
          <label>Option D</label>
          <input type="text" name="option_${index}_3" placeholder="Option D" required>
        </div>
      </div>
      <div class="form-group">
        <label>Correct Answer</label>
        <select name="correct_${index}" required>
          <option value="">Select correct option</option>
          <option value="0">Option A</option>
          <option value="1">Option B</option>
          <option value="2">Option C</option>
          <option value="3">Option D</option>
        </select>
      </div>
      <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">Remove</button>
    `;
    questionsContainer.appendChild(questionDiv);
  }

  async handleCreateQuiz(e, container) {
    e.preventDefault();
    const form = container.querySelector('#quizForm');
    const formData = new FormData(form);

    const title = formData.get('title');
    const description = formData.get('description');
    const questions = [];

    // Parse questions from form
    let i = 1;
    while (formData.get(`question_${i}`)) {
      questions.push({
        question: formData.get(`question_${i}`),
        options: [
          formData.get(`option_${i}_0`),
          formData.get(`option_${i}_1`),
          formData.get(`option_${i}_2`),
          formData.get(`option_${i}_3`)
        ],
        correctAnswer: parseInt(formData.get(`correct_${i}`))
      });
      i++;
    }

    try {
      await api.admin.createQuiz({ title, description, questions }, this.token);
      alert('Quiz created successfully!');
      await this.renderView('quizzes', container.closest('.admin-dashboard'));
    } catch (error) {
      alert('Error creating quiz');
    }
  }

  async renderResults(container) {
    container.innerHTML = '<div class="spinner"></div>';

    try {
      if (this.quizzes.length === 0) {
        this.quizzes = await api.admin.getQuizzes(this.token);
      }

      let html = '<div class="results-section"><h2>Quiz Results</h2>';

      let hasResults = false;
      for (const quiz of this.quizzes) {
        const results = await api.admin.getQuizResults(quiz.id, this.token);
        if (results.length > 0) {
          hasResults = true;
          html += `<div class="card"><h3>${quiz.title}</h3>`;
          html += '<table class="table"><thead><tr><th>Student Name</th><th>Score</th><th>Percentage</th><th>Completed</th></tr></thead><tbody>';

          results.forEach(result => {
            const date = new Date(result.completedAt).toLocaleString();
            html += `
              <tr>
                <td>${result.studentName}</td>
                <td>${result.score}/${result.totalQuestions}</td>
                <td>${result.percentage.toFixed(2)}%</td>
                <td>${date}</td>
              </tr>
            `;
          });

          html += '</tbody></table></div>';
        }
      }

      if (!hasResults) {
        html += '<p>No quiz results yet. Students need to take quizzes first!</p>';
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
        <h2>Admin Profile</h2>
        <div class="profile-info">
          <p><strong>Name:</strong> ${this.user.name}</p>
          <p><strong>Email:</strong> ${this.user.email}</p>
          <p><strong>Role:</strong> ${this.user.role}</p>
        </div>
      </div>
    `;
  }

  async renderStudents(container) {
    container.innerHTML = '<div class="spinner"></div>';

    try {
      console.log('Fetching students with token:', this.token ? 'Present' : 'Missing');
      const students = await api.admin.getAllStudents(this.token);

      console.log('Students received:', students);

      let html = '<div class="students-section"><h2>Student Accounts</h2>';

      if (!students || students.length === 0) {
        html += '<p>No students registered yet.</p>';
      } else {
        html += '<table class="table"><thead><tr><th>Student ID</th><th>Full Name</th><th>Email</th><th>Registered</th></tr></thead><tbody>';

        students.forEach(student => {
          const date = new Date(student.createdAt).toLocaleDateString();
          html += `
            <tr>
              <td><strong>${student.id}</strong></td>
              <td>${student.name}</td>
              <td>${student.email}</td>
              <td>${date}</td>
            </tr>
          `;
        });

        html += '</tbody></table>';

        html += `
          <div class="student-summary">
            <p><strong>Total Students:</strong> ${students.length}</p>
          </div>
        `;
      }

      html += '</div>';
      container.innerHTML = html;
    } catch (error) {
      console.error('Error loading students:', error);
      container.innerHTML = `<div class="alert alert-danger">
        Error loading students: ${error.message || error}
        <br><small>Check browser console for more details</small>
      </div>`;
    }
  }

  async viewAssignedStudents(quizId) {
    try {
      const quiz = this.quizzes.find(q => q.id === quizId);
      const adminDashboard = document.querySelector('.admin-dashboard');
      const mainContent = adminDashboard.querySelector('#mainContent');

      let html = `
        <div class="assigned-students-section">
          <h2>${quiz.title} - Assigned Students</h2>
          <button class="btn btn-secondary mb-20" id="backBtn">← Back to Quizzes</button>
      `;

      const assignedCount = quiz.assignedTo ? quiz.assignedTo.length : 0;

      if (assignedCount === 0) {
        html += '<p>No students assigned to this quiz yet.</p>';
      } else {
        html += '<table class="table"><thead><tr><th>Student ID</th><th>Student Email</th><th>Action</th></tr></thead><tbody>';

        // Map student IDs to emails (these are pre-loaded users)
        const studentMap = {
          2: 'john@example.com',
          3: 'jane@example.com'
        };

        quiz.assignedTo.forEach(studentId => {
          const email = studentMap[studentId] || `Student ${studentId}`;
          html += `
            <tr>
              <td>${studentId}</td>
              <td>${email}</td>
              <td>
                <button class="btn btn-danger btn-sm" onclick="window.unassignStudent(${quizId}, ${studentId})">Unassign</button>
              </td>
            </tr>
          `;
        });

        html += '</tbody></table>';
      }

      html += `
        <div class="mt-20">
          <button class="btn btn-primary" id="assignMoreBtn">+ Assign Another Student</button>
        </div>
        </div>
      `;

      mainContent.innerHTML = html;

      mainContent.querySelector('#backBtn').addEventListener('click', () => {
        this.renderView('quizzes', adminDashboard);
      });

      mainContent.querySelector('#assignMoreBtn').addEventListener('click', () => {
        this.showAssignmentModal(quizId);
      });

      window.unassignStudent = (quizId, studentId) => this.unassignStudent(quizId, studentId);
    } catch (error) {
      alert('Error loading assigned students');
    }
  }

  async unassignStudent(quizId, studentId) {
    if (confirm('Are you sure you want to unassign this student from the quiz?')) {
      try {
        await api.admin.unassignQuiz(quizId, studentId, this.token);
        alert('Student unassigned successfully!');
        await this.renderView('quizzes', document.querySelector('.admin-dashboard'));
      } catch (error) {
        alert('Error unassigning student');
      }
    }
  }

  async renderAssignQuizzes(container) {
    container.innerHTML = '<div class="spinner"></div>';

    try {
      if (this.quizzes.length === 0) {
        this.quizzes = await api.admin.getQuizzes(this.token);
      }

      let html = '<div class="assign-quizzes-section"><h2>Assign Quizzes to Students</h2>';

      if (this.quizzes.length === 0) {
        html += '<p>No quizzes created yet. Create a quiz first!</p>';
        container.innerHTML = html + '</div>';
        return;
      }

      html += '<div class="assignment-grid">';

      for (const quiz of this.quizzes) {
        html += `
          <div class="card assignment-card">
            <h3>${quiz.title}</h3>
            <p><strong>Questions:</strong> ${quiz.questions.length}</p>
            <p><strong>Currently assigned to:</strong> ${quiz.assignedTo ? quiz.assignedTo.length : 0} students</p>
            <button class="btn btn-primary btn-sm" onclick="window.assignQuizToStudent(${quiz.id})">Manage Assignments</button>
          </div>
        `;
      }

      html += '</div></div>';
      container.innerHTML = html;

      window.assignQuizToStudent = (quizId) => this.showAssignmentModal(quizId);
    } catch (error) {
      container.innerHTML = '<div class="alert alert-danger">Error loading quizzes</div>';
    }
  }

  async showAssignmentModal(quizId) {
    try {
      // For now, get all users from local data
      // In production, you'd fetch all students from the backend
      const quiz = this.quizzes.find(q => q.id === quizId);

      const prompt = await this.promptStudentSelection(quiz);
      if (prompt && prompt.studentId) {
        await api.admin.assignQuiz(quizId, prompt.studentId, this.token);
        alert('Quiz assigned successfully!');
        await this.renderView('assign', document.querySelector('.admin-dashboard'));
      }
    } catch (error) {
      alert('Error assigning quiz. Make sure you have entered a valid Student ID.');
    }
  }

  async showAssignmentModal(quizId) {
    try {
      const quiz = this.quizzes.find(q => q.id === quizId);

      const studentIdStr = prompt(
        `Assign "${quiz.title}" quiz to a student.\n\n` +
        `Pre-loaded Students:\n` +
        `- ID: 2 → john@example.com\n` +
        `- ID: 3 → jane@example.com\n\n` +
        `Enter Student ID:`
      );

      if (!studentIdStr || !studentIdStr.trim()) {
        return;
      }

      const studentId = parseInt(studentIdStr);
      if (isNaN(studentId)) {
        alert('Invalid Student ID. Please enter a number.');
        return;
      }

      const response = await api.admin.assignQuiz(quizId, studentId, this.token);
      alert('Quiz assigned successfully!');

      // Refresh the assignment view
      await this.renderView('assign', document.querySelector('.admin-dashboard'));
    } catch (error) {
      console.error('Assignment error:', error);
      alert('Error assigning quiz. Please try again.');
    }
  }

  async editQuiz(quizId) {
    try {
      const quiz = await api.admin.getQuiz(quizId);
      const adminDashboard = document.querySelector('.admin-dashboard');
      const mainContent = adminDashboard.querySelector('#mainContent');

      let html = `
        <div class="edit-quiz-section">
          <h2>Edit Quiz: ${quiz.title}</h2>
          <form id="editQuizForm">
            <div class="form-group">
              <label for="title">Quiz Title</label>
              <input type="text" id="title" name="title" value="${quiz.title}" required>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" name="description" rows="3">${quiz.description || ''}</textarea>
            </div>

            <div id="questionsContainer"></div>

            <button type="button" class="btn btn-secondary" id="addQuestionBtn">+ Add Question</button>
            <div class="form-group mt-20">
              <button type="submit" class="btn btn-primary">Update Quiz</button>
              <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
            </div>
          </form>
        </div>
      `;

      mainContent.innerHTML = html;

      const questionsContainer = mainContent.querySelector('#questionsContainer');

      // Render existing questions
      quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'card question-card';
        questionDiv.innerHTML = `
          <h4>Question ${index + 1}</h4>
          <div class="form-group">
            <label>Question Text</label>
            <input type="text" name="question_${index}" value="${question.question}" required>
          </div>
          <div class="options-container">
            ${question.options.map((option, optIdx) => `
              <div class="form-group">
                <label>Option ${String.fromCharCode(65 + optIdx)}</label>
                <input type="text" name="option_${index}_${optIdx}" value="${option}" required>
              </div>
            `).join('')}
          </div>
          <div class="form-group">
            <label>Correct Answer</label>
            <select name="correct_${index}" required>
              <option value="0" ${question.correctAnswer === 0 ? 'selected' : ''}>Option A</option>
              <option value="1" ${question.correctAnswer === 1 ? 'selected' : ''}>Option B</option>
              <option value="2" ${question.correctAnswer === 2 ? 'selected' : ''}>Option C</option>
              <option value="3" ${question.correctAnswer === 3 ? 'selected' : ''}>Option D</option>
            </select>
          </div>
          <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()">Remove</button>
        `;
        questionsContainer.appendChild(questionDiv);
      });

      const addBtn = mainContent.querySelector('#addQuestionBtn');
      const form = mainContent.querySelector('#editQuizForm');
      const cancelBtn = mainContent.querySelector('#cancelBtn');
      let questionCount = quiz.questions.length;

      addBtn.addEventListener('click', () => {
        questionCount++;
        this.addQuestionField(mainContent, questionCount);
      });

      cancelBtn.addEventListener('click', () => {
        this.renderView('quizzes', adminDashboard);
      });

      form.addEventListener('submit', (e) => this.handleUpdateQuiz(e, quizId, mainContent));
    } catch (error) {
      alert('Error loading quiz for editing');
    }
  }

  async handleUpdateQuiz(e, quizId, container) {
    e.preventDefault();
    const form = container.querySelector('#editQuizForm');
    const formData = new FormData(form);

    const title = formData.get('title');
    const description = formData.get('description');
    const questions = [];

    let i = 0;
    while (formData.get(`question_${i}`) !== null) {
      const question = formData.get(`question_${i}`);
      if (question) {
        questions.push({
          question: question,
          options: [
            formData.get(`option_${i}_0`),
            formData.get(`option_${i}_1`),
            formData.get(`option_${i}_2`),
            formData.get(`option_${i}_3`)
          ],
          correctAnswer: parseInt(formData.get(`correct_${i}`))
        });
      }
      i++;
    }

    if (questions.length === 0) {
      alert('Add at least one question');
      return;
    }

    try {
      await api.admin.updateQuiz(quizId, { title, description, questions }, this.token);
      alert('Quiz updated successfully!');
      await this.renderView('quizzes', document.querySelector('.admin-dashboard'));
    } catch (error) {
      alert('Error updating quiz');
    }
  }

  async viewQuizResults(quizId) {
    try {
      const quiz = await api.admin.getQuiz(quizId);
      const results = await api.admin.getQuizResults(quizId, this.token);
      const adminDashboard = document.querySelector('.admin-dashboard');
      const mainContent = adminDashboard.querySelector('#mainContent');

      let html = `
        <div class="quiz-results-detail">
          <h2>${quiz.title} - Results</h2>
          <button class="btn btn-secondary mb-20" id="backBtn">← Back to Quizzes</button>
      `;

      if (results.length === 0) {
        html += '<p>No one has taken this quiz yet.</p>';
      } else {
        html += '<table class="table"><thead><tr><th>Student Name</th><th>Score</th><th>Percentage</th><th>Completed On</th></tr></thead><tbody>';

        results.forEach(result => {
          const date = new Date(result.completedAt).toLocaleString();
          const percentage = result.percentage.toFixed(2);
          html += `
            <tr>
              <td>${result.studentName}</td>
              <td>${result.score}/${result.totalQuestions}</td>
              <td>${percentage}%</td>
              <td>${date}</td>
            </tr>
          `;
        });

        html += '</tbody></table>';
      }

      html += '</div>';
      mainContent.innerHTML = html;

      mainContent.querySelector('#backBtn').addEventListener('click', () => {
        this.renderView('quizzes', adminDashboard);
      });
    } catch (error) {
      alert('Error loading quiz results');
    }
  }

  async deleteQuiz(quizId) {
    if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      try {
        await api.admin.deleteQuiz(quizId, this.token);
        alert('Quiz deleted successfully');
        await this.renderView('quizzes', document.querySelector('.admin-dashboard'));
      } catch (error) {
        alert('Error deleting quiz');
      }
    }
  }
}

