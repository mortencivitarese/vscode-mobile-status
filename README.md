# VS Code Mobile Status

A minimal mobile-friendly dashboard that lets you check the state of your local VS Code/AI-agent work from your phone.

## What this includes
- Local server that tracks status
- Web dashboard for phone browser
- Installable as a PWA on Android
- VS Code helper to push status updates to the dashboard

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open in browser:
   ```text
   http://localhost:3000
   ```
4. On your Samsung phone, open the URL in Chrome and choose “Add to Home screen”.

## Send a status update

```bash
curl -X POST http://localhost:3000/api/status \
  -H "Content-Type: application/json" \
  -d '{"status":"running","agent":"copilot","model":"gpt-5","project":"my-project","file":"src/app.py","log":"Agent started"}'
```

## Notes
This is intentionally lightweight and acts as a prototype. It is designed to be the minimum version that makes you feel in control of what VS Code/your coding agents are doing from your phone.
