import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './database.js'; // ייבוא חיבור למסד הנתונים SQLite

const app = express();
app.use(cors());
app.use(bodyParser.json());

// מפתח סודי עבור JWT (נשאר ללא שינוי)
const SECRET_KEY = 'your_secret_key_here';

// --- פונקציות עזר לטיפול בנתוני JSON מ/אל מסד הנתונים ---
const jsonify = (obj) => (obj === null || obj === undefined) ? null : JSON.stringify(obj);

const parseJson = (str) => {
  if (str === null || str === undefined || str.trim() === '') return null;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Error parsing JSON from DB:", str, e);
    return null;
  }
};

const formatUserFromDb = (dbUser) => {
  if (!dbUser) return null;

  // המרת מחרוזות JSON לאובייקטים
  const profile = parseJson(dbUser.profile);
  const savedItems = parseJson(dbUser.savedItems) || [];

  return {
    username: dbUser.username,
    profile: profile,
    savedItems: savedItems
  };
};
// -----------------------------------------------------------------


/* ----------------------- SIGNUP ----------------------- */
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // בדיקה אם המשתמש כבר קיים
    const existingUser = db.prepare('SELECT username FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
  
    const passwordHash = await bcrypt.hash(password, 10);
    
    // הוספת משתמש חדש למסד הנתונים
    db.prepare('INSERT INTO users (username, passwordHash, profile, savedItems) VALUES (?, ?, ?, ?)')
      .run(username, passwordHash, jsonify(null), jsonify([])); // profile is null, savedItems is []

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, user: { username, profile: null, savedItems: [] } });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error during signup' });
  }
});

/* ----------------------- LOGIN ----------------------- */
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // שליפת המשתמש ממסד הנתונים
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    const formattedUser = formatUserFromDb(user);

    res.json({ token, user: formattedUser });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

/* ----------------------- SAVE PROFILE ----------------------- */
app.post('/save-profile', (req, res) => {
  const { username, token, profile } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.username !== username) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // שמירת הפרופיל (כמחרוזת JSON) במסד הנתונים
    const profileJson = jsonify(profile);
    const info = db.prepare('UPDATE users SET profile = ? WHERE username = ?')
      .run(profileJson, username);
      
    if (info.changes === 0) {
        // יכול לקרות אם המשתמש נמחק איכשהו מאז הלוגין האחרון
        return res.status(400).json({ message: 'User does not exist' });
    }

    res.json({ success: true, profile });

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Save profile error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/* ----------------------- GET USER ----------------------- */
app.post('/get-user', (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;

    // שליפת נתוני המשתמש
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    
    const formattedUser = formatUserFromDb(user);
    
    return res.json({ user: formattedUser });

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Get user error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/* ----------------------- START SERVER ----------------------- */
app.listen(4000, () => console.log('Server running on http://localhost:4000'));