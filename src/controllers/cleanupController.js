const { cleanupExpiredPastes } = require('../cleanup');

async function runCleanup(req, res) {
  try {
    await cleanupExpiredPastes();
    res.json({ status: 'cleanup completed' });
  } catch (error) {
    console.error('Cleanup request failed:', error);
    res.status(500).json({ error: 'Unable to perform cleanup' });
  }
}

module.exports = {
  runCleanup,
};
