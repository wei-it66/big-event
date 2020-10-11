$(function() {
    var layer = layui.layer;
    var form = layui.form;

    var laypage = layui.laypage;
    // 定义查询参数q
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' //文章的发布状态
    };

    // 定义时间过滤器函数
    template.defaults.imports.dataFormat = function(data) {
        var dt = new Date(data);
        var y = dt.getFullYear();
        var m = getZero(dt.getMonth() + 1);
        var d = getZero(dt.getDate());

        var yy = getZero(dt.getHours());
        var mm = getZero(dt.getMinutes());
        var dd = getZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + yy + ':' + mm + ':' + dd

    };
    // 定义补零函数
    function getZero(m) {
        return m = m > 9 ? m : '0' + m
    };

    initTable();
    // 获取列表数据
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取数据失败');
                console.log(res);
                var Htmlstr = template("tpl-cate", res);
                $('tbody').html(Htmlstr);
                // 调用渲染分页的方法 一共几条数据
                renderPage(res.total);
            }
        });

    };

    // 请求文件分类中下拉框的数据
    initCate()

    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) return layer.msg('获取数据失败');
                var Htmlstr1 = template("tpl-table", res);
                $('[name="cate_id"]').html(Htmlstr1);
                form.render();
            }
        });
    }

    // 监听表单提交事件 根据两个input里面的值 重新渲染数据
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name="cate_id"]').val();
        var state = $('[name="state"]').val();
        // 修改q里面的值 重新复制
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    });

    // 渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5],
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值给q 
                q.pagenum = obj.curr
                    // 把最新的条目数赋值给limit
                q.pagesize = obj.limit
                    // initTable(); 直接渲染页面会发生死循环
                if (!first) {
                    initTable();
                }
            }
        })
    };

    // 编辑功能省略

    // 删除功能
    $('tbody').on('click', '.btn-delete', function() {
        // 代表删除按钮的个数
        var len = $('.btn-delete').length;
        // 获取数据的id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！');
                    // 如果len的值等于1，证明删除完毕后，页面上就不会有数据了
                    if (len === 1) {
                        // 判断是不是第一页 如果是滴第一页 就不再向前进一页
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    // 重新获取页面数据
                    initTable();
                }
            })
            layer.close(index);
        });


    })
})