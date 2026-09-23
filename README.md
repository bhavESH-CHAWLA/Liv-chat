# Liv-Chat

Liv-Chat is a full-stack real-time messaging application built with React, Vite, Express, MongoDB, Socket.IO, and modern security features for authenticated chat and contact management.

It supports user signup, email verification, password reset, secure sessions, real-time chat, contact requests, online presence, profile customization, and media sharing.

## Table of Contents
- Overview
- Key Features
- Tech Stack
- Project Structure
- Prerequisites
- Environment Variables
- Local Development Setup
- Production Deployment
- Security & Rate Limiting
- API Highlights
- Usage Guide
- Troubleshooting

## Overview

Liv-Chat is designed as a modern messaging app for real-time communication between authenticated users. The app combines:

- a React frontend with Vite and Tailwind styling
- an Express backend API with JWT cookie authentication
- MongoDB persistence for users, contacts, and messages
- Socket.IO for live online status and instant messaging
- email-based verification and reset flows
- Arcjet-powered request protection and rate limiting
- Cloudinary-powered image uploads

The UX is optimized for responsiveness and includes a clean dashboard with chat sidebar, contact management, QR-based invite flow, message search, and media previews.

## Key Features

### Authentication
- Sign up with full name, email, and password
- Email verification before login
- Secure JWT-based authentication with HTTP-only cookies
- Login/logout flows
- Password reset via email token
- Password change from authenticated user session
- Account deletion
- Optional 2FA by email verification code

### User Profiles
- Update profile name and photo
- View public profile details of other users
- Display online/offline presence
- Contact list management
- Search by user name or email

### Real-Time Messaging
- Instant messaging using Socket.IO
- Live online user tracking
- Message delivery updates
- Optimistic UI for sending messages
- Message history per accepted contact
- Support for text and image messages
- Notification sound toggle
- Message search and active conversation switching

### Contact System
- Send contact requests
- Accept or decline requests
- Maintain accepted contacts list
- View incoming and outgoing requests
- Restrict chats to accepted contacts only
- Chat list sorted around recent interactions

### Invite / Sharing Experience
- QR code card to share a profile invite
- Invite-based flow for users to connect to others
- Public profile route for invite links

### Security & Abuse Protection
- JWT cookie authentication
- CORS configuration with environment-based origin policies
- MongoDB validation and connection checks
- Arcjet middleware for request rate limiting and suspicious activity detection
- Sensitive routes protected via middleware
- Password hashing via bcrypt
- Email verification before access to protected features

### Email Features
- Welcome email
- Email verification email
- Reset password email
- 2FA code email delivery
- Configurable SMTP using Brevo/Resend-style email providers

### UI Features
- Dark modern chat interface
- Responsive two-panel layout
- Sidebar tabs for Chats and Contacts
- Search inputs for users and conversations
- QR invite panel toggle
- Lightbox for uploaded images
- Skip links and accessibility-focus improvements

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Zustand for state management
- Axios for API calls
- React Router
- Socket.IO Client
- Lucide icons
- React Hot Toast

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- JWT
- bcryptjs
- Cloudinary
- Nodemailer
- Arcjet
- dotenv

## Project Structure

```text
Liv-chat/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controllers.js
│   │   │   └── message.controllers.js
│   │   ├── emails/
│   │   │   ├── emailHandlers.js
│   │   │   └── emailTemplates.js
│   │   ├── lib/
│   │   │   ├── arcjet.js
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   ├── resend.js
│   │   │   ├── socket.js
│   │   │   └── utils.js
│   │   ├── middleware/
│   │   │   ├── arcjet.middleware.js
│   │   │   ├── auth.middleware.js
│   │   │   └── socket.auth.middleware.js
│   │   ├── models/
│   │   │   ├── Message.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── messages.routes.js
│   │   └── server.js
│   ├── .env
│   ├── package.json
│   └── railway.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
├── render.yaml
├── package.json
├── .gitignore
└── README.md
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 20 or newer
- npm or pnpm
- MongoDB instance running or MongoDB Atlas connection string
- SMTP provider credentials for email sending
- Cloudinary account for image upload storage
- Optional: Render or another deployment platform

## Environment Variables

Create a `.env` file inside the `backend` folder with the following variables:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
EMAIL_FROM="LivChat <you@example.com>"

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

### Frontend environment

If needed for production or a separate API host, add a frontend environment variable:

```env
VITE_API_URL=http://localhost:3000/api
```

## Local Development Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start the backend

```bash
cd backend
npm run dev
```

This starts the Express server with nodemon.

### 4. Start the frontend

```bash
cd frontend
npm run dev
```

The frontend runs on Vite default port 5173 by default unless otherwise configured.

### 5. Access the app

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Production Deployment

This project is set up for deployment on Render.

### Render configuration

The repo includes a `render.yaml` file for a web backend and static frontend deployment pattern.

Recommended deployment flow:

1. Deploy the backend as a Node web service
2. Copy the backend public URL
3. Set `CLIENT_URL` to your frontend URL in backend env
4. Set `VITE_API_URL` to the backend API URL in frontend env
5. Deploy the frontend as a static site
6. Redeploy both services

### Example production values

```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
VITE_API_URL=https://your-backend-domain.onrender.com/api
```

## Security & Rate Limiting

The backend uses Arcjet middleware to protect routes and reduce abuse. This includes protections for:

- excessive request volume
- suspicious behavior from unauthenticated or authenticated requests
- route-specific protection
- user session integrity

The auth and message routes are wrapped with middleware to enforce rules before data operations happen.

## API Highlights

### Auth routes
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/verify-login-2fa
- POST /api/auth/request-password-reset
- POST /api/auth/reset-password
- POST /api/auth/verify-email
- POST /api/auth/resend-verification
- PUT /api/auth/update-profile
- PUT /api/auth/change-password
- POST /api/auth/enable-2fa
- POST /api/auth/verify-2fa
- POST /api/auth/disable-2fa
- DELETE /api/auth/delete-account
- GET /api/auth/check

### Messages routes
- GET /api/messages/contacts
- GET /api/messages/chats
- GET /api/messages/requests
- GET /api/messages/profile/:id
- GET /api/messages/:id
- POST /api/messages/send/:id
- POST /api/messages/request/:id
- POST /api/messages/request/:id/accept
- POST /api/messages/request/:id/decline

## Usage Guide

### Sign up flow
1. Open the app and create an account
2. Check your inbox for a verification email
3. Click the verification link
4. Log in

### Contact flow
1. Open the contact list
2. Search for a user
3. Send a contact request
4. Wait for the other user to accept
5. Start messaging once connected

### Real-time chat
1. Open a contact from the chat list
2. Send a plain text message or image
3. The receiver receives it immediately through Socket.IO
4. Online status updates are reflected live

### Password recovery
1. Click Forgot Password on login
2. Enter email
3. Receive reset link by email
4. Set a new password

### Two-factor authentication
1. Enable 2FA from profile settings or account management
2. Login flow will request a 6-digit code sent to email
3. Verify code to complete login

## Troubleshooting

### MongoDB not connecting
- Check `MONGO_URI` in backend `.env`
- Ensure the MongoDB cluster is reachable
- Verify the database user has access permissions

### Email not sending
- Check SMTP credentials and host values
- Confirm `EMAIL_FROM` is valid
- Ensure the SMTP provider allows your application to send mail

### Frontend cannot reach backend
- Confirm `VITE_API_URL` is set correctly
- Ensure the backend server is running
- Check CORS settings and `CLIENT_URL`

### Login stuck or unauthorized
- Confirm JWT secret is set
- Ensure the cookie is being sent and accepted by browser
- Verify cookies are not blocked in third-party browsing modes

### Render deployment errors
- Make sure the backend runtime is configured with a Node entrypoint
- Ensure `PORT` is exposed correctly in the deployment environment
- Set `CLIENT_URL` and `VITE_API_URL` to the correct production URLs

## Notes

This project is structured for fast iteration and production deployment. It is suitable as a foundation for a messaging app, a startup MVP, or a social / community chat product.

## License

This project is currently provided as a personal project without a formal open-source license. If you plan to reuse it commercially, ensure you add the appropriate licensing terms first.

## Future Enhancements

Potential additions include:
- group chat rooms
- read receipts
- typing indicators
- message reactions
- dark/light theme toggle
- thread conversations
- push notifications
- admin dashboard
- file attachments beyond images
- message encryption

---

If you want, I can also add a shorter project summary section optimized for GitHub and a deployment-specific README for Render. 
