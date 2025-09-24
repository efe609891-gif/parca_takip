import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const rows = await query('SELECT * FROM sales ORDER BY date DESC');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const s = req.body;
  try {
    await query(
      `INSERT INTO sales (id, vehicleId, partName, amount, date) VALUES (?, ?, ?, ?, ?)`,
      [s.id, s.vehicleId, s.partName, s.amount, toDate(s.date)]
    );
    res.status(201).json({ id: s.id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/report', async (req, res) => {
  const { startDate, endDate } = req.query;
  const rows = await query('SELECT * FROM sales WHERE date BETWEEN ? AND ? ORDER BY date ASC', [startDate, endDate]);
  res.json(rows);
});

function toDate(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default router;


