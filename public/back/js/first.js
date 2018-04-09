/**
 * Created by ASUS on 2018/4/7.
 */
$(function(){
    var currentPage = 1;
    var pageSize = 5;
    render();

    function render(){
        $.ajax({
            url:"/category/queryTopCategoryPaging",
            type:"get",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(info){
                console.log(info);
                var htmlStr = template("userTpl",info);
                $('.lt_content tbody').html(htmlStr);

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage: info.page,
                    totalPages: Math.ceil( info.total / info.size ),
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }

                })
            }
        })
    }

    //点击添加分类按钮, 显示添加模态框
    $('#addBtn').click(function(){
        $('#addModal').modal("show");
    })

    //通过校验插件, 添加校验功能
    $("#form").bootstrapValidator({
        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 校验的字段
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message: "请输入一级分类名称"
                    }
                }
            }
        }

    });

    //注册表单校验成功事件
    $('#form').on("success.form.bv",function(e){
        e.preventDefault();
        $.ajax({
            url: "/category/addTopCategory",
            type:"POST",
            data:$('#form').serialize(),
            success:function(info){
                console.log(info);
                if(info.success){
                    $('#addModal').modal("hide");
                    currentPage = 1;
                    render();

                    $('#form').data("bootstrapValidator").resetForm(true);
                }
            }
        })
    })

});