export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  voterId: string;
  role: UserRole;
  hasVoted: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Candidate {
  _id: string;
  name: string;
  party: string;
  symbol: string;
  image?: string;
  description: string;
  voteCount: number;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
  verificationToken?: string;
  resetToken?: string;
  message?: string;
}

export interface ElectionRules {
  title: string;
  rules: string[];
}
