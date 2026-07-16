import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import { app } from 'electron';

//load support
import Config from './Support/Config.js';
import Globals from './Support/Globals.js';
import Helpers from './Support/Helpers.js';

export default async () => {
    //load env
    let __dirname = path.dirname(fileURLToPath(import.meta.url));
    let ENV = {
        ...dotenv.parse(await fs.readFile(`${__dirname}/../../.env`, 'utf-8')),
        ...dotenv.parse(await fs.readFile(`${__dirname}/../../.ra`, 'utf-8')),
    };
    for ( let key in ENV ) {
        if ( ENV[key] === 'true' ) {
            ENV[key] = true;
        }
        else if ( ENV[key] === 'false' ) {
            ENV[key] = false;
        }
    }

    //core globals
    let APP_PATH = app.getAppPath().replace(/\\/g, '/');
    if ( app.isPackaged ) {
        APP_PATH = APP_PATH.replace('/app.asar', '');
    }

    let IS_PACKAGED = app.isPackaged;
    let STATIC_PATH = IS_PACKAGED ? `${APP_PATH}/static` : `${APP_PATH}/${ENV.FRONT_PATH}/static`;

    global.ENV = ENV;
    global.APP_PATH = APP_PATH;
    global.STATIC_PATH = STATIC_PATH;
    global.IS_PACKAGED = IS_PACKAGED;

    //globals
    let globals = await Globals();
    for ( let key in globals ) {
        global[key] = globals[key];
    }

    //helpers
    for ( let key in Helpers ) {
        global[key] = Helpers[key];
    }

    global.Config = Config;
}
