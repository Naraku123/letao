/**
 * Created by ASUS on 2018/4/10.
 */
/**
 * Created by Jepson on 2018/4/10.
 */
$(function() {
    function render() {
        $('.lt_product').html('<div class="loading"></div>');

        var obj = {};
        obj.proName = $('.lt_search input').val();
        obj.page = 1;
        obj.pageSize = 100;

        // 加上我们一些可传可不传的参数处理
        var $current = $('.lt_sort .current');
        if ( $current.length > 0 ) {
            console.log(111);
            var sortName = $current.data("type");
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            obj[ sortName ] = sortValue;
        }

        setTimeout(function() {
            $.ajax({
                url: "/product/queryProduct",
                type: "get",
                data: obj,
                success: function( info ) {
                    $('.lt_product').html( template( "productTpl", info ) )
                }
            })
        }, 500)
    }

    // 功能1: 页面一进来, 需要渲染一次, proName 来自于 input 框
    var key = getSearch( "key" );
    $('.lt_search input').val(key);
    render();


    // 功能2: 点击搜索按钮, 需要渲染一次, 用户修改了proName
    $('.lt_search button').click(function() {
        render();

        var key = $('.lt_search input').val();
        var history = localStorage.getItem("search_list") || "[]";
        var arr = JSON.parse( history );
        var index = arr.indexOf( key );
        if ( index !== -1 ) {
            arr.splice( index, 1 );
        }
        if ( arr.length >= 10 ) {
            arr.pop();
        }
        arr.unshift( key );
        localStorage.setItem( "search_list", JSON.stringify(arr) );
    })


    // 功能3: 点击排序的时候, 需要渲染一次(传递更多的参数)
    $('.lt_sort a[data-type]').click(function() {
        if ( $(this).hasClass( "current") ) {
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        } else {
            $(this).addClass("current").siblings().removeClass("current");
            $(".lt_sort a i").removeClass("fa-angle-up").addClass("fa-angle-down");
        }
        render();
    })
})
