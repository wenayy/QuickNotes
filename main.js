const { app, globalShortcut, clipboard, nativeImage, ipcMain } = require('electron')
const { menubar } = require('menubar')
const path = require('path')
const fs = require('fs')
const os = require('os')

// must be called before app ready
app.whenReady().then(() => {
  // hide dock icon — this is a menu bar only app
  if (app.dock) app.dock.hide()
})

const mb = menubar({
  index: 'file://' + path.join(__dirname, 'index.html'),
  icon: path.join(__dirname, 'iconTemplate.png'),
  preloadWindow: true,
  showOnAllWorkspaces: true,
  activateWithApp: false,
  windowPosition: 'topRight',
  browserWindow: {
    width: 420,
    height: 600,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  }
})

mb.on('ready', () => {

  // hide dock again after ready just to be sure
  if (app.dock) app.dock.hide()

  app.setLoginItemSettings({ openAtLogin: true })

  // clicking outside closes the popup
  mb.on('focus-lost', () => {
    mb.hideWindow()
  })

  // global shortcut — works from any app including Chrome
  globalShortcut.register('Control+Space', () => {
    if (mb.window && mb.window.isVisible()) {
      mb.hideWindow()
    } else {
      mb.showWindow()
    }
  })

  ipcMain.on('copy-image', (event, dataUrl) => {
    const image = nativeImage.createFromDataURL(dataUrl)
    clipboard.writeImage(image)
  })

  ipcMain.on('copy-files', (event, files) => {
    // files: [{ name: '...', dataUrl: '...' }]
    const tmpDir = path.join(os.tmpdir(), 'quicknotes_copy_' + Date.now())
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    
    const paths = files.map(f => {
      const filePath = path.join(tmpDir, f.name.replace(/[^a-z0-9._-]/gi, '_'))
      const data = f.dataUrl.split(',')[1]
      fs.writeFileSync(filePath, Buffer.from(data, 'base64'))
      return filePath
    })
    
    clipboard.write({ filenames: paths })
  })

  ipcMain.on('resize', (event, height) => {
    if (mb.window) {
      const capped = Math.min(Math.max(height, 200), 600)
      const [w] = mb.window.getSize()
      mb.window.setSize(w, capped, true)
    }
  })

  ipcMain.on('hide-window', () => {
    mb.hideWindow()
  })

})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
