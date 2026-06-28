const pasteService = require('../services/pasteService');

function createPaste(req, res) {
  const { content, expiration = 'never', visibility = 'public' } = req.body;

  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: 'content is required and must be a string' });
  }
  pasteService.createPaste(content, { expiration, visibility })
    .then((paste) => {
      const shareUrl = `${req.protocol}://${req.get('host')}/pastes/${paste.id}`;
      res.status(201).json({
        id: paste.id,
        url: `/pastes/${paste.id}`,
        shareUrl,
        expiresAt: paste.expiresAt,
        visibility: paste.visibility,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Unable to create paste' });
    });
}

function getPaste(req, res) {
  const { id } = req.params;
  pasteService.getPaste(id)
    .then((paste) => {
      if (!paste) {
        return res.status(404).json({ error: 'Paste not found' });
      }
      res.json({
        id: paste.id,
        content: paste.content,
        createdAt: paste.createdAt,
        expiresAt: paste.expiresAt,
        visibility: paste.visibility,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Unable to retrieve paste' });
    });
}

module.exports = {
  createPaste,
  getPaste,
};
