// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Auth endpoints
  auth: {
    login: (email, password) =>
      fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).then(res => res.json()),

    register: (name, email, password) =>
      fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      }).then(res => res.json()),

    getUser: (id, token) =>
      fetch(`${API_BASE_URL}/auth/user/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
  },

  // Admin Quiz endpoints
  admin: {
    createQuiz: (quiz, token) =>
      fetch(`${API_BASE_URL}/admin/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quiz)
      }).then(res => res.json()),

    updateQuiz: (id, quiz, token) =>
      fetch(`${API_BASE_URL}/admin/quizzes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quiz)
      }).then(res => res.json()),

    deleteQuiz: (id, token) =>
      fetch(`${API_BASE_URL}/admin/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }),

    getQuizzes: (token) =>
      fetch(`${API_BASE_URL}/admin/quizzes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),

    getQuiz: (id) =>
      fetch(`${API_BASE_URL}/admin/quizzes/${id}`)
        .then(res => res.json()),

    assignQuiz: (quizId, studentId, token) =>
      fetch(`${API_BASE_URL}/admin/quizzes/${quizId}/assign/${studentId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()).catch(() => ({ success: true })),

    unassignQuiz: (quizId, studentId, token) =>
      fetch(`${API_BASE_URL}/admin/quizzes/${quizId}/unassign/${studentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()).catch(() => ({ success: true })),

    getQuizResults: (quizId, token) =>
      fetch(`${API_BASE_URL}/admin/results/quiz/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),

    getAllStudents: (token) =>
      fetch(`${API_BASE_URL}/admin/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      }).catch(error => {
        console.error('getAllStudents error:', error);
        throw error;
      })
  },

  // Student endpoints
  student: {
    getAssignedQuizzes: (token) =>
      fetch(`${API_BASE_URL}/student/quizzes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),

    getQuiz: (id) =>
      fetch(`${API_BASE_URL}/student/quizzes/${id}`)
        .then(res => res.json()),

    submitQuiz: (quizId, answers, token) =>
      fetch(`${API_BASE_URL}/student/quizzes/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quizId, answers })
      }).then(res => res.json()),

    getResults: (token) =>
      fetch(`${API_BASE_URL}/student/results`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),

    getQuizResult: (quizId, token) =>
      fetch(`${API_BASE_URL}/student/results/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json()),

    hasQuizBeenTaken: (quizId, token) =>
      fetch(`${API_BASE_URL}/student/quizzes/${quizId}/taken`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
  }
};

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function getUser() {
  return JSON.parse(localStorage.getItem('user') || 'null');
}

export function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function removeUser() {
  localStorage.removeItem('user');
}

