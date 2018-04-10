/**
 * Created by Jepson on 2018/4/10.
 */

$(function() {
    render();
    function getHistory() {
        // 保证将来处理的一定是一个数组
        var history = localStorage.getItem( "search_list" ) || '[]';
        var arr = JSON.parse( history );
        return arr;
    }

    // 专门用于读取数组, 进行页面渲染
    function render() {
        var arr = getHistory();
        // 根据本地存储中的数组, 进行页面渲染
        $('.lt_history').html( template( "searchTpl", { arr: arr } ) )
    }


    // 功能2: 删除功能, 删除本地历史记录数组里面一项
    $('.lt_history').on( "click", ".btn_delete", function() {
        var that = this;

        mui.confirm("你确认要删除么?", "温馨提示", ["确认", "取消"], function( e ) {
            // 点击了确认按钮
            if (e.index === 0) {
                // 索引
                var index = $(that).data( "index" );
                console.log(index);
                // 获取数组
                var arr = getHistory();
                // 删除数组中对应索引的项
                arr.splice( index, 1 );
                // 修改 search_list
                localStorage.setItem( "search_list", JSON.stringify( arr ) );
                // 重新渲染
                render();
                console.log(arr);
            }
        })
    });


    // 功能3: 清空功能
    $('.lt_history').on("click", ".btn_empty", function() {
        mui.confirm("是否清空所有历史记录", "温馨提示", ["确认", "取消"], function( e ){
            console.log(e.index);
            if (e.index === 0) {
                localStorage.removeItem( "search_list" );
                render();
            }
        });
    });


    // 功能4: 添加功能
    $('.lt_search button').click( function() {
        // 获取搜索值
        var key = $('.lt_search input').val().trim();

        if ( key === "" ) {
            // 添加提示框
            mui.toast( "请输入搜索关键字" );
            return;
        }

        var arr = getHistory();
        if ( arr.indexOf( key ) !== -1 ) {
            var index = arr.indexOf( key );
            arr.splice( index, 1 );
        }

        // 超过 10 个删除最后一项
        if ( arr.length >= 10 ) {
            arr.pop();
        }


        // 添加到数组最前面
        arr.unshift( key );

        // 持久化到本地存储中
        localStorage.setItem( "search_list", JSON.stringify( arr ) );
        render();
        $('.lt_search input').val("");


        // 跳转到搜索列表页, 将搜索关键字传递到searchList.html
        location.href = "searchList.html?key=" + key;

    })


})
