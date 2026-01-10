import 'dotenv/config'; 
import express from 'express';
import { createServer as createHttpsServer } from 'https'; // שימוש ב-https במקום http
import fs from 'fs'; // נדרש לקריאת קבצי התעודה
import { Server } from 'socket.io';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import db from './database.js';
import { analyzeUserImage } from './services/imageAnalysis.js';

const app = express();

// 1. טעינת קבצי התעודה (וודאי שהשמות תואמים לקבצים שנוצרו אצלך בתיקייה)
const sslOptions = {
  key: fs.readFileSync('./localhost+1-key.pem'), 
  cert: fs.readFileSync('./localhost+1.pem')
};

// 2. יצירת שרת HTTPS
const httpServer = createHttpsServer(sslOptions, app); 

const io = new Server(httpServer, {
  cors: {
    origin: "https://192.168.1.149:3000", 
    methods: ["GET", "POST"]
  }
});

const upload = multer({ storage: multer.memoryStorage() });
const SECRET_KEY = 'your_secret_key_here';

app.use(cors());
app.use(bodyParser.json());

// --- פונקציות עזר (ללא שינוי) ---
const jsonify = (obj) => (obj === null || obj === undefined) ? null : JSON.stringify(obj);
const parseJson = (str) => {
  if (str === null || str === undefined || str.trim() === '') return null;
  try { return JSON.parse(str); } catch (e) { return null; }
};
const formatUserFromDb = (dbUser) => {
  if (!dbUser) return null;
  return {
    username: dbUser.username,
    profile: parseJson(dbUser.profile),
    savedItems: parseJson(dbUser.savedItems) || []
  };
};

// --- Middleware (ללא שינוי) ---
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

io.on('connection', (socket) => {
  console.log('משתמש התחבר לסוקט:', socket.id);
  socket.on('disconnect', () => {
    console.log('משתמש התנתק מהסוקט');
  });
});

/* ----------------------- API ROUTES (ללא שינוי) ----------------------- */
app.post('/upload-profile-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const imageBase64 = req.file.buffer.toString('base64');
    const profileData = await analyzeUserImage(imageBase64, req.file.mimetype);
    const profileJson = jsonify(profileData);
    db.prepare('UPDATE users SET profile = ? WHERE username = ?').run(profileJson, req.username);
    res.json({ success: true, profile: profileData });
  } catch (error) {
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
  } catch (error) { res.status(500).json({ message: 'Error during signup' }); }
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
  } catch (error) { res.status(500).json({ message: 'Error during login' }); }
});

app.post('/get-user', (req, res) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(decoded.username);
    res.json({ user: formatUserFromDb(user) });
  } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
});

// 3. הפעלה בפורט 4000 עם HTTPS
httpServer.listen(4000, "0.0.0.0", () => {
  console.log('Server running on:');
  console.log('- Local: https://localhost:4000');
  console.log('- Network: https://192.168.1.149:4000');
});