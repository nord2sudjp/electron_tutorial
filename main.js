const path = require("path");
const os = require("os");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
// const imageminMozjpeg = require("imageminmozjpeg");
const slash = require("slash");

process.env.NODE_ENV = "development";
const isDev = process.env.NODE_ENV !== "production" ? true : false;

//console.log(process.platform)
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: isDev ? 800 : 500,
    height: 600,
    icon: "./assets/icons/Icon_256x256.png",
    resizable: isDev ? true : false,
    backgroundColor: "white",
    webPreferences: { nodeIntegration: true },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // mainWindow.loadURL("https://www.google.com")
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
}

function createAboutWindow() {
  mainWindow = new BrowserWindow({
    title: "ImageShrink",
    width: 300,
    height: 300,
    icon: "./assets/icons/Icon_256x256.png",
    resizable: isDev ? true : false,
    backgroundColor: "white",
  });

  // mainWindow.loadURL("https://www.google.com")
  mainWindow.loadFile("./app/about.html");
}

app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  //globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload());
  //globalShortcut.register("Ctrl+Shift+I", () => mainWindow.toggleDevTools());

  mainWindow.on("ready", () => {
    mainWindow = null;
  });
});
const menu = [
  {
    role: "fileMenu",
  },
  { label: "Help", submenu: [{ label: "About", click: createAboutWindow }] },
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

ipcMain.on("image:minimize", (e, options) => {
  console.log("ipcMain.on: ", options);

  options.dest = path.join(os.homedir(), "imageshrink");
  shrinkImage(options);
});

async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQuality = quality / 100;

    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminPngquant({
          quality: [pngQuality, pngQuality],
        }),
      ],
    });
    console.log("shrinkImage:", files);
    shell.openItem(dest);

    mainWindow.webContents.send("image:done");
  } catch (err) {
    console.log("shrinkImage@err:", err);
    mainWindow.webContents.send("image:err");
  }
}

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
