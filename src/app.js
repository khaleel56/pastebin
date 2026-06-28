const path = require('path');
const express = require('express');
const pastesRouter = require('./routes/pastes');
const cleanupRouter = require('./routes/cleanup');
const pasteService = require('./services/pasteService');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/pastes', pastesRouter);
app.use('/api/cleanup', cleanupRouter);

app.get('/', (req, res) => {
  res.render('index', { shareUrl: null, error: null });
});

app.get('/pastes/:id', async (req, res) => {
  try {
    const paste = await pasteService.getPaste(req.params.id);
    if (!paste) {
      return res.status(404).render('paste', { paste: null, error: 'Paste not found or expired.' });
    }

    res.render('paste', { paste, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).render('paste', { paste: null, error: 'Unable to load paste.' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Pastebin clone backend is healthy' });
});

module.exports = app;
