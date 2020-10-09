$(function() {
    // layui的内置对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) return '用户昵称必须在1-6位之间'
        }
    });
    // 调用接口 初始化用户基本信息
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                // 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    };
    // 重置按钮添加点击事件
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        // 初始化用户信息即可
        initUserInfo()
    });

    // 提交修改用户信息 监听表单提交行为
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        // 获取修改后的数据
        let data = $(this).serialize();
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: data,
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取用户信息失败')
                layer.msg('更新用户信息成功');
                // 调用父页面中的方法 重新渲染用户名称
                window.parent.getUserInfo();
            }
        });

    })

})