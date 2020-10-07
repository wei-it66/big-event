$.ajaxPrefilter(function(options) {
    console.log(options);
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    // 设置有权限的请求头部
    // indexof()没有值得时候返回-1
    if (options.url.indexOf(/my/) !== -1) {
        options.headers = { Authorization: localStorage.getItem('token') || '' }
    }

    // 全局挂在complete函数 
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            location.href = '/login.html';
            localStorage.removeItem('token')
        }
    }






})