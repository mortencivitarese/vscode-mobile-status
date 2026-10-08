const http = require('http');

function sendStatus(payload) {
  const body = JSON.stringify(payload);
  const req = http.request('http://localhost:3000/api/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, (res) => {
    res.resume();
  });

  req.on('error', () => {});
  req.write(body);
  req.end();
}

function activate(context) {
  const vscode = require('vscode');

  const command = async () => {
    const activeEditor = vscode.window.activeTextEditor;
    const fileName = activeEditor?.document?.fileName || 'No file open';
    sendStatus({
      status: 'running',
      session: 'desktop-session',
      project: 'VS Code workspace',
      file: fileName,
      model: 'agent active',
      agent: 'copilot',
      build: 'idle',
      tests: 'idle',
      log: 'Status pushed from VS Code helper'
    });
  };

  context.subscriptions.push(vscode.commands.registerCommand('vscode-mobile-status.sendStatus', command));
}

module.exports = { activate };
