# Voting Application

A full-stack application for voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

## Project Structure

- `/frontend`: React application with Vite and Tailwind CSS.
- `/backend`: TypeScript and Express server with MongoDB integration.

## Features

- User sign up and login with Aadhar Card Number and password
- User can view the list of candidates
- User can vote for a candidate (only once)
- Admin can manage candidates (add, update, delete)
- Admin can vote


## 🚀 Tech Stack

### Frontend
* Framework: React 19 (via Vite)
* Styling: Tailwind CSS, `clsx`, `tailwind-merge`
* Routing: React Router v7
* Icons: Lucide React
* Animations: Motion (`motion/react`)
* Visualization: Recharts

### Backend
* Runtime Environment: Node.js
* Framework: Express.js (v4)
* Database: MongoDB Atlas 
* Language: TypeScript (`tsx` for dev environment)

### Security & Integrations
* Authentication: JSON Web Tokens (JWT) for secure session management
* Password Hashing:`bcryptjs`

# API Endpoints

## Authentication

### Sign Up
- `POST /signup`: Sign up a user

### Login
- `POST /login`: Login a user

## Candidates

### Get Candidates
- `GET /candidates`: Get the list of candidates

### Add Candidate
- `POST /candidates`: Add a new candidate (Admin only)

### Update Candidate
- `PUT /candidates/:id`: Update a candidate by ID (Admin only)

### Delete Candidate
- `DELETE /candidates/:id`: Delete a candidate by ID (Admin only)

## Voting

### Get Vote Count
- `GET /candidates/vote/count`: Get the count of votes for each candidate

### Vote for Candidate
- `POST /candidates/vote/:id`: Vote for a candidate (User only)

## User Profile

### Get Profile
- `GET /users/profile`: Get user profile information

### Change Password
- `PUT /users/profile/password`: Change user password