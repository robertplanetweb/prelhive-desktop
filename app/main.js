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
    // Determine the path to nexu based on whether app is packaged or in dev mode
    // if 'nexu' is copied to the root directory next to the executable
    const nexu_dir = app.isPackaged ? path.join(process.resourcesPath, '..', 'nexu') : path.join(process.cwd(), '..', 'nexu');
    const java_path = path.join(nexu_dir, 'java', 'bin', 'javaw.exe');
    const nexu_jar_path = path.join(nexu_dir, 'nexu.jar');

    try {
        nexuProcess = spawn(java_path, [
            '-Djavafx.preloader=lu.nowina.nexu.NexUPreLoader',
            '-Dglass.accessible.force=false',
            '-jar',
            nexu_jar_path
        ], {
            cwd: nexu_dir,
            detached: true,
            stdio: 'ignore'
        });

        nexuProcess.unref(); // allow the process to run independently in the background
    }
    catch (e) {
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
