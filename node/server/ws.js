import chalk from 'chalk';
import WebSocket from 'ws';
export const HMR_HEADER = 'vite-hmr';


export function createWebSocketServer(server, config, httpsOptions) {
    let wss;
    let httpsServer = undefined;

    const hmr = isObject(config.server.hmr) && config.server.hmr;
    const wsServer = (hmr && hmr.server) || server
}