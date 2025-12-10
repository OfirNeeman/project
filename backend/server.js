import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// מסד נתונים מדומה
const users = {}; // { username: { passwordHash, profile, savedItems } }

const SECRET_KEY = 'your_secret_key_here';

/* ----------------------- SIGNUP ----------------------- */
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (users[username]) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users[username] = { passwordHash, profile: null, savedItems: [] };

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token, user: { username, profile: null, savedItems: [] } });
});

/* ----------------------- LOGIN ----------------------- */
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token, user: { username, profile: user.profile, savedItems: user.savedItems } });
});

/* ----------------------- SAVE PROFILE ----------------------- */
app.post('/save-profile', (req, res) => {
  const { username, token, profile } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.username !== username) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!users[username]) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    users[username].profile = profile;

    res.json({ success: true, profile });

  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

/* ----------------------- GET USER ----------------------- */
app.post('/get-user', (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;

    if (!users[username]) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    return res.json({
      user: {
        username,
        profile: users[username].profile,
        savedItems: users[username].savedItems
      }
    });

  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

/* ----------------------- START SERVER ----------------------- */
app.listen(4000, () => console.log('Server running on http://localhost:4000'));
