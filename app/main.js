'use strict'

import { app } from 'electron';
import LumiBootstrap from '@radiantabyss/electron/src/Bootstrap.js';
import Bootstrap from './Bootstrap.js';
import Protocol from './Modules/Protocol.js';

import DatabaseProvider from './Providers/DatabaseProvider.js';
import RouteServiceProvider from './Providers/RouteServiceProvider.js';
import AppServiceProvider from './Providers/AppServiceProvider.js';
import AppEventsServiceProvider from './Providers/AppEventsServiceProvider.js';

LumiBootstrap();
await Bootstrap();
await Protocol.register('app');

//ensure single instance
const gotTheLock = app.requestSingleInstanceLock();
if ( !gotTheLock ) {
    app.quit();
}

await DatabaseProvider();
await RouteServiceProvider();
await AppServiceProvider();
await AppEventsServiceProvider();
