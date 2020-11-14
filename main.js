const { app, BrowserWindow, Menu, globalShortcut } = require("electron");

process.env.NODE_ENV = "development";
const isDev = process.env.NODE_ENV !== "production" ? true : false;

//console.log(process.platform)
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: 500,
    height: 600,
    icon: "./assets/icons/Icon_256x256.png",
    resizable: isDev ? true : false,
    backgroundColor: "white",
  });

  // mainWindow.loadURL("https://www.google.com")
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
}
app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload());
  globalShortcut.register("Ctrl+Shift+I", () => mainWindow.toggleDevTools());

  mainWindow.on("ready", () => {
    mainWindow = null;
  });
});
const menu = [
  {
    role: "fileMenu",
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { role: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
