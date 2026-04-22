const { app, globalShortcut, clipboard, nativeImage, ipcMain } = require('electron')
const { menubar } = require('menubar')
const path = require('path')
const fs = require('fs')
const os = require('os')

// must be called before app ready
app.whenReady().then(() => {
  // hide dock icon — only on macOS
  if (process.platform === 'darwin' && app.dock) {
    app.dock.hide()
  }
})

const mb = menubar({
  index: 'file://' + path.join(__dirname, 'index.html'),
  icon: path.join(__dirname, 'iconTemplate.png'),
  preloadWindow: true,
  showOnAllWorkspaces: true,
  activateWithApp: false,
  windowPosition: process.platform === 'darwin' ? 'topRight' : 'trayBottomCenter',
  browserWindow: {
    width: 420,
    height: 600,
    resizable: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  }
})

mb.on('ready', () => {

  // hide dock again after ready just to be sure
  if (process.platform === 'darwin' && app.dock) {
    app.dock.hide()
  }

  app.setLoginItemSettings({ openAtLogin: true })

  let windowLocked = false

  // clicking outside closes the popup (unless window is locked/pinned)
  mb.on('focus-lost', () => {
    if (!windowLocked) mb.hideWindow()
  })

  // after every show, ensure the window is on top and focused
  mb.on('after-show', () => {
    if (mb.window) {
      mb.window.setAlwaysOnTop(true, 'pop-up-menu', 1)
      mb.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
      mb.window.focus()
    }
  })

  // lock/unlock from renderer
  ipcMain.on('set-lock', (event, locked) => {
    windowLocked = locked
  })

  // global shortcut — toggle; always hides even if locked, then clears lock
  globalShortcut.register('Control+Space', () => {
    if (mb.window && mb.window.isVisible()) {
      windowLocked = false   // unlock when manually closing
      if (mb.window) mb.window.webContents.send('lock-reset')
      mb.hideWindow()
    } else {
      mb.showWindow()
      // ensure the window stays on top and gets focus
      if (mb.window) {
        mb.window.setAlwaysOnTop(true, 'pop-up-menu', 1)
        mb.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
        mb.window.focus()
        mb.window.webContents.focus()
      }
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
  
  ipcMain.on('quit-app', () => {
    app.quit()
  })

})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
