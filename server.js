const app = require('./src/app');
const { scheduleDailyCleanup, triggerCleanupIfDue } = require('./src/cleanupScheduler');

app.use((req, res, next) => {
  triggerCleanupIfDue();
  next();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Pastebin clone backend listening on port ${PORT}`);
});

scheduleDailyCleanup();
