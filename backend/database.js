import Database from 'better-sqlite3';

const db = new Database('data.db');

// יצירת טבלת משתמשים אם לא קיימת
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  passwordHash TEXT NOT NULL,
  profile TEXT,
  savedItems TEXT
);
`);

export default db;
