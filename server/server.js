const express = require('express');
const fs = require('fs');
const path = require('path');
const isbot = require('isbot');
const DIST_PATH = path.resolve(__dirname, '../dist');

const PORT = process.env.PORT || 3001;
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || '490', 10);
const DATA_FILE = path.join(__dirname, 'usage.json');

let usage = { date: '', count: 0 };

function loadUsage() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    usage = JSON.parse(data);
  } catch (err) {
    usage = { date: '', count: 0 };
  }
}

function saveUsage() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(usage), 'utf8');
}

function resetIfNeeded() {
  const today = new Date().toISOString().split('T')[0];
  if (usage.date !== today) {
    usage.date = today;
    usage.count = 0;
    saveUsage();
  }
}

loadUsage();
resetIfNeeded();

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/usage', (req, res) => {
  resetIfNeeded();
  res.json({
    used: usage.count,
    remaining: DAILY_LIMIT - usage.count,
    limit: DAILY_LIMIT,
  });
});

app.post('/api/increment', (req, res) => {
  resetIfNeeded();
  if (usage.count >= DAILY_LIMIT) {
    return res.json({ allowed: false, used: usage.count, remaining: 0, limit: DAILY_LIMIT });
  }
  usage.count += 1;
  saveUsage();
  res.json({ allowed: true, used: usage.count, remaining: DAILY_LIMIT - usage.count, limit: DAILY_LIMIT });
});

app.use(express.static(DIST_PATH));
app.get('*', (req, res) => {
  const ua = req.get('user-agent') || '';
  if (isbot(ua)) {
    const reqPath = req.path.replace(/\/$/, '') || '/';
    const filePath = reqPath === '/' ? 'index.html' : reqPath.slice(1) + '/index.html';
    const fullPath = path.join(DIST_PATH, filePath);
    if (fs.existsSync(fullPath)) {
      return res.sendFile(fullPath);
    }
  }
  res.sendFile(path.join(DIST_PATH, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
