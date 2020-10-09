$(function() {

    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);


    // 隐藏文件input框  模拟调用行为
    $('#btnChooseImage').on('click', function() {
        // 点击上传按键 手动调用文件上传
        $('#file').click();
    });

    // 为文件绑定change事件 拿到用户上传的图片并替换掉当前的图片
    $('#file').on('change', function(e) {
        var filelist = e.target.files;
        if (filelist.length === 0) return layer.msg('请上传图片')

        // 1. 拿到用户选择的文件
        var file = e.target.files[0];
        // 2.将文件转化为路径
        var newImgURL = URL.createObjectURL(file);
        //3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 给确定按钮添加点击事件
    $('#btnUpload').on('click', function() {
        // 1.拿到用户裁剪到的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        // 将头像上传到服务器
        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) return layer.msg('更换头像失败')
                layer.msg('更换头像成功')
                    // 上传头像成功回调之后 把服务器的数据渲染出来 完成头像上传
                window.parent.getUserInfo()
            }
        });
    })



})