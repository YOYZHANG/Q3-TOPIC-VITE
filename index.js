const koa  = require('koa');
const chokidar  = require('chokidar');
const staticPlugin = require('./plugins/server/serverStaticPlugin');
const rewritePlugin = require('./plugins/server/serverStaticPlugin');
const moduleResolvePlugin = require('./plugins/server//modResolvePlugin');
const htmlPlugin = require('./plugins/server/htmlPlugin');
module.exports = function createServer() {
    const app = new koa();
    const root = process.cwd();
    const watcher = chokidar.watch(root, {
        ignored: [/\bnode_modules\b/, /\b.git\b/]
    })
    const options = {
        root,
        app,
        watcher
    }

    const resolvedPlugins = [
        // htmlPlugin,
        // rewritePlugin,
        // moduleResolvePlugin,
        staticPlugin
    ];

    resolvedPlugins.forEach(fn => {
        fn(options);
    });

    watcher.on('change', async (file) => {
        await handleHMRUpdate(file, server);
    })

    const send = watcher.send = (payload) => {
        const stringified = JSON.stringify(payload);

        ws.clients.forEach(client => {
            if (client.readState === WebSocket.OPEN) {
        const stringified = JSON.stringify(payload);
                client.send(stringified);
            }
        })
    }

    const handleHMRUpdate = async (filePath, timestamp, content) {
        send({
            type: 'vue-renrender',
            path,
            changeSrcPath,
            timestamp
        })
    }

    return app;
}
