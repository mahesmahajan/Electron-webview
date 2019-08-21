const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
var path = require('path');
var fs = require("fs");

// Menu (for standard keyboard shortcuts)
const {Menu} = require('electron');

const template = [
  {
    label: 'Edit',
    submenu: [
      
    ]
  },
  {
    label: 'View',
    submenu: [

    ]
  },
  {
    role: 'window',
    submenu: [
    ]
  }
];

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [

    ]
  });

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [

      ]
    }
  );

  // Window menu
  template[3].submenu = [
   
  ]
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let initPath;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  initPath = path.join(app.getPath('userData'), "init.json");
  var data;
  try {
    data = JSON.parse(fs.readFileSync(initPath, 'utf8'));
  }
  catch(e) {
  }

  mainWindow = new BrowserWindow((data && data.bounds) ? data.bounds : { width: 800, height: 453, icon: path.join(__dirname, 'assets/icons/png/64x64.png'), frame: false });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  // Display Dev Tools by default
  mainWindow.openDevTools();
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  var data = {
    bounds: mainWindow.getBounds()
  };
  fs.writeFileSync(initPath, JSON.stringify(data));
  app.quit();
});
