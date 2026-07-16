import createRouter from '@radiantabyss/electron/src/Routing/Router.js';

export default async () => {
    const { Router, RouteFiles } = await createRouter();

    //load routes
    for ( let Route of RouteFiles.routes ) {
        Router.addRoute(Route);
    }
}
