# Social Media Manager

A comprehensive social media management platform that allows users to create, schedule, and publish posts across multiple social media platforms.

## Features

- User authentication (register, login)
- Create, edit, and delete posts
- Schedule posts for future publication
- Connect multiple social media accounts (Twitter, Facebook, Instagram, LinkedIn)
- Publish posts to multiple platforms simultaneously
- View analytics and engagement metrics

## Tech Stack

- **Frontend**: React, Material-UI, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Social media API keys (Twitter, Facebook, Instagram, LinkedIn)

## Installation

1. Install dependencies:
   ```
   npm install
   cd client
   npm install
   cd ..
   ```

2. Create a `.env` file in the root directory. You can copy the provided
   template and fill in your values:
   ```
   cp .env.example .env
   ```
   The required variables are `MONGODB_URI` and `JWT_SECRET` (use a long
   random string). See `.env.example` for the full list, including the
   optional social platform API keys.

## Running the Application

### Development Mode

To run both the frontend and backend in development mode:

```
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

### Production Mode

To build and run in production mode:

1. Build the frontend:
   ```
   cd client
   npm run build
   cd ..
   ```

2. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile

### Posts
- `GET /api/posts` - Get all posts for the authenticated user
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `POST /api/posts/:id/publish` - Publish a post to social media platforms

### Social Media Accounts
- `POST /api/social/connect/twitter` - Connect Twitter account
- `POST /api/social/connect/facebook` - Connect Facebook account
- `POST /api/social/connect/instagram` - Connect Instagram account
- `POST /api/social/connect/linkedin` - Connect LinkedIn account
- `GET /api/social/accounts` - Get all connected social media accounts
- `DELETE /api/social/disconnect/:platform` - Disconnect a social media account

## License

MIT 