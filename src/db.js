const mysql = require('mysql2/promise');

const connectionString = process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/pastebindb';
const pool = mysql.createPool({
  uri: connectionString,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function init() {
  const createTable = `
    CREATE TABLE IF NOT EXISTS pastes (
      id VARCHAR(32) PRIMARY KEY,
      content TEXT NOT NULL,
      created_at BIGINT NOT NULL,
      expires_at BIGINT NULL,
      visibility VARCHAR(20) NOT NULL,
      burned BOOLEAN NOT NULL DEFAULT false,
      encrypted BOOLEAN NOT NULL DEFAULT false,
      iv VARCHAR(255) NULL,
      salt VARCHAR(255) NULL
    );
  `;
  const checkIndex = `
    SELECT COUNT(1) AS cnt
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'pastes'
      AND index_name = 'idx_pastes_expires_at';
  `;

  const connection = await pool.getConnection();
  try {
    await connection.query(createTable);
    const [rows] = await connection.query(checkIndex);
    const exists = rows && rows[0] && rows[0].cnt > 0;
    if (!exists) {
      await connection.query('CREATE INDEX idx_pastes_expires_at ON pastes (expires_at);');
    }
  } finally {
    connection.release();
  }
}

init().catch((err) => {
  console.error('Failed to initialize database:', err);
});

module.exports = pool;
