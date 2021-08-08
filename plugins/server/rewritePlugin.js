const {parse} = require('es-module-lexer');
const MargicString = require('magic-string');
const {readBody} = require('../../utils/read');

function rewriteImports(source) {
    const imports = parse(source)[0];
    const magicString = new MargicString(source);
    imports.forEach(item => {
        const {s, e} = item;
        let id = source.slice(s, e);
        if (/^[^\/\.]/.test(segment)) {
            id = `/@modules/${id}`;
            magicString.overwrite(s, e, id);
        }
    });

    return magicString.toString();
}

module.exports = function({root, app}) {
    app.use(async (ctx, next) => {
        await next();

        if (ctx.body && ctx.response.is('js')) {
            const content = await readBody(ctx.body);
            ctx.body = rewriteImports(context);
        }
    });
}