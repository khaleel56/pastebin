const { cleanupExpiredPastes } = require('./cleanup');

let cleanupInProgress = false;
let lastCleanupAt = null;
const scheduledHour = Number(process.env.CLEANUP_HOUR || 22);
const scheduledMinute = Number(process.env.CLEANUP_MINUTE || 0);

function getScheduledDateForToday() {
  const now = new Date();
  const scheduled = new Date(now);
  scheduled.setHours(scheduledHour, scheduledMinute, 0, 0);
  return scheduled;
}

function isCleanupDue() {
  const now = new Date();
  const scheduledToday = getScheduledDateForToday();
  return now >= scheduledToday && (!lastCleanupAt || lastCleanupAt < scheduledToday);
}

async function runCleanup() {
  if (cleanupInProgress) {
    return;
  }
  cleanupInProgress = true;
  try {
    await cleanupExpiredPastes();
    lastCleanupAt = new Date();
  } finally {
    cleanupInProgress = false;
  }
}

function triggerCleanupIfDue() {
  if (isCleanupDue()) {
    runCleanup().catch((err) => {
      console.error('Request-triggered cleanup failed:', err);
    });
  }
}

function scheduleDailyCleanup(hour = scheduledHour, minute = scheduledMinute) {
  const now = new Date();
  const nextRun = new Date(now);
  nextRun.setHours(hour, minute, 0, 0);
  if (nextRun <= now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  const delay = nextRun.getTime() - now.getTime();
  console.log(`Scheduled expired paste cleanup for ${nextRun.toISOString()}`);

  setTimeout(async function runAndReschedule() {
    try {
      await runCleanup();
    } catch (err) {
      console.error('Scheduled cleanup failed:', err);
    }
    scheduleDailyCleanup(hour, minute);
  }, delay);
}

module.exports = {
  triggerCleanupIfDue,
  scheduleDailyCleanup,
};
