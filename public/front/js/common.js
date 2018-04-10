/**
 * Created by Jepson on 2018/4/9.
 */
$(function() {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
    });

    // 配置轮播图自动轮播
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 1000
    });
})

function getSearch( key ) {
    var search = location.search;
    // 解码成中文
    search = decodeURI( search );
    // 去掉 ?
    search = search.slice(1);
    // 切割成数组
    var arr = search.split( "&" );
    var obj = {};
    arr.forEach(function( element, index ) {
        var k = element.split("=")[0];
        var v = element.split("=")[1];
        obj[ k ] = v;
    });
    return obj[ key ];
}