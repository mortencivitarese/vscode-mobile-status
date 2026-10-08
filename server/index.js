const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 3000;

const statusState = {
  status: 'idle',
  session: 'desktop-session',
  project: 'VS Code workspace',
  file: 'No file open',
  model: 'not connected',
  agent: 'idle',
  logs: [
    { ts: new Date().toISOString(), text: 'Dashboard started' }
  ],
  tests: 'not running',
  build: 'not running',
  lastUpdated: new Date().toISOString()
};

function broadcast() {
  const payload = JSON.stringify(statusState);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/status', (req, res) => {
  res.json(statusState);
});

app.post('/api/status', (req, res) => {
  const body = req.body || {};
  Object.assign(statusState, {
    status: body.status || statusState.status,
    session: body.session || statusState.session,
    project: body.project || statusState.project,
    file: body.file || statusState.file,
    model: body.model || statusState.model,
    agent: body.agent || statusState.agent,
    tests: body.tests || statusState.tests,
    build: body.build || statusState.build,
    lastUpdated: new Date().toISOString()
  });

  if (body.log) {
    statusState.logs.unshift({
      ts: new Date().toISOString(),
      text: String(body.log)
    });
    statusState.logs = statusState.logs.slice(0, 20);
  }

  broadcast();
  res.json({ ok: true, state: statusState });
});

app.post('/api/log', (req, res) => {
  const text = String(req.body?.text || '');
  if (text) {
    statusState.logs.unshift({ ts: new Date().toISOString(), text });
    statusState.logs = statusState.logs.slice(0, 20);
    statusState.lastUpdated = new Date().toISOString();
    broadcast();
  }
  res.json({ ok: true });
});

app.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(statusState));
});

server.listen(port, () => {
  console.log(`VS Code mobile status dashboard running on http://localhost:${port}`);
});
