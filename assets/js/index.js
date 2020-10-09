$(function() {

    getUserInfo();
    // 实现退出功能
    var layer = layui.layer;
    $('.btnout').on('click', function() {
        layer.confirm('确认要退出吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 页面跳转 然后清空本地存储的数据
            localStorage.removeItem('token');
            location.href = '/login.html'
            layer.close(index);
        });
    })

});
// 封装函数 发起获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        // headers请求头配置对象
        // headers: { Authorization: localStorage.getItem('token') || '' },
        success: function(res) {
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败！')
                //    接收回调之后的值  判断用户头像是否为空
            renderAvatar(res.data);
            // console.log(res.data);

        },
        // 无论成功与失败 都会调用这个函数 写到全局
        // complete: function(res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空token 同时强制跳转到登录页面
        //         location.href = '/login.html';
        //         localStorage.removeItem('token')
        //     }
        // }
    })
};

// 封装函数 渲染用户头像
function renderAvatar(user) {
    // 设置内容 利用逻辑中断 
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎' + name);

    // 判断服务器里是否有头像 如果有 则显示出来 同时让a隐藏
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        $('.text-avatar').html(name[0].toUpperCase()).show();
    };

}