const {readBody} = require('../../utils/read');

module.exports = function({app, root}) {
    const hmrpath = '/vite/hmr';
    const inject = `
        <script type='module'>
            import "${hmrpath}";
            window.process = {
                env: {
                    NODE_ENV: 'development'
                }
            }
        </script>
    `

    app.use(async (ctx, next) => {
        await next();
        if (ctx.response.is('html')) {
            let html = await readBody(ctx.body);
            ctx.body = html.replace(/<head>/, `$&${inject}`)
        }
    })
}