import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const u = req.body;
  try {
    await query(
      `INSERT INTO users (id, username, password, role, name, email, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)` ,
      [u.id, u.username, u.password, u.role, u.name || null, u.email || null, toDate(u.createdAt)]
    );
    res.status(201).json({ id: u.id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/:username', async (req, res) => {
  const [user] = await query('SELECT * FROM users WHERE username = ? LIMIT 1', [req.params.username]);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
});

function toDate(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default router;


