const {Readable} = require('stream');

async function readbody(stream) {
    if (stream instanceof Readable) {
        return new Promise((resolve, reject) => {
            let res = '';
            stream.on('data', (data) => res += data);
            stream.on('end', () => resolve(res));
            stream.on('error', (e) => reject(e));
        });
    }
    else {
        return stream.toString();
    }
}