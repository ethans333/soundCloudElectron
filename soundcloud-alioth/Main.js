const { app, BrowserWindow } = require('electron'),
    path = require('path'),
    puppeteer = require("puppeteer");

const createWindow = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "./Images/Alioth-Square.jpg",
        title: "Alioth",
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, './Scripts/Preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    win.loadFile('./HTML/Index.html');

    win.custom = {
        "browser" : browser,
        "page": page

    };
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

