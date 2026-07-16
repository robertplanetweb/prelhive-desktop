import { BrowserWindow } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Protocol from './../Modules/Protocol.js';
import MainWindow from './MainWindow.js';

let self = {
    create() {
        if ( ENV.SKIP_UPDATE ) {
            return MainWindow.create();
        }

        let win = new BrowserWindow({
            show: false,
            width: 440,
            height: 220,
            center: true,
            resizable: false,
            minimizable: false,
            maximizable: false,
            frame: false,
            webPreferences: {
                preload: join(dirname(fileURLToPath(import.meta.url)), '/../preload.js'),
            },
            backgroundColor: '#181425',
        });

        self.setUrl(win);
        self.registerEvents(win);

        global.UPDATE_WINDOW = win;
    },

    //private
    setUrl(win) {
        if ( IS_PACKAGED ) {
            Protocol.create();
            win.loadURL('app://./update.html')
        }
        else {
            win.loadURL(ENV.FRONT_URL);
        }

        if ( ENV.ENABLE_DEV_TOOLS ) {
            win.webContents.openDevTools();
        }
    },

    //private
    registerEvents(win) {
        win.once('ready-to-show', () => {
            win.show();
        });

        win.on('close', () => {
            MainWindow.create();
            global.UPDATE_WINDOW = null;
        });
    },
};

export default self;
