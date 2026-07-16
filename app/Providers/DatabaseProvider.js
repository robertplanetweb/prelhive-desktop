import fs from 'fs-extra';
import { Sequelize, DataTypes } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import Model from '@radiantabyss/electron/src/Model.js';

export default async () => {
    //init connection
    let connection = JSON.parse(await fs.readFile(`${APP_PATH}/database/connection.json`, 'utf-8'));
    connection.production.storage = connection.production.storage.replace('{APP_PATH}', APP_PATH);
    
    let sequelize = new Sequelize(connection.production);

    //run migrations
    const umzug = new Umzug({
        migrations: {
            glob: `${APP_PATH}/database/migrations/*.js`,
        },
        context: { sequelize, DataTypes },
        storage: new SequelizeStorage({ sequelize }),
        logger: console,
    });

    try {
        await umzug.up();
    }
    catch (e) {
        custom_logger(e);
    }

    //set globally
    global.SEQUELIZE = sequelize;

    //load models
    global.Model = await Model();
}
