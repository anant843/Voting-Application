import { AuthResponse, Candidate, UserProfile, ElectionRules } from '../types';

const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  async login(credentials: any): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },

  async signup(data: any): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }
    return response.json();
  },

  async getMe(): Promise<UserProfile | null> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },
  async forgotPassword(email: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  },

  async verifyEmail(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email/${token}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Verification failed');
    }
    return response.json();
  },

  async resetPassword(token: string, password: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Reset failed');
    }
    return response.json();
  },

  async getDigiLockerUrl(): Promise<{ url: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/digilocker/url`);
    if (!response.ok) {
      throw new Error('Failed to get DigiLocker URL');
    }
    return response.json();
  },

  // Candidates
  async getCandidates(): Promise<Candidate[]> {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      headers: getHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }
    return response.json();
  },

  async addCandidate(data: any): Promise<Candidate> {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add candidate');
    } return response.json();
  },

  // Voting
  async vote(candidateId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/vote/${candidateId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cast vote');
    }
    return response.json();
  },

  async deleteCandidate(candidateId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete candidate');
    }
    return response.json();
  },

  // Rules
  async getRules(): Promise<ElectionRules> {
    const response = await fetch(`${API_BASE_URL}/rules`);
    if (!response.ok) {
      throw new Error('Failed to fetch rules');
    }
    return response.json();
  },
};
