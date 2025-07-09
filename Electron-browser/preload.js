const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // URL speichern
  writeCurrentURL: (url) => ipcRenderer.send("write-current-url", url),

  // Keylogs
  readLogs: () => ipcRenderer.invoke("read-logs"),
  writeLogs: (logs) => ipcRenderer.send("write-logs", logs),
  deleteLogs: () => ipcRenderer.send("delete-logs"),

  // Mouselogs
  readMouseLogs: () => ipcRenderer.invoke("read-mouselogs"),
  writeMouseLogs: (logs) => ipcRenderer.send("write-mouselogs", logs),
  
});


