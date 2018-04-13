/**
 * Created by ASUS on 2018/4/13.
 */
/**
 * Created by Jepson on 2018/4/12.
 */
$(function() {
    function render() {
        $('.totalPrice').text( "00.00" );
        setTimeout( function() {
            $.ajax({
                url: "/cart/queryCart",
                type: "get",
                success: function( info ) {
                    $('#productList').html( template( "productTpl", { list: info } ) );
                    // 需要手动结束下拉刷新
                    mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                }
            });
        }, 500);
    }

    // 配置下拉刷新
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",
            down : {
                auto: true,
                callback : function() {
                    render();
                }
            }
        }
    });


    // 删除功能
    $('#productList').on("tap", ".btn_delete", function() {
        console.log( 111 );
        // 获取购物车 id
        var id = $(this).data("id");

        mui.confirm( "你是否要删除该商品", "温馨提示", ["确认", "取消"], function( e ) {

            if (e.index === 0) {

                // 发送删除 ajax 请求
                $.ajax({
                    url: "/cart/deleteCart",
                    type: "get",
                    data: {
                        // 需要注意这里 id 传的是一个数组
                        id: [ id ]
                    },
                    success: function( info ) {
                        if ( info.success ) {
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        }
                    }
                })
            }
        })

    });

    $('#productList').on("tap", ".btn_edit", function() {

        console.log( this.dataset )
        // 获取购物车 id
        var id = this.dataset.id;
        var htmlStr = template( "editTpl", this.dataset );

        // 在进行传入确认框时, 需要先将所有 \n 干掉
        htmlStr = htmlStr.replace( /\n/g, "" );

        // 弹出确认框
        mui.confirm( htmlStr, "编辑商品", ["确认", "取消"], function( e ) {

            if (e.index === 0) {
                // 点击了确认, 发送编辑商品 ajax 请求
                var size = $('.lt_size span.current').text();
                var num = $('.lt_num .mui-numbox-input').val();

                $.ajax({
                    url: "/cart/updateCart",
                    type: "post",
                    data: {
                        id: id,
                        size: size,
                        num: num
                    },
                    success: function( info ) {
                        console.log(info);
                        if ( info.success ) {
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        }
                    }
                })
            }
        });
        mui('.mui-numbox').numbox();
    });



    // 选择尺码, 注册委托事件
    $('body').on("tap", ".lt_size span", function() {
        $(this).addClass("current").siblings().removeClass("current");
    })

    $('#productList').on('change', ".ck", function() {
        console.log( $('.ck:checked') )

        var $checks = $('.ck:checked');

        var total = 0;

        // 遍历所有选中的 checkbox 进行计算价格
        $checks.each(function() {
            console.log( this );
            var price = $(this).data("price");
            var num = $(this).data("num");
            total += price * num;
        })

        total = total.toFixed( 2 );
        $('.totalPrice').text( total );
    })



})