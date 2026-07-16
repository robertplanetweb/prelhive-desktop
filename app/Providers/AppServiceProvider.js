import { app } from 'electron';
import ContextMenu from '@radiantabyss/electron/src/ContextMenu.js';

function handleDevMode() {
    if ( IS_PACKAGED ) {
        return;
    }

    // Exit cleanly on request from parent process in development mode.
    if ( process.platform === 'win32' ) {
        process.on('message', data => {
            if ( data === 'graceful-exit' ) {
                if ( TRAY ) {
                    TRAY.destroy();
                }

                app.quit();
            }
        });
    }
    else {
        process.on('SIGTERM', () => {
            if ( TRAY ) {
                TRAY.destroy();
            }

            app.quit();
        });
    }
}

export default () => {
    handleDevMode();

    ContextMenu([]);
}
