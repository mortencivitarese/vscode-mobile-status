const statusPill = document.getElementById('status-pill');
const sessionName = document.getElementById('session-name');
const projectName = document.getElementById('project-name');
const currentFile = document.getElementById('current-file');
const agentName = document.getElementById('agent-name');
const modelName = document.getElementById('model-name');
const buildStatus = document.getElementById('build-status');
const testStatus = document.getElementById('test-status');
const logList = document.getElementById('log-list');

const setStatusPill = (status) => {
  statusPill.className = `pill ${status}`;
  statusPill.textContent = status;
};

const updateState = (state) => {
  const safeStatus = state.status || 'idle';
  setStatusPill(safeStatus);
  sessionName.textContent = state.session || 'desktop-session';
  projectName.textContent = state.project || 'VS Code workspace';
  currentFile.textContent = state.file || 'No file open';
  agentName.textContent = state.agent || 'idle';
  modelName.textContent = state.model || 'not connected';
  buildStatus.textContent = state.build || 'not running';
  testStatus.textContent = state.tests || 'not running';

  logList.innerHTML = '';
  const logs = Array.isArray(state.logs) ? state.logs : [];
  logs.slice(0, 8).forEach((entry) => {
    const item = document.createElement('li');
    const time = document.createElement('span');
    time.className = 'log-time';
    time.textContent = new Date(entry.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const text = document.createElement('span');
    text.textContent = entry.text;
    item.appendChild(text);
    item.appendChild(time);
    logList.appendChild(item);
  });
};

const connect = () => {
  const ws = new WebSocket(`ws://${window.location.hostname}:3000`);
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateState(data);
  };
  ws.onclose = () => {
    setStatusPill('error');
    setTimeout(connect, 2000);
  };
};

fetch('/api/status')
  .then((res) => res.json())
  .then(updateState)
  .catch(() => {
    setStatusPill('error');
  });

connect();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
