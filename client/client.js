// 建立连接
// 监听message

console.log('[vite] connecting')
const socketHost = `${location.hostname}:4000`
const socket = new WebSocket(`ws://${socketHost}`, 'vite-hmr');
const base = '/';
const cusotmListenersMap = new Map();
const hotModulesMap = new Map();

socket.addEventListener('message', async ({data}) => {
    console.log("mesaage from server");
    handleMessage(JSON.parse(data))
})

let isFirstUpdate = true;

async function handleMessage(payload) {
    switch(payload.type) {
        case 'connnect':
            console.log('[vite] connected');
            setInterval(() => socket.send('ping'), 1000);
            break;
        case 'update':
            notifyListeners('vite:beforeUpdate', payload);

            payload.updates.forEach(update => {
                if (update.type === 'js-update') {
                    queueupdate(fetchUpdate(update))
                }
            });
        
    }
}

function notifyListeners(event, data) {
    const cbs = cusotmListenersMap.get(event);
    if (cbs) {
        cbs.forEach(cb => cb(data));
    }
}
let queued = [];
let pending = false;


async function queueupdate(p) {
    queued.push(p);
    if (!pending) {
        pending = true;
        await Promise.resolve();
        pending = false;

        const loading = [...queued];
        (await Promise.all(loading)).forEach(fn => fn());
    }
}

async function fetchupdate({path, acceptedPath, timestamp}) {
    const mod = hotModulesMap.get(path);

    if (!mod) {
        return;
    }

    const moduleMap = new Map();
    const isSelfUpdate = path === acceptedPath;

    const modulesToUpdate = new Set();
    if (isSelfUpdate) {
        modulesToUpdate.add(path);
    }
    else {
        for (const {deps} of mod.callbacks) {
            deps.forEach(dep => {
                if (acceptedPath === dep) {
                    modulesToUpdate.add(dep);
                }
            });
        }
    }

    const qualifiedCallbacks = mod.callbacks.filter(({deps}) => {
        return deps.some(dep => {
            modulesToUpdate.has(dep);
        });
    });

    await Promise.all(Array.from(modulesToUpdate).map(async dep => {
        const [path, query] = dep.split('?');

        try {
            const newMod = await import(
                '/' + path.slice(1) + `?import&t=${timestamp}${query ? `&${query}` : ''}`
            )
            moduleMap.set(path, newMod);
        }
        catch (e) {

        }
    }));

    return () => {
        for (const {deps, fn} of qualifiedCallbacks) {
            fn(deps.map(dep => moduleMap.get(dep)));
        }
        const loggerPath = isSelfUpdate ? path : `${acceptedPath} via ${path}`;
        console.log(`[vite hot update]${loggerPath}`);
    }
}

export function createHotContext(ownerPath) {
    const mod = hotModulesMap.get(ownerPath);
    if (mod) {
        mod.callbacks = [];
    }

    function acceptDeps(deps, callback) {
        const mod = hotModulesMap.get(ownerPath) || {
            id: ownerPath,
            callbacks: []
        }
        mod.callbacks.push({
            deps,
            fn: callback
        });
        hotModulesMap.set(ownerPath, mod);
    }

    const hot = {
        accept(deps, callback) {
            if (typeof deps === 'function' || !deps) {
                acceptDeps([ownerPath], ([mod]) => {deps && deps(mod)});
            }
            else if (typeof deps === 'string') {
                acceptDeps([deps], ([mod]) => callback && callback(mod));
            }
            else if (Array.isArray(deps)) {
                acceptDeps(deps, callback);
            }
        }
    };
    return hot;
}
