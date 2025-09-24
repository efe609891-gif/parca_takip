import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const rows = await query('SELECT * FROM vehicles ORDER BY dateAdded DESC');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [vehicle] = await query('SELECT * FROM vehicles WHERE id = ? LIMIT 1', [req.params.id]);
  if (!vehicle) return res.status(404).json({ message: 'Not found' });
  const parts = await query('SELECT * FROM parts WHERE vehicleId = ? ORDER BY dateAdded DESC', [req.params.id]);
  res.json({ ...vehicle, parts });
});

router.post('/', async (req, res) => {
  const v = req.body;
  try {
    await query(
      `INSERT INTO vehicles (id, brand, model, year, fuel, km, price, color, vin, condition, description, photo, totalSales, status, dateAdded)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [v.id, v.brand, v.model, v.year, v.fuel, v.km, v.price, v.color, v.vin, v.condition, v.description || null, v.photo || null, v.totalSales || 0, v.status, toDate(v.dateAdded)]
    );
    res.status(201).json({ id: v.id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.put('/:id', async (req, res) => {
  const v = req.body;
  try {
    await query(
      `UPDATE vehicles SET brand=?, model=?, year=?, fuel=?, km=?, price=?, color=?, vin=?, condition=?, description=?, photo=?, totalSales=?, status=? WHERE id=?`,
      [v.brand, v.model, v.year, v.fuel, v.km, v.price, v.color, v.vin, v.condition, v.description || null, v.photo || null, v.totalSales || 0, v.status, req.params.id]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  await query('DELETE FROM vehicles WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

router.post('/:id/parts', async (req, res) => {
  const p = req.body;
  const vehicleId = req.params.id;
  try {
    await query(
      `INSERT INTO parts (id, vehicleId, name, price, description, dateAdded) VALUES (?, ?, ?, ?, ?, ?)`,
      [p.id, vehicleId, p.name, p.price, p.description || null, toDate(p.dateAdded)]
    );
    await query('UPDATE vehicles SET totalSales = totalSales + ? WHERE id = ?', [p.price, vehicleId]);
    res.status(201).json({ id: p.id });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id/parts/:partId', async (req, res) => {
  const vehicleId = req.params.id;
  const partId = req.params.partId;
  const [part] = await query('SELECT price FROM parts WHERE id = ? AND vehicleId = ? LIMIT 1', [partId, vehicleId]);
  await query('DELETE FROM parts WHERE id = ? AND vehicleId = ?', [partId, vehicleId]);
  if (part) {
    await query('UPDATE vehicles SET totalSales = totalSales - ? WHERE id = ?', [part.price, vehicleId]);
  }
  res.json({ ok: true });
});

function toDate(iso) {
  const d = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default router;


