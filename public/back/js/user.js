/**
 * Created by ASUS on 2018/4/7.
 */
$(function(){
    var currentPage = 1;
    var pageSize = 5;
    render();

    function render(){
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(info){
                console.log(info);

                var htmlStr = template("tpl",info);
                $('.lt_content tbody').html(htmlStr);

                // 配置分页
                $('#paginator').bootstrapPaginator({
                    // 指定bootstrap版本
                    bootstrapMajorVersion:3,
                    //当前页
                    currentPage:info.page,
                    // 总页数
                    totalPages:Math.ceil(info.total / info.size),

                    // 当页面被点击时触发
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                });
            }
        });
    }

    //通过事件委托给 按钮注册点击事件
    $('.lt_content tbody').on("click",".btn",function(){
        console.log("哈哈");
        // 弹出模态框
        $('#userModal').modal("show");

        // 用户 id
        var id = $(this).parent().data("id");
        var isDelete = $(this).hasClass("btn-success") ? 1 :0;
        console.log(id);
        console.log(isDelete);

        $('#submitBtn').off("click").on("click",function(){
            $.ajax({
                type:"post",
                url:"/user/updateUser",
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success:function(info){
                    console.log(info);
                    if(info.success){
                        // 关闭模态框
                        $('#userModal').modal("hide");
                        //重新渲染
                        render();
                    }
                }
            })
        })
    })
})






