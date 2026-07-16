import { app, protocol } from 'electron';
import fs from 'fs-extra';

let self = {
    scheme: null,
    static_folders: [],

    async register(scheme) {
        self.scheme = scheme;

        protocol.registerSchemesAsPrivileged([{
            scheme,
            privileges: {
                secure: true,
                standard: true
            }
        }]);

        try {
            self.static_folders = await fs.readdir(`${STATIC_PATH}`);
        }
        catch(e) {
            self.static_folders = [];
        }
    },

    create() {
        protocol.registerFileProtocol(self.scheme, (request, callback) => {
            let url = request.url.replace(`${self.scheme}://`, ''); // Strip scheme
            if ( url != 'index.html/' ) {
                url = url.replace('index.html/', '');
            }

            let app_path = app.getAppPath().replace(/\\/g, '/');

            let path = `${app_path}/front/${decodeURIComponent(url)}`;
            if ( self.static_folders.includes(url.split('/')[0]) ) {
                path = `${STATIC_PATH}/${decodeURIComponent(url)}`;
            }
            else if ( !url.match(/assets/) ) {
                url = request.url.replace(`${self.scheme}://`, '')
                    .replace(/index\.html\/.*/, 'index.html/');
                path = `${app_path}/front/${decodeURIComponent(url)}`;
            }

            callback({ path });
        });
    },

}

export default self;
