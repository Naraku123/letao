/**
 * Created by Jepson on 2018/4/10.
 */
$(function() {
    var key = getSearch( "key" );
    $('.lt_search input').val( key );
    render();

    // 功能2: 点击搜索按钮, 实现搜索功能
    $('.lt_search button').click(function() {
        console.log(111);
        render();

        var key = $(".lt_search input").val();
        // 拿到数组
        var history = localStorage.getItem("search_list") || "[]";
        var arr = JSON.parse( history );
        var index = arr.indexOf( key )
        if ( index !== -1 ) {
            // 有重复项, 需要删除
            arr.splice( index, 1 );
        }
        // 长度不能超过 10
        if ( arr.length >= 10 ) {
            arr.pop();
        }
        // 将 key 添加到数组中
        arr.unshift( key );
        // 进行数据持久化, 保存到本地存储中
        localStorage.setItem( "search_list", JSON.stringify( arr ) );
    });

    // 功能3: 点击排序按钮, 进行排序
    $('.lt_sort a[data-type]').click(function() {
        if ( $(this).hasClass( "current" ) ) {
            $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
        } else {
            $(this).addClass("current").siblings().removeClass("current");
            // 让所有的元素 箭头重置成向下
            $('.lt_sort a').find("i").removeClass("fa-angle-up").addClass("fa-angle-down")
        }
        render();
    })

    function render() {
        $('.lt_product').html('<div class="loading"></div>');
        var params = {};
        params.proName = $('.lt_search input').val();
        params.page = 1;
        params.pageSize = 100;

        // 获取到有 current 类的元素
        var $current = $('.lt_sort .current');
        if ( $current.length > 0 ) {
            // 有高亮的元素, 需要排序
            var sortName = $current.data( "type" );   // price, num
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            params[ sortName ] = sortValue;
        }

        setTimeout(function() {
            $.ajax({
                url: "/product/queryProduct",
                type: "get",
                data: params,
                success: function( info ) {
                    console.log( info )
                    $('.lt_product').html( template( "productTpl", info ) )
                }
            })
        }, 500);
    }
})
