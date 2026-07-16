import PatchConfigTransformer from './../Transformers/PatchConfigTransformer.js';

let self = {
    async run() {
        let data = Invoke.all();
        data = PatchConfigTransformer.run(data);

        Config.set('settings', {
            ...Config.get('settings'),
            ...data,
        });
    },
}

export default self;
