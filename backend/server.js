import 'dotenv/config'; // חייב להיות ראשון!
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import db from './database.js';
import { analyzeUserImage } from './services/imageAnalysis.js';

const app = express();
const httpServer = createServer(app); // יצירת שרת HTTP עבור Socket.io
// בתוך server.js
const io = new Server(httpServer, {
  cors: {
    // החלף את הכתובת הזו בכתובת ה-IP של המחשב שלך בפורט שבו רץ ה-Vite
    origin: "https://192.168.1.149:3000", 
    // או לצרכי בדיקה בלבד, כדי לאפשר לכל מכשיר: origin: "*"
    methods: ["GET", "POST"]
  }
});

const upload = multer({ storage: multer.memoryStorage() });
const SECRET_KEY = 'your_secret_key_here';

app.use(cors());
app.use(bodyParser.json());

// --- פונקציות עזר ---
const jsonify = (obj) => (obj === null || obj === undefined) ? null : JSON.stringify(obj);

const parseJson = (str) => {
  if (str === null || str === undefined || str.trim() === '') return null;
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const formatUserFromDb = (dbUser) => {
  if (!dbUser) return null;
  return {
    username: dbUser.username,
    profile: parseJson(dbUser.profile),
    savedItems: parseJson(dbUser.savedItems) || []
  };
};

// --- Middleware לאימות טוקן ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.username = decoded.username;
    next();
  });
};

// --- ניהול חיבורי Socket ---
io.on('connection', (socket) => {
  console.log('משתמש התחבר לסוקט:', socket.id);

  // כאן אפשר להוסיף לוגיקה של סוקטים בעתיד (כמו 'upload_image' שדיברנו עליו)
  
  socket.on('disconnect', () => {
    console.log('משתמש התנתק מהסוקט');
  });
});

/* ----------------------- API ROUTES ----------------------- */

app.post('/upload-profile-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    // ניתוח ב-Gemini
    const profileData = await analyzeUserImage(imageBase64, mimeType);

    // עדכון בסיס הנתונים
    const profileJson = jsonify(profileData);
    db.prepare('UPDATE users SET profile = ? WHERE username = ?')
      .run(profileJson, req.username);

    res.json({ success: true, profile: profileData });
  } catch (error) {
    console.error('Error in image upload:', error);
    res.status(500).json({ message: 'Failed to analyze image' });
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = db.prepare('SELECT username FROM users WHERE username = ?').get(username);
    if (existingUser) return res.status(400).json({ message: 'Username exists' });
  
    const passwordHash = await bcrypt.hash(password, 10);
    db.prepare('INSERT INTO users (username, passwordHash, profile, savedItems) VALUES (?, ?, ?, ?)')
      .run(username, passwordHash, jsonify(null), jsonify([]));

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { username, profile: null, savedItems: [] } });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: formatUserFromDb(user) });
  } catch (error) {
    res.status(500).json({ message: 'Error during login' });
  }
});

app.post('/get-user', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(decoded.username);
    if (!user) return res.status(400).json({ message: 'User not found' });
    res.json({ user: formatUserFromDb(user) });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// שימוש ב-httpServer במקום app.listen כדי שגם הסוקט וגם ה-API יעבדו
httpServer.listen(4000, "0.0.0.0", () => {
  console.log('Server running on:');
  console.log('- Local: http://localhost:4000');
  console.log('- Network: https://192.168.1.149:4000');
});