# Task Manager Server

## Overview
Node.js/Express backend for the Task Manager app. It provides user authentication and task CRUD APIs with encrypted task descriptions and cookie-based JWT auth.

## Features
- User registration, login, logout
- JWT auth stored in HTTP-only cookies
- Task CRUD (create, list, update, delete)
- Pagination, status filtering, and search
- AES-256-GCM encryption for task descriptions at rest

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Joi for validation
- JWT for authentication
- Bcrypt for password hashing

## Requirements
- Node.js (LTS recommended)
- MongoDB instance

## Setup
```bash
npm install
```

## Environment Variables
Create `server/.env` with the following values:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=32_character_secret_key_here
CLIENT_URL=http://localhost:5173
```

Notes:
- `ENCRYPTION_KEY` must be exactly 32 characters.
- Cookies are configured for cross-site use in production; set `CLIENT_URL` to the frontend origin.

## Run in Development
```bash
npm run dev
```

## Run in Production
```bash
npm start
```

## API Base
All routes are served under:
```
http://localhost:5000/api
```

## Endpoints
Auth:
- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/me`
- POST `/auth/logout`

Tasks (auth required):
- GET `/tasks` (supports `page`, `limit`, `status`, `search`)
- POST `/tasks`
- PUT `/tasks/:id`
- DELETE `/tasks/:id`

## Project Structure
```
server/
  src/
    config/         Database connection
    controllers/    Request handlers
    middleware/     Auth and validation
    models/         Mongoose schemas
    routes/         API routes
    utils/          Crypto helpers
    validators/     Joi schemas
```

## Notes
- Auth uses HTTP-only cookies named `token`.
- If `MONGODB_URI` is missing, the server exits with an error.
- Task descriptions are encrypted before storage and decrypted on read.

## Deployment

### Railway Deployment (Recommended)

1. **Setup MongoDB Atlas:**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist all IPs (0.0.0.0/0) for Railway access
   - Get your connection string

2. **Deploy to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js

3. **Configure Environment Variables:**
   Add these in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
   JWT_SECRET=your_secure_random_string_here
   ENCRYPTION_KEY=your_32_character_secret_key
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

4. **Configure Start Command:**
   Railway auto-detects `npm start`. Verify in Settings → Deploy.

5. **Deploy:**
   - Railway will automatically deploy
   - Copy your deployment URL

### Render Deployment

1. **Setup MongoDB Atlas** (same as above)

2. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select `server` as root directory

3. **Configure Build Settings:**
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables:**
   In Render dashboard, add:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   ENCRYPTION_KEY=your_32_character_encryption_key
   CLIENT_URL=https://your-frontend-url.com
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Render will build and deploy automatically

### Vercel Deployment (Serverless)

1. **Add `vercel.json` in server root:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "src/server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "src/server.js"
       }
     ]
   }
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   
3. **Add environment variables via Vercel dashboard**

### Environment Variables for Production

**Required:**
- `NODE_ENV=production`
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Strong random string (use: `openssl rand -base64 32`)
- `ENCRYPTION_KEY` - Exactly 32 characters (use: `openssl rand -hex 16`)
- `CLIENT_URL` - Your frontend URL (for CORS)
- `PORT` - Usually auto-set by platform (Railway/Render)

### Generating Secure Keys

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate Encryption Key (32 chars)
openssl rand -hex 16
```

### MongoDB Atlas Setup

1. **Create Cluster:**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Choose a cloud provider and region

2. **Create Database User:**
   - Go to Database Access
   - Add new database user
   - Use strong password
   - Grant read/write permissions

3. **Configure Network Access:**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add your deployment platform's IP ranges

4. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `taskmanager`

### Post-Deployment Steps

1. **Test API Endpoints:**
   ```bash
   curl https://your-backend-url.com/
   # Should return: "API is running"
   ```

2. **Test Registration:**
   ```bash
   curl -X POST https://your-backend-url.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

3. **Update Frontend:**
   - Set `VITE_API_URL` in frontend to your backend URL
   - Redeploy frontend

4. **Verify CORS:**
   - Test login from your deployed frontend
   - Check browser console for CORS errors

### Security Checklist

- [ ] `NODE_ENV=production` is set
- [ ] Strong JWT_SECRET (min 32 characters)
- [ ] ENCRYPTION_KEY is exactly 32 characters
- [ ] MongoDB user has strong password
- [ ] CLIENT_URL matches your frontend domain
- [ ] Secrets are not committed to Git
- [ ] MongoDB Atlas has IP whitelist configured
- [ ] HTTPS is enabled (free with Railway/Render/Vercel)

### Monitoring

**Railway:**
- View logs in dashboard → Deployments
- Set up log drains for production monitoring

**Render:**
- View logs in dashboard → Logs tab
- Enable auto-deploy on push

### Troubleshooting

**Database Connection Failed:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access (0.0.0.0/0)
- Ensure database user credentials are correct

**CORS Errors:**
- Verify CLIENT_URL matches frontend domain (include https://)
- Check if cookies are being sent (credentials: true)

**Authentication Issues:**
- Ensure JWT_SECRET is the same across all instances
- Check cookie settings (secure: true in production)
- Verify SameSite cookie settings
