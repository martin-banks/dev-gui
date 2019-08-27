// ! From Electron quickstart
// * https://github.com/electron/electron-quick-start/blob/master/main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron')
const path = require('path')
const { spawn, exec } = require('child_process')
const isDev = require('electron-is-dev')



function menuModel (fns) {
  return [
    {
      label: 'App',
      submenu: [
        {
          role: 'about'
        },
        {
          role: 'quit',
          label: 'Quit',
        },
      ]
    },
  
    {
      label: 'File',
      submenu: [
        // {
        //   label: 'Open Files',
        //   accelerator: 'CmdOrCtrl+O',
        //   click () {
        //     fns.openFile()
        //   },
        // },
        {
          label: 'Choose Folder',
          accelerator: 'CmdOrCtrl+Shift+O',
          click () {
            fns.openFolder()
          },
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://github.com/martin-banks/image-un-embiggener') }
        }
      ]
    }
  ]
}



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true,
      // preload: path.join(__dirname, 'preload.js'),
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  // mainWindow.loadURL('http://localhost:3000')
  mainWindow.loadURL(isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`
  )

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const menuTemplate = menuModel({ openFolder })
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// ! My app config
async function openFolder () {
  const folder = await dialog.showOpenDialogSync(mainWindow, {
    properties: ['openDirectory'],
  })[0]

  if (!folder) return
  console.log({ folder })

  mainWindow.webContents.send('chosen-folder', folder)
  mainWindow.webContents.send('status', 'Files found')
}

ipcMain.on('open-choose-folder', (e, content) => {
  openFolder()
})


ipcMain.on('cli-build-prod', (e, args) => {
  const { dir } = args
  console.log('Start dev request', dir)
  const reply = data => e.sender.send('devMessage', data)

  const options = {
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 200 * 1024,
    killSignal: 'SIGTERM',
    cwd: dir,
    env: null
  }

  const child = exec('npm run prod', options)
  child.stdout.on('data', response => {
    console.log('npm run start message', response)
    e.sender.send('status', response)
  })
  child.stderr.on('data', response => {
    console.log('npm run start error', response.toString())
    e.sender.send('processError', response)
  })
})
