const db = require('./db');

async function cleanupExpiredPastes() {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.execute(
      'DELETE FROM pastes WHERE expires_at IS NOT NULL AND expires_at <= ?',
      [Date.now()]
    );
    console.log(`Expired pastes cleanup complete. ${result.affectedRows} rows removed.`);
  } finally {
    connection.release();
  }
}

module.exports = {
  cleanupExpiredPastes,
};
