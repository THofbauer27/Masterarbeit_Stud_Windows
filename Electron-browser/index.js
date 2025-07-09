const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const fs = require("fs");

let mainWindow;
let reviewWindow;
let isQuitting = false;

const LOG_PATH = path.join(__dirname, "keylog.jsonl");
const MOUSELOG_PATH = path.join(__dirname, "mouselog.jsonl");
const CURRENT_URL_FILE = path.join(__dirname, "current_url.txt");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    },
  });

  mainWindow.setTitle("MIBP");
  mainWindow.loadFile("index.html");

  // 🔄 NEUE FENSTER ABFANGEN UND ALS NEUE TABS LADEN
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    console.log("🧭 Neues Fenster abgefangen:", url);
    mainWindow.webContents.send("open-url-in-tab", url);
    return { action: "deny" }; // blockiert echtes Fenster
  });

  // Python-Keylogger starten
  const pythonScript = path.join(__dirname, "keylogger.py");
  const keylogger = spawn("python", [pythonScript], {
    detached: true,
    stdio: "ignore"
  });
  keylogger.unref();

  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();

      exec("taskkill /IM python.exe /F", (error) => {
        if (error) {
          console.error("⚠️ Fehler beim Beenden des Keyloggers:", error);
        }

        reviewWindow = new BrowserWindow({
          width: 1000,
          height: 700,
          webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
          }
        });

        reviewWindow.loadFile("log-review.html");

        reviewWindow.on("closed", () => {
          isQuitting = true;
          app.quit();
        });

        mainWindow.destroy();
      });
    }
  });
}

// 📄 aktuelle URL in Datei schreiben
ipcMain.on("write-current-url", (event, url) => {
  try {
    fs.writeFileSync(CURRENT_URL_FILE, url, "utf-8");
    console.log("📄 current_url.txt aktualisiert:", url);
  } catch (err) {
    console.error("❌ Fehler beim Schreiben der current_url.txt:", err);
  }
});

// 🧠 JSONL: Keylogs lesen
ipcMain.handle("read-logs", async () => {
  if (fs.existsSync(LOG_PATH)) {
    try {
      const rawText = fs.readFileSync(LOG_PATH, "utf-8");
      const lines = rawText
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            console.warn("⚠️ Ungültige Zeile übersprungen:", line);
            return null;
          }
        })
        .filter(entry => entry !== null);
      return lines;
    } catch (err) {
      console.error("❌ Fehler beim Lesen von Logs:", err);
      return [];
    }
  }
  return [];
});

// 🧠 JSONL: Keylogs schreiben (auch leer)
ipcMain.on("write-logs", (event, logs) => {
  try {
    const lines = logs.map(log => JSON.stringify(log)).join("\n");
    fs.writeFileSync(LOG_PATH, lines, "utf-8");
  } catch (err) {
    console.error("❌ Fehler beim Schreiben von Logs:", err);
  }
});

// 🧠 JSONL: Keylogs löschen (optional)
ipcMain.on("delete-logs", () => {
  try {
    if (fs.existsSync(LOG_PATH)) {
      fs.unlinkSync(LOG_PATH);
      console.log("🗑️ Logs gelöscht.");
    }
  } catch (err) {
    console.error("❌ Fehler beim Löschen von Logs:", err);
  }
});

// 🖱️ JSONL: Mouselogs lesen
ipcMain.handle("read-mouselogs", async () => {
  if (fs.existsSync(MOUSELOG_PATH)) {
    try {
      const rawText = fs.readFileSync(MOUSELOG_PATH, "utf-8");
      const lines = rawText
        .split("\n")
        .filter(line => line.trim() !== "")
        .map(line => {
          try {
            return JSON.parse(line);
          } catch (e) {
            console.warn("⚠️ Ungültige Zeile in Mouselogs übersprungen:", line);
            return null;
          }
        })
        .filter(entry => entry !== null);
      return lines;
    } catch (err) {
      console.error("❌ Fehler beim Lesen von Mouselogs:", err);
      return [];
    }
  }
  return [];
});

// 🖱️ JSONL: Mouselogs schreiben (auch leer)
ipcMain.on("write-mouselogs", (event, logs) => {
  try {
    const lines = logs.map(log => JSON.stringify(log)).join("\n");
    fs.writeFileSync(MOUSELOG_PATH, lines, "utf-8");
  } catch (err) {
    console.error("❌ Fehler beim Schreiben von Mouselogs:", err);
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (!isQuitting) {
      // warte auf Log-Review-Fenster
    } else {
      app.quit();
    }
  }
});











