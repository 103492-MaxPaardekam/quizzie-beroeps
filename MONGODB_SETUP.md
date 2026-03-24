# Quizzie MongoDB Setup Guide

## 📖 Overview

Your Quizzie app now uses MongoDB to store quiz scores persistently! This means scores won't disappear when you refresh the page or restart the browser.

## 🚀 Quick Start

### Step 1: Install MongoDB

**Option A: MongoDB Community Edition (Local)**
For macOS:

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

**Option B: MongoDB Atlas (Cloud - Recommended for learning)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user and password
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/quizzie`)

### Step 2: Install Dependencies

```bash
cd /Volumes/1TB-Max/School/BEROEPS1/Quizzie/quizzie-beroeps-1
npm install
```

This installs:

- `express` - Web server framework
- `mongoose` - MongoDB object modeling
- `cors` - Enable cross-origin requests
- `nodemon` - Auto-restart server on changes (dev only)

### Step 3: Configure MongoDB Connection

Create a `.env` file in your project root:

```bash
cp .env.example .env
```

Then edit `.env` with your MongoDB connection string:

**For local MongoDB:**

```
MONGODB_URI=mongodb://localhost:27017/quizzie
PORT=3000
```

**For MongoDB Atlas:**

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/quizzie
PORT=3000
```

### Step 4: Start the Server

```bash
npm start
```

Or for development (auto-reload on changes):

```bash
npm run dev
```

You should see:

```
✅ Connected to MongoDB
🚀 Quizzie server running on http://localhost:3000
📊 API available at http://localhost:3000/api
```

### Step 5: Open the App

Open your browser to: **http://localhost:3000/index.html**

## 🎯 How It Works

### Backend (server.js)

- Express server serves your HTML files and handles API requests
- MongoDB stores all quiz scores with user names, timestamps, and percentages
- Automatically keeps only the highest score per user per quiz

### API Endpoints

| Method | Endpoint                            | Description                       |
| ------ | ----------------------------------- | --------------------------------- |
| POST   | `/api/scores`                       | Save a new score                  |
| GET    | `/api/scores/:quizId`               | Get all scores for a quiz         |
| GET    | `/api/leaderboard/:quizId`          | Get top 10 scores (best per user) |
| GET    | `/api/user-score/:quizId/:userName` | Get a user's best score           |
| DELETE | `/api/scores/:quizId`               | Clear all scores for a quiz       |
| GET    | `/api/health`                       | Check server and DB status        |

### Frontend Changes

- Replaced `localStorage` functions with API calls using `fetch()`
- All score functions are now `async` and use `await`
- Added loading states for the leaderboard
- Scores persist across devices and browsers

## 🧪 Testing

### Test the API

Check if server is running:

```bash
curl http://localhost:3000/api/health
```

View leaderboard for a quiz:

```bash
curl http://localhost:3000/api/leaderboard/milieu
```

### Clear Scores (for testing)

```bash
curl -X DELETE http://localhost:3000/api/scores/milieu
curl -X DELETE http://localhost:3000/api/scores/gemeentehuis
```

## 📚 MongoDB Basics

### View Your Data

**Using MongoDB Compass (GUI)**

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string
3. Browse the `quizzie` database and `scores` collection

**Using MongoDB Shell**

```bash
mongosh
use quizzie
db.scores.find().pretty()
db.scores.countDocuments()
```

### Useful MongoDB Commands

```javascript
// Find all scores for milieu quiz
db.scores.find({ quizId: "milieu" });

// Find scores above 80%
db.scores.find({ percentage: { $gte: 80 } });

// Get top 5 scores
db.scores.find().sort({ percentage: -1 }).limit(5);

// Count total scores
db.scores.countDocuments();

// Delete all scores (careful!)
db.scores.deleteMany({});
```

## 🗂️ Data Schema

Each score document in MongoDB has this structure:

```javascript
{
  _id: ObjectId("..."),
  quizId: "milieu",              // Quiz identifier
  userName: "Jan Jansen",         // User's full name
  score: 8,                       // Number correct
  total: 10,                      // Total questions
  percentage: 80,                 // Score percentage
  timestamp: ISODate("2026-03-24T...")  // When completed
}
```

## 🔧 Troubleshooting

**Error: Failed to fetch**

- Make sure the server is running (`npm start`)
- Check that you're accessing via `http://localhost:3000`, not just opening the HTML files directly

**Error: MongoDB connection failed**

- Verify your `MONGODB_URI` in `.env` is correct
- For Atlas: Check your IP is whitelisted (use 0.0.0.0/0 for testing)
- For local: Make sure MongoDB service is running (`brew services list`)

**Scores not saving**

- Check browser console for errors (F12)
- Check server console for errors
- Verify API health: `http://localhost:3000/api/health`

## 📖 Learn More About MongoDB

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)

## 🎓 What You're Learning

By implementing this, you're learning:

- **NoSQL databases** - Document-based storage vs traditional SQL
- **RESTful APIs** - Creating endpoints to interact with data
- **Backend development** - Node.js and Express server setup
- **Data modeling** - Designing schemas with Mongoose
- **Async/await** - Modern JavaScript for handling API calls
- **CORS** - Cross-origin resource sharing concepts

Enjoy building with MongoDB! 🍃
