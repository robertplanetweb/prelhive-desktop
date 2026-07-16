import { dialog, BrowserWindow } from 'electron';

let self = {
    async run(args, event) {
        let win = BrowserWindow.fromWebContents(event.sender);
        let response = await dialog.showOpenDialog(win, {
            properties: ['openDirectory'],
        });

        if ( response.canceled ) {
            return Response.success('');
        }

        return Response.success(response.filePaths[0]);
    },
}

export default self;
