import { app, Tray, Menu } from 'electron';
import MainWindow from './../Windows/MainWindow.js';

let self = {
    create() {
        //check if tray is enabled
        if ( !Config.getKey('settings', 'has_tray') ) {
            return;
        }

        //check if tray already exists
        if ( TRAY ) {
            return;
        }

        let tray = new Tray(`${STATIC_PATH}/images/icon.ico`);
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show',
                checked: true,
                click: () => {
                    MainWindow.show();
                }
            },
            {
                label: 'Exit',
                click: () => {
                    self.destroy();
                    app.isQuiting = true;
                    app.quit();
                }
            }
        ]);

        tray.on('double-click', () => {
            MainWindow.show();
        });

        tray.setToolTip('CMDeck');
        tray.setContextMenu(contextMenu);

        TRAY = tray;
    },

    destroy() {
        //check if tray exists
        if ( !TRAY ) {
            return;
        }

        TRAY.destroy();
        TRAY = null;
    }
}

export default self;
