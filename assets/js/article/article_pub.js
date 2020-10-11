$(function() {
    // 初始化富文本编辑器
    initEditor();
    var form = layui.form;
    var layer = layui.layer;
    getDate();
    // 获取数据列表
    function getDate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据列表失败');
                }
                // console.log(res);
                // 渲染模板引擎
                var htmlStr = template("tpl-cate", res);
                $('[name="cate_id"]').html(htmlStr);
                // 调用form.render()方法 把后来添加的section渲染出来
                form.render();
            }
        });



    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 图片上传区域 手动调用file点击事件
    $('#btnChooseImage').on('click', function() {
        $('#file').click();
    });
    // 监听文件框提交事件
    $('#file').on('change', function(e) {
        // 获取到文件的数据列表
        var files = e.target.files;
        if (files.length === 0) { return };
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 定义文章的发布状态
    var art_status = '已发布';
    // 为存为草稿状态，绑定点击事件
    $('#btnSave2').on('click', function() {
        art_status = '草稿';
    });

    // 为表单添加submit提交事件
    $('#form-pub').on('submit', function(e) {

        e.preventDefault();
        //1创建一个formdata对象 基于form表单
        var fd = new FormData($(this)[0]);
        // 2将文章的发布状态 存到fd中
        fd.append('state', art_status);
        // fd.forEach(function(v, k) {
        //     console.log(v, k);
        // });
        // 3.将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 4. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob);
                // fd.forEach(function(v, k) {
                //     console.log(v, k);
                // });
                // 5.发起ajax数据请求
                publish(fd);

            });

    });
    // 定义发布文章的方法
    function publish(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // formatedata格式的数据 必须添加两个属性
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取数据失败');
                layer.msg('发布文章成功！')
                    // 发布成功后 跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    };
})