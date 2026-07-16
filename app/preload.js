const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    IPC: {
        send: (channel, ...args) => ipcRenderer.send(channel, ...args),
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
        on: (channel, listener) => ipcRenderer.on(channel, listener),
        once: (channel, listener) => ipcRenderer.once(channel, listener),
    },
});

contextBridge.exposeInMainWorld('IS_ELECTRON', true);
contextBridge.exposeInMainWorld('IS_PANEL', process.argv.indexOf('--is-panel') > -1);
