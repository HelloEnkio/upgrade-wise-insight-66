const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

let queue = [];
let processing = false;
let dailyCount = 0;
let lastReset = new Date().toISOString().split('T')[0];

const DATA_FILE = path.join(__dirname, 'usage.json');

function loadUsage() {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    dailyCount = data.count;
    lastReset = data.date;
  } catch (err) {
    saveUsage();
  }
}

function saveUsage() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ date: lastReset, count: dailyCount }));
}

const MAX_DAILY_REQUESTS = 490;
const MAX_REQUESTS_PER_MINUTE = 15;
const MINUTE = 60 * 1000;
let windowStart = Date.now();
let requestCount = 0;

loadUsage();

function resetDailyIfNeeded() {
  const today = new Date().toISOString().split('T')[0];
  if (today !== lastReset) {
    dailyCount = 0;
    lastReset = today;
    saveUsage();
  }
}

function getQueueStatus() {
  const now = Date.now();
  const timeUntilReset = MINUTE - (now - windowStart);
  return {
    queueLength: queue.length,
    position: queue.length > 0 ? 1 : 0,
    requestsRemaining: MAX_REQUESTS_PER_MINUTE - requestCount,
    timeUntilReset: Math.max(0, timeUntilReset),
    estimatedWaitTime: queue.length * 1000
  };
}

app.get('/api/usage', (req, res) => {
  resetDailyIfNeeded();
  res.json({
    used: dailyCount,
    remaining: MAX_DAILY_REQUESTS - dailyCount,
    limit: MAX_DAILY_REQUESTS,
    percentage: Math.round((dailyCount / MAX_DAILY_REQUESTS) * 100)
  });
});

app.get('/api/queue/status', (req, res) => {
  resetDailyIfNeeded();
  res.json(getQueueStatus());
});

app.post('/api/queue', (req, res) => {
  resetDailyIfNeeded();
  if (dailyCount >= MAX_DAILY_REQUESTS) {
    return res.status(429).json({ error: 'Daily quota exceeded' });
  }
  const item = { type: req.body.type, data: req.body.data, res };
  queue.push(item);
  processQueue();
});

async function processQueue() {
  if (processing) return;
  processing = true;
  while (queue.length) {
    const now = Date.now();
    if (now - windowStart >= MINUTE) {
      requestCount = 0;
      windowStart = now;
    }
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      const wait = MINUTE - (now - windowStart);
      await new Promise(r => setTimeout(r, wait));
      requestCount = 0;
      windowStart = Date.now();
    }
    const item = queue.shift();
    await new Promise(r => setTimeout(r, 1000));
    dailyCount++;
    saveUsage();
    requestCount++;
    item.res.json({ ok: true, type: item.type, data: item.data });
  }
  processing = false;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
});
