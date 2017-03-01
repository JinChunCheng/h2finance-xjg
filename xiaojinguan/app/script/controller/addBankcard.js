$(document).on('pageInit','#addBankcard-ctt',function(){

    //Â·ÓÉÉèÖÃ
    var AppRouter = Backbone.Router.extend({
        routers : {

        }
    })

    $(".sendCode").off("click");
    $(".sendCode").on("click",function(){
        //调用发送验证码接口，接口调用成功倒计时
        var userphone = $("#userphone");
        var password = $("#password");
        var vali = validatorFunc();
        var vali2 = validatorFunc();
    });
    $(".sendPwd").off("click");
    $(".sendPwd").on("click",function(){
        var pwd = $(".pwd"),
            confirmPwd = $(".confirm-pwd"),
            verify = $(".verify"),
            reg = /^[0-9A-Za-z]{6,12}$/,
            pwdVerify = false,
            confirmPwdVerify = false,
            verifyVerify = false;
        if (!pwd.val()) {
            capion("error","请输入资金密码");
        }else{
            if (!reg.test(pwd.val())) {
                capion("error","资金密码格式不正确");
            }else{
                pwdVerify = true;
            }
        };
        if (!confirmPwd.val()) {
            capion("error","请确认资金密码");
        }else{
            if (pwd.val() != confirmPwd.val()) {
                capion("error","确认密码与资金密码格式不一致");
            }else{
                confirmPwdVerify = true;
            }
        };
        if (!verify.val()) {
            capion("error","请输入验证码");
        }else{
            if (false) {//接口验证不通过
                capion("error","验证码不正确");
            }else{
                verifyVerify = true;
            }
        };
        if (pwdVerify&&confirmPwdVerify&&verifyVerify) {
            window.location.href = "iptPwd.html";

        };
    })

})

$(document).on("pageInit","#iptpwd-ctt",function(){
    $(".verifyIpt").on("input",function(){
        if (!$(this).val()) {
            $(".pwdVerify").attr("disabled",true);
        }else {
            $(".pwdVerify").attr("disabled",null);
        }

    })
    $(".pwdVerify").off("click");
    $(".pwdVerify").on("click",function(){
        if ($(this).attr("disabled") == "true") { return false;};
        if (true) {//验证码接口正确
            capion("success","申购完成");
        }else{
            capion("error","资金密码不正确");
            if (true) {//调用接口超过三次，弹窗
                capion("error","输入超过三次，请找回资金密码");
                window.location.href = "setPwd.html";

            };
        }

    })
});
