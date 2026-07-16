import { BrowserWindow, shell } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Protocol from './../Modules/Protocol.js';

let self = {
    create(url = '') {
        let options = self.getOptions();
        let win = new BrowserWindow(options);

        win.maximize();
        win.removeMenu();

        self.setUrl(win, url);
        self.registerEvents(win);

        global.MAIN_WINDOW = win;
    },

    getOptions() {
        return {
            show: false,
            width: 800,
            height: 600,
            backgroundColor: '#181425',
            icon: `${STATIC_PATH}/images/icon.png`,
            webPreferences: {
                preload: join(dirname(fileURLToPath(import.meta.url)), '/../preload.js'),
            },
        }
    },

    setUrl(win, url) {
        if ( IS_PACKAGED ) {
            Protocol.create();
            win.loadURL(`${Protocol.scheme}://index.html${url}`);
        }
        else {
            win.loadURL(`${ENV.FRONT_URL}${url}`);
        }

        if ( ENV.ENABLE_DEV_TOOLS ) {
            win.webContents.openDevTools();
        }
    },

    registerEvents(win) {
        win.once('ready-to-show', () => {
            win.show();
        });

        win.on('close', () => {
            global.MAIN_WINDOW = null;
        });

        win.webContents.session.webRequest.onHeadersReceived((d, c) => {
            if (d.responseHeaders['x-frame-options'] || d.responseHeaders['X-Frame-Options']) {
                delete d.responseHeaders['x-frame-options'];
                delete d.responseHeaders['X-Frame-Options'];
            }

            c({
                cancel: false,
                responseHeaders: d.responseHeaders
            });
        });

        win.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
            event.preventDefault();
            event.defaultPrevented = true;
            shell.openExternal(url);
        });
    },

    show() {
        MAIN_WINDOW ? MAIN_WINDOW.show() : self.create();
    },
};

export default self;
