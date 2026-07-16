import Tray from './../../../Modules/Tray.js';

let self = {
    async run() {
        let data = Invoke.all();
        data.toggle == 1 ? Tray.create() : Tray.destroy();
        Config.setKey('settings', 'has_tray', data.toggle);
    },
}

export default self;
