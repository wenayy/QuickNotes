const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  copyImage: (dataUrl) => ipcRenderer.send('copy-image', dataUrl),
  copyFiles: (files)   => ipcRenderer.send('copy-files', files),
  resize:    (height)  => ipcRenderer.send('resize', height),
  hide:      ()        => ipcRenderer.send('hide-window')
})
