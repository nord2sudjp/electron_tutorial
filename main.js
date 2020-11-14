// console.log("Hello");

const { app, BrowserWindow } = require('electron')

let mainWindow


function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'ImageShrink',
        width: 500,
        height : 600
    })

    // mainWindow.loadURL("https://www.google.com")
    mainWindow.loadURL(`file://${__dirname}/app/index.html`)
    

}

app.on('ready', createMainWindow)