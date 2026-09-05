const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("savanna", {
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  clearData: () => ipcRenderer.invoke("clear-data")
});