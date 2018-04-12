/**
 * Created by ASUS on 2018/4/12.
 */
$(function(){
    $('#btnLogin').click(function(){
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();

        if( !username){
            mui.toast("请输入用户名");
            return;
        }
        if( !password){
            mui.toast("请输入密码");
            return;
        }

        $.ajax({
            url:"/user/login",
            type:"post",
            data:{
                username:username,
                password:password
            },
            success:function(info){
                console.log(info);
                if(info.error){
                    mui.toast("用户或者密码错误");
                }

                if(info.success){
                    if(location.search.indexOf("retUrl") !==-1){}
                    location.href = location.search.replace("?retUrl=","");
                }
                else{
                    location.href="user.html"
                }
            }
        })
    })
})




