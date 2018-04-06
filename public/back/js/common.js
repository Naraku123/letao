/**
 * Created by ASUS on 2018/4/6.
 */
NProgress.configure({ showSpinner: false });

// ajaxStart 所有的 ajax 开始调用
$(document).ajaxStart(function(){
    NProgress.start();
});

// ajaxStop 所有的 ajax 结束调用
$(document).ajaxStop(function(){
    setTimeout(function(){
        NProgress.done();
    },500);
});

$(function(){
    // 1. 二级分类切换功能
    $('.category').click(function(){
        $(this).next().stop().slideToggle();
    });

    // 2. 顶部菜单栏切换显示功能
    $('.icon_menu').click(function(){
        $('.lt_aside').toggleClass("hidemenu");
        $('.lt_main').toggleClass("hidemenu");
        $('.lt_topbar').toggleClass("hidemenu");
    });

    // 3. 点击退出图标显示退出模态框
    $('.icon_logout').click(function(){
        $('#logoutModal').modal("show");
    })

    // 4. 在外面注册 logoutBtn 退出按钮, 点击事假
   $('#logoutBtn').click(function(){
       console.log("hh");

       // 访问退出接口, 进行退出
       $.ajax({
           url:"/employee/employeeLogout",
           type:"GET",
           dataType:"json",
           success:function(info){
               if(info.success){
                   location.href = "login.html"
               }
           }
       })
   })

})







