$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 定义函数 获取用户信息
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                // console.log(res);
                // layer.msg('获取文章分类列表成功');
                var HtmlStr = template("tpl-table", res);
                $('tbody').html(HtmlStr);
            }
        });
    };
    // 保存弹出层的索引
    var indexadd = null;
    // 给添加类别添加点击事件 弹出模态框
    $('#btnAddCate').on('click', function() {
        indexadd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
        });
    })

    // 利用事件委托形式  发起请求 新增文章分类 
    $('body').on('submit', "#form-add", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增文章分类失败')
                }
                layer.msg('新增文章分类成功');
                initArtCateList();
                // 关闭模态框
                layer.close(indexadd);
            }
        });
    })


    // 为编辑添加点击事件 弹出模态框
    var indexEdit = null;
    // // 利用事件委托形式 发起请求 编辑内容
    $('tbody').on('click', ".btn-edit", function() {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html(),
        });
        var id = $(this).attr('data-id')
            // console.log(id);
            //获取id 发起请求 快速赋值
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                // 为表单快速赋值 form表单需添加lay-filter="form-edit"
                form.val("form-edit", res.data);
            }
        });
    });


    // 利用事件委派方式 更新文章分类的方式
    $('body').on('submit', "#form-edit", function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('更新分类信息失败');
                //重新渲染一下数据
                initArtCateList();
                // 关闭模态框
                layer.close(indexEdit);
            }
        });
    })

    // 为删除按钮添加点击事件 弹出模态框
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) return layer.msg('删除数据失败');
                    // console.log(res);
                    // 删除数据后 重新调用一次数据
                    initArtCateList();
                }
            });
            layer.close(index);
        });

    })


























})