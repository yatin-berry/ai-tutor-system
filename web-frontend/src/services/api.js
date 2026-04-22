import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (email, password) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },
};

export const quizService = {
  generateQuestions: async (subject, topic, level, numQuestions) => {
    const response = await api.post('/generate-questions', {
      subject,
      topic,
      level,
      num_questions: numQuestions,
    });
    return response.data;
  },
  submitQuiz: async (subject, topic, level, questions, answers) => {
    const response = await api.post('/submit-quiz', {
      subject,
      topic,
      level,
      questions,
      answers,
    });
    return response.data;
  },
};

export const interviewService = {
  startInterview: async (role, level, totalQuestions) => {
    const response = await api.post('/start-interview', {
      role,
      level,
      total_questions: totalQuestions,
    });
    return response.data;
  },
  submitAnswer: async (sessionId, answer) => {
    const response = await api.post('/submit-interview-answer', {
      session_id: sessionId,
      answer,
    });
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

export default api;
