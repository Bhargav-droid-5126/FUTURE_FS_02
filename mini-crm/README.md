# Client Lead Management System (Mini CRM)

This is a modern, responsive Mini CRM built with the MERN stack for managing client leads efficiently.

## Features

- **Admin Login:** Secured with JWT and bcrypt password hashing.
- **Lead Dashboard:** Grid of leads with search, filtering (by status), and beautiful interactive badges.
- **Single Lead Profile:** Comprehensive view showcasing lead contact information, dates, status, and history.
- **Notes System:** A nested follow-up system adding time-stamped logs of all communication and changes for deep CRM capability.
- **Beautiful UI:** A responsive, modern design using vanilla CSS inspired by glass-morphism and subtle accent-driven layouts.

## Tech Stack

- **Frontend:** React.js + Vite + React Router + Axios + Lucide-React (Icons).
- **Backend:** Node.js + Express.
- **Database:** MongoDB + Mongoose.

## Installation

### Prerequisites
- Node.js installed
- MongoDB installed (or URI for Mongo Atlas)

### Backend setup
1. Open terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file (a default one is included).
4. Start the server:
   ```bash
   npm run dev
   ```
   > Server will run on `http://localhost:5000`

> **Note on Initial Admin Creation:** 
> You can send a POST request with an email and password to `/api/auth/register` using Postman/CURL once to generate an Admin if needed.

### Frontend setup
1. Open another terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev client:
   ```bash
   npm run dev
   ```

Enjoy your Mini CRM!
