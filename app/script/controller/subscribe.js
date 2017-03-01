$(document).on('pageInit', '#subscribe-ctt', function() {
    $(".money-div").off("click");
    $(".money-div").on("click", function() {
        $(this).addClass("active").siblings().removeClass("active");
        $(this).parent().siblings().find(".money-div").removeClass("active")
    })
    var weekend = new Date().getDay();
    //申请购买
    $(".apply-buy").off("click");
    $(".apply-buy").on("click", function() {
        var money = $("input[class*='buy-amt']"),
            reg = /^\d{0,7}$/; //输入金额正则，后期按要求更改
        if ($("input[class='agreement-check']").is(":checked") != true) {
            capion("error", "请勾选同意申购条款后进行申请");
            return false;
        };
        if (!money.val()) {
            capion("error", "输入金额不可为空");
            return false;
        } else {
            if (!reg.test(money.val())) {
                capion("error", "单次最多可申购金额为100万元");
            } else {
                //是否设置密码接口,已设置跳输入资金密码，没设置跳设置资金密码
                if (true) {
                    $.router.load("iptPwd.html", true);
                } else {
                    $.router.load("setPwd.html", true);
                }
            }
        }
    });
    //停止购买
    $(".stop-wrap").off("click");
    $(".stop-wrap").on("click", function() {
        $.confirm('停止申购后，从明天开始将停止每日申购金额，总资产依然可以赚取收益，确认停止申购吗？', '<img src="../../img/stop-icon.png"/><span>停止申购</span>');

    })
})
