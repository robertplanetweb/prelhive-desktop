import { shell } from 'electron';
import path from 'path';

let self = {
    async run() {
        let data = Invoke.all();
        shell.openPath(path.resolve(`${APP_PATH}${data}`));
    },
}

export default self;
