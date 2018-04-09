/**
 * Created by ASUS on 2018/4/9.
 */
$(function(){
    var currentPage = 1;
    var pageSize = 2;
    var picArr = [];
    render();

    function render(){
        $.ajax({
            url: "/product/queryProductDetailList",
            type:"get",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function(info){
                console.log(info);
                var htmlStr = template("productTpl",info);
                $('.lt_content tbody').html(htmlStr);

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:info.page,
                    totalPages: Math.ceil(  info.total / info.size ),
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    },
                    size:"normal",
                    itemTexts:function(type,page,current){
                        switch( type ) {
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "page":
                                return page;
                        }
                    },

                    // 配置提示框
                    tooltipTitles: function( type, page, current) {
                        switch( type ) {
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "page":
                                return "前往第" + page + "页";
                        }
                    },
                    // 使用 bootstrap 样式的提示框组件
                    useBootstrapTooltip: true
                })
            }
        })
    };

    // 2. 点击添加按钮, 显示添加模态框
   $('#addBtn').click(function(){
       $('#addModal').modal("show");

       // 发送 ajax 请求, 请求二级分类列表数据, 进行渲染下拉菜单
       $.ajax({
           url: "/category/querySecondCategoryPaging",
           type:"get",
           data:{
               page:1,
               pageSize:100
           },
           success:function(info){
               console.log(info);
               var htmlStr = template("dropdownTpl",info);
               $('.dropdown-menu').html(htmlStr);
           }
       })
   });

    //3. 注册事件委托, 给 a 注册点击事件
    $('.dropdown-menu').on("click","a",function(){
        console.log("哈哈");
        var txt = $(this).text();
        var id = $(this).data("id");
        $('#dropdownText').text(txt);
        $('[name="brandId"]').val(id);
    });


    //4. 配置上传图片回调函数
    $('#fileupload').fileupload({
        dataType:"json",
        done:function(e,data){
            console.log(data);
            var picObj = data.result;
            var picAddr = picObj.picAddr;

            picArr.unshift(picObj);
            $('#imgBox').prepend('<img src="'+ picAddr +'" width="100">');

            if(picArr.length > 3){
                picArr.pop();
                $("#imgBox img:last-of-type").remove();
            }

            if(picArr.length === 3 ){
                $('#form').data("bootstrapValidator").updateStatus("picStatus","VALID")
            }

        }
    });

    // 5. 配置表单校验
    $('#form').bootstrapValidator({
        excluded: [],

        // 配置图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        // 配置校验字段
        fields: {
            // 二级分类id, 归属品牌
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            // 商品名称
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            // 商品描述
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },

            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    //正则校验
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 32-40'
                    }
                }
            },
            // 商品价格
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品价格"
                    }
                }
            },
            // 商品原价
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            // 标记图片是否上传满三张
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请上传3张图片"
                    }
                }
            }
        }
    });

    // 6. 注册校验成功事件
    $("#form").on("success.form.bv", function( e ) {
        // 阻止默认的提交
        e.preventDefault();

        // 表单提交得到的参数字符串
        var params = $('#form').serialize();

        console.log(picArr);

        // 需要在参数的基础上拼接上这些参数
        // &picName1=xx&picAddr1=xx
        // &picName2=xx&picAddr2=xx
        // &picName3=xx&picAddr3=xx
        params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

        console.log(params);

        // 通过 ajax 进行添加请求
        $.ajax({
            url: "/product/addProduct",
            type: "post",
            data: params,
            success: function( info ) {
                console.log( info )
                if (info.success) {
                    // 关闭模态框
                    $('#addModal').modal("hide");
                    // 重置校验状态和文本内容
                    $('#form').data("bootstrapValidator").resetForm(true);
                    // 重新渲染第一页
                    currentPage = 1;
                    render();

                    // 手动重置, 下拉菜单
                    $('#dropdownText').text("请选择二级分类")

                    // 删除结构中的所有图片
                    $('#imgBox img').remove();
                    // 重置数组 picArr
                    picArr = [];

                }
            }
        })
    })

});