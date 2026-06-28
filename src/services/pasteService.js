const { nanoid } = require('nanoid');
const db = require('../db');

function _computeExpiry(expiration) {
  const now = Date.now();
  if (!expiration || expiration === 'never') return null;
  if (expiration === '1m') return now + 60 * 1000;
  if (expiration === '10m') return now + 10 * 60 * 1000;
  if (expiration === '1d') return now + 24 * 60 * 60 * 1000;
  if (expiration === '1w') return now + 7 * 24 * 60 * 60 * 1000;
  return null;
}

async function createPaste(content, { expiration = 'never', visibility = 'public', isSensitive = false, iv = null, salt = null } = {}) {
  const id = nanoid(8);
  const now = Date.now();
  const expiresAt = _computeExpiry(expiration);

  const query = `
    INSERT INTO pastes (id, content, created_at, expires_at, visibility, burned, encrypted, iv, salt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [id, content, now, expiresAt, visibility, false, isSensitive, iv, salt];
  await db.execute(query, values);

  return {
    id,
    content,
    createdAt: now,
    expiresAt,
    visibility,
    burned: false,
    encrypted: isSensitive,
    iv,
    salt,
  };
}

async function getPaste(id) {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT id, content, created_at AS createdAt, expires_at AS expiresAt, visibility, burned, encrypted, iv, salt FROM pastes WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return null;
    const paste = rows[0];
    if (paste.burned) return null;

    if (paste.expiresAt !== null && paste.expiresAt <= Date.now()) {
      await connection.execute('DELETE FROM pastes WHERE id = ?', [id]);
      return null;
    }

    return paste;
  } finally {
    connection.release();
  }
}

module.exports = {
  createPaste,
  getPaste,
};
