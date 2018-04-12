/**
 * Created by ASUS on 2018/4/12.
 */
$(function(){
    $.ajax({
        url: "/user/queryUserMessage",
        type:"get",
        success:function(info){
            if(info.error === 400){
                location.href = "login.html"
                return;
            }
            console.log(info);
            $('#userInfo').html(template("userTpl",info));
        }
    });

    $('logoutBtn').click(function(){
        $.ajax({
            url:"/user/logout",
            type:"get",
            success:function(info){
                if(info.success){}
                location.href = "login.html";
            }
        })
    })
})