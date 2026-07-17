'use strict'

import { app } from 'electron';
import LumiBootstrap from '@radiantabyss/electron/src/Bootstrap.js';
import Bootstrap from './Bootstrap.js';
import Protocol from './Modules/Protocol.js';

import DatabaseProvider from './Providers/DatabaseProvider.js';
import RouteServiceProvider from './Providers/RouteServiceProvider.js';
import AppServiceProvider from './Providers/AppServiceProvider.js';
import AppEventsServiceProvider from './Providers/AppEventsServiceProvider.js';

import { spawn } from 'child_process';
import path from 'path';

LumiBootstrap();
await Bootstrap();
await Protocol.register('app');

//ensure single instance
const gotTheLock = app.requestSingleInstanceLock();
if ( !gotTheLock ) {
    app.quit();
}

let nexuProcess = null;

app.whenReady().then(() => {
    const isPackaged = app.isPackaged;
    const resourcesPath = process.resourcesPath;
    
    // Determine the path to nexu based on whether app is packaged or in dev mode
    const nexuDir = isPackaged 
        ? path.join(resourcesPath, '..', 'nexu') // 'nexu' is copied to the root directory next to the executable
        : path.join(process.cwd(), '..', 'nexu');

    const javaPath = path.join(nexuDir, 'java', 'bin', 'javaw.exe');
    const nexuJarPath = path.join(nexuDir, 'nexu.jar');

    console.log('Starting NexU from:', nexuDir);

    try {
        nexuProcess = spawn(javaPath, [
            '-Djavafx.preloader=lu.nowina.nexu.NexUPreLoader',
            '-Dglass.accessible.force=false',
            '-jar',
            nexuJarPath
        ], {
            cwd: nexuDir,
            detached: true,
            stdio: 'ignore'
        });

        nexuProcess.unref(); // allow the process to run independently in the background
    } catch (e) {
        console.error('Failed to start NexU', e);
    }
});

app.on('will-quit', () => {
    if (nexuProcess) {
        try {
            process.kill(nexuProcess.pid);
        } catch (e) {
            console.error('Failed to kill NexU process', e);
        }
    }
});

await DatabaseProvider();
await RouteServiceProvider();
await AppServiceProvider();
await AppEventsServiceProvider();
