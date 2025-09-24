import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'parca_takip',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool = mysql.createPool(config);

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}


