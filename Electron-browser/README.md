# Custom Electron Browser

## Installation

Clone the repository:

```sh
git clone https://github.com/THofbauer27/Masterarbeit
cd Electron-browser
```

Install dependencies:

```sh
npm install
```

## Usage

Start the application:

```sh
npm start
```

## Basic Controls

- **New Tab**: Click the '+' button.
- **Close Tab**: Click the '×' on a tab.
- **Navigate**: Enter a URL and press Enter.
- **Toggle UI**: Press `Ctrl+Shift+H`.
- **Fullscreen**: Use the standard OS toggle.

## File Structure

```
custom-browser/
├── index.js         # Main process configuration
├── index.html      # Browser window UI
├── preload.js      # IPC communication bridge
├── styles/
│   └── tailwind.min.css  # Tailwind CSS styles
└── browser-data/   # Persistent user data
```

## Security Features

### Context Isolation and Sandboxing

```javascript
// In index.js, when creating the BrowserWindow:
webPreferences: {
  contextIsolation: true,
  sandbox: true,
  preload: path.join(__dirname, "preload.js")
}
```

### Content Security Policy (CSP) Headers

```javascript
// In main process, set the CSP headers:
"Content-Security-Policy": [
  "default-src 'self' 'unsafe-inline' data: blob: filesystem: http: https: ws: wss;"
]
```

### Webview Hardening

```javascript
// Harden webviews in main process:
mainWindow.webContents.on("will-attach-webview", (event, webPreferences) => {
  webPreferences.nodeIntegration = false;
  webPreferences.contextIsolation = true;
});
```

## Development

Live reload is enabled via `electron-reload`.

### Ignored Paths

- `browser-data/`
- `node_modules/`

### Example: electron-reload Configuration

```javascript
require("electron-reload")(__dirname, {
  electron: require(`${__dirname}/node_modules/electron`),
  ignored: /browser-data|node_modules|[/\\]./
});
```

