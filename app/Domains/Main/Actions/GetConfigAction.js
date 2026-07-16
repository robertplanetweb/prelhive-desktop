let self = {
    async run() {
        return Response.success(Config.get('settings'));
    },
}

export default self;
