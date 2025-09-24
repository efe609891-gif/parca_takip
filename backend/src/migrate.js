import { pool, query } from './db.js';

export async function createDbAndRunMigrations() {
  // Ensure database exists (only works if user has permission)
  // Note: Database must match pool config; create manually if necessary.

  // Create tables
  await query(`CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    name VARCHAR(150),
    email VARCHAR(150),
    createdAt DATETIME NOT NULL
  )`);

  await query(`CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(100) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    fuel VARCHAR(50) NOT NULL,
    km INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    color VARCHAR(50) NOT NULL,
    vin VARCHAR(100) NOT NULL UNIQUE,
    condition VARCHAR(50) NOT NULL,
    description TEXT,
    photo LONGTEXT,
    totalSales DECIMAL(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL,
    dateAdded DATETIME NOT NULL
  )`);

  await query(`CREATE TABLE IF NOT EXISTS parts (
    id VARCHAR(100) PRIMARY KEY,
    vehicleId VARCHAR(100) NOT NULL,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    dateAdded DATETIME NOT NULL,
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE
  )`);

  await query(`CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(100) PRIMARY KEY,
    vehicleId VARCHAR(100) NOT NULL,
    partName VARCHAR(200) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    date DATETIME NOT NULL,
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE
  )`);

  // Seed default admin if missing
  const existing = await query('SELECT id FROM users WHERE username = ? LIMIT 1', ['admin']);
  if (existing.length === 0) {
    const now = new Date();
    await query(
      'INSERT INTO users (id, username, password, role, name, email, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['admin', 'admin', 'admin123', 'admin', 'Sistem Yöneticisi', 'admin@parcatakip.com', formatDate(now)]
    );
  }
}

function formatDate(d) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}


