$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    // 从layui获取form对象
    var form = layui.form;
    // form对象中的方法 自定义校验规则
    form.verify({
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            // value 形参拿到的是确认密码框中的值
            // 获取输入密码里面的值，与再次输入密码值相比较 若相等 则通过验证
            var pwd = $('#res_password').val();
            if (value !== pwd) {
                return '两次结果输入不一致'
            }
        },
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },
    });
    // 从layui获取layer对象
    var layer = layui.layer;
    // 监听表单提交事件  注册页面
    $('#form_reg').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        var data = {
            username: $('#pd').val(),
            password: $('#res_password').val()
        };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) return layer.msg(res.message);
            // console.log('注册成功，请登录');
            layer.msg('注册成功，请登录');
            // 手动调用 页面跳转至登录页面
            $('#link_login').click();
        })
    });

    // // 登录页面 发起post请求
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) return layer.msg("登陆失败");
                layer.msg('登录成功');
                //将登录成功的token保存在本地  作为后续登录权限
                localStorage.setItem('token', res.token);
                // 跳转到后台页面
                location.href = "/index.html"
            }
        });
    })




















})