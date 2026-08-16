import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database.');
    
    // Create scores table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        character_id TEXT NOT NULL,
        total_score INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// API: Save a new score
app.post('/api/scores', (req, res) => {
  const { playerName, characterId, totalScore } = req.body;
  
  if (!playerName || !characterId || typeof totalScore !== 'number') {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare('INSERT INTO scores (player_name, character_id, total_score) VALUES (?, ?, ?)');
  stmt.run([playerName, characterId, totalScore], function(err) {
    if (err) {
      console.error('Error saving score:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ id: this.lastID, message: 'Score saved successfully' });
  });
});

// API: Get top 10 scores
app.get('/api/scores', (req, res) => {
  db.all('SELECT * FROM scores ORDER BY total_score DESC LIMIT 10', [], (err, rows) => {
    if (err) {
      console.error('Error fetching scores:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
