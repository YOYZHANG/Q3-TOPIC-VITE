// 专门用于处理静态资源
const static = require('koa-static');
const path = require('path');
module.exports = function(ctx) {
    const {root, app} = ctx;
    app.use(static(root));
    app.use(static(path.resolve(root, 'public')));
}