import { shell } from 'electron';

let self = {
    run({ url }) {
        shell.openExternal(url);
    }
};

export default self;
