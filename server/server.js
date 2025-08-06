const express = require('express');
const fs = require('fs');
const path = require('path');
const isbot = require('isbot');
const cors = require('cors');
const helmet = require('helmet');
const DIST_PATH = path.resolve(__dirname, '../dist');

const PORT = process.env.PORT || 3001;
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || '490', 10);
const DATA_FILE = path.join(__dirname, 'usage.json');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: ['https://domaine.com'] }));
app.use(express.json());

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

app.post('/api/gemini', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  const { prompt, maxOutputTokens } = req.body;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxOutputTokens ?? 4096,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return res.status(500).json({ error: 'Gemini API request failed' });
    }

    res.json(data);
  } catch (err) {
    console.error('Error calling Gemini API:', err);
    res.status(500).json({ error: 'Failed to fetch from Gemini API' });
  }
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
