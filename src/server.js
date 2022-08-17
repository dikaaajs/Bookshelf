const Hapi = require('@hapi/hapi');
const {routes} = require('./route');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: { origin: ['*'], },
        },
    });

    server.route(routes);

    await server.start();
    console.log('server telah berjalan di ', server.info.uri);
}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})

init();