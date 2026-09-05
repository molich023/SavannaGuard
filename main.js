const { app, BrowserWindow, session, ipcMain, shell } = require("electron");
const path = require("path");
const { URL } = require("url");

const HOME = `file://${path.join(__dirname, "index.html")}`;

function allowedURL(raw) {
  try {
    const u = new URL(raw);
    return ["http:", "https:"].includes(u.protocol);
  } catch (_) { return false; }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 980,
    minHeight: 650,
    backgroundColor: "#071411",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      webviewTag: true
    }
  });

  const ses = win.webContents.session;

  // Privacy baseline: block third-party cookies and common tracking/storage surfaces.
  ses.webRequest.onBeforeSendHeaders((details, callback) => {
    const h = { ...details.requestHeaders };
    delete h["X-Client-Data"];
    callback({ requestHeaders: h });
  });

  ses.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders };
    headers["Referrer-Policy"] = ["no-referrer"];
    headers["Permissions-Policy"] = ["geolocation=(), microphone=(), camera=(), payment=()"];
    headers["X-Content-Type-Options"] = ["nosniff"];
    headers["X-Frame-Options"] = ["SAMEORIGIN"];
    callback({ responseHeaders: headers });
  });

  // Keep navigation inside the browser. External apps can still be opened explicitly.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (allowedURL(url)) return { action: "allow" };
    return { action: "deny" };
  });

  win.loadURL(HOME);
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: ["*://*/*"] },
    (details, callback) => {
      const u = details.url.toLowerCase();
      const blocked = [
        "doubleclick.net", "googlesyndication.com", "google-analytics.com",
        "googletagmanager.com", "facebook.net", "connect.facebook.net",
        "ads-twitter.com", "adnxs.com", "scorecardresearch.com",
        "quantserve.com", "hotjar.com", "clarity.ms"
      ].some(d => u.includes(d));
      callback({ cancel: blocked });
    }
  );

  ipcMain.handle("open-external", async (_, url) => {
    if (allowedURL(url)) await shell.openExternal(url);
    return true;
  });

  ipcMain.handle("clear-data", async () => {
    await session.defaultSession.clearStorageData();
    return true;
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});