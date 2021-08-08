// 1.创建一个websocket服务端
// 2.创建一个ws client 文件，并在html引出，加载 ws client文件
// 3.服务端监听文件变化，发送websocket消息，告诉客户端变化类型，变化文件
// 4.客户端接收到消息，根据消息内容决定重新刷新页面还是
// 重新加载变化文件，并执行相关文件注入ws client时设置的hmr hook 函数

module.exports.hmrPath = '/vite/hmr';

module.exports = function() {
    app.use((ctx, next) => {
        
    })
}