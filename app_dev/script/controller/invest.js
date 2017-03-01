$(document).on("pageInit", "#invest-ctt", function() {
    var cacheData = App.Storage.get("USER"),
        bankNum = null;
    //模型层
    var InvestModel = Backbone.Model.extend({
        defaults: {
            bankCode: "default-grey",
            bankName: "",
            bankAccount: ""
        }
    });
    //视图层
    var InvestView = Backbone.View.extend({
        el: ".card-message",
        template: _.template($('#card-message').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        initialize: function() {
            this.listenTo(this.model, "change", function() {
                this.render();
            });
            this.reloadData();
            this.initView();
        },
        reloadData: function() {
            var self = this;
            var service = new Service(PORTAL_CONFIG.API_XJG + '/investorBank');
            service.ajax('GET', {})
                .done(function(res) {
                    if (res.code == 200) {
                        bankNum = res.data.bankAccount;
                        res.data.bankAccount = '尾号' + bankNum.substr(bankNum.length - 4, 4) + '储蓄卡';
                        self.setData(res.data);
                    } else {
                        capion("error", res.msg);
                    }
                });
        },
        setData: function(data) {
            this.model.set(data);
        },
        initView: function() {
            $('#invest-ctt .invest-describe').text(PORTAL_CONFIG.INVESTMENT_MIN + '元起投，无上限');
        }
    })
    var app = new InvestView({ model: new InvestModel }).render();

    //输入框验证
    var investNum = $("#invest-ctt .invest-num"),
        preProfit = $("#invest-ctt .pre-profit"),
        totalAmount = $('#invest-ctt .total-amount'),
        serviceFee = $('#invest-ctt .investment-fee'),
        calProfit = 0,
        phoneNum = $("#invest-ctt .phone-num"),
        verify = $("#invest-ctt .verify"),
        sendCode = $("#invest-ctt .send-code"),
        regP = /^1[34578]\d{9}$/,
        investVerify = false,
        phoneVerify = false,
        verifyVerify = false;

    function verifyInvest() {
        //投资金额验证手机号验证码校验
        if (!investNum.val()) {
            investVerify = false;
            preProfit.text("0.00");
        } else {
            if (investNum.val() < PORTAL_CONFIG.INVESTMENT_MIN) {
                preProfit.text("0.00");
                capion("error", "最低投资金额" + PORTAL_CONFIG.INVESTMENT_MIN + '元！');
                investVerify = false;
            } else {
                calProfit = 0.038 * investNum.val();
                preProfit.text(calProfit.toFixed(2));
                investVerify = true;
            }
        }
        //手机号验证码投资金额验证
        //只校验投资金额
        if (verify.val()) {
            verifyVerify = false;
        } else {
            verifyVerify = true;
        }
        //只验证投资金额
        if (investVerify) {
            return true;
        } else {
            return false;
        }
    }
    //input输入判定下一步按钮是否可点
    $("#invest-ctt input").on("input propertychange", function() {
        inputVerify($("#invest-ctt"));
    });

    //input失去焦点时进行前端验证
    $("#invest-ctt .invest-num").off("blur");
    $("#invest-ctt .invest-num").on("blur", function() {
        var isVerified = verifyInvest();
        if (isVerified) {
            var feeService = new Service(PORTAL_CONFIG.API_RECHARGE + "/recharge/withhold/serviceFee/" + investNum.val());
            feeService.ajax('GET')
                .done(function(res) {
                    if (res.code == 200 && res.data) {
                        var fee = res.data;
                        var total = parseFloat(investNum.val()) + fee;
                        serviceFee.text(fee.toFixed(2));
                        totalAmount.text(total.toFixed(2));
                    }
                });
        }
    });

    //点击下一步，投资金额正确，跳到输入资金密码页面
    $("#invest-ctt .card-next").off("click");
    $("#invest-ctt .card-next").on("click", function() {
        if (verifyInvest()) {
            //都成功后跳转
            $.router.load("#iptpwd-ctt", true);
        }
    });

    //输入资金密码
    $(document).on("pageInit", "#iptpwd-ctt", function() {
        var pswd = $(".verify-ipt"),
            pswdVerify = false;
        //input输入判定下一步按钮是否可点
        pswd.on("input propertychange", function() {
            if (!$(this).val()) {
                pswdVerify = false;
                $("#iptpwd-ctt .big-btn").attr("disabled", true);
            } else {
                pswdVerify = true;
                $("#iptpwd-ctt .big-btn").attr("disabled", null);
            }
        });
        $("#iptpwd-ctt .pwd-verify").off("click");
        $("#iptpwd-ctt .pwd-verify").on("click", function() {
            //调用投资，正确跳到投资成功页，否则提示错误
            if (!pswdVerify) {
                return false;
            } else {
                var service = new Service(PORTAL_CONFIG.API_RECHARGE + "/recharge/withhold");
                //var service = new Service("http://172.21.20.15:8089/recharge/withhold");
                service.ajax("POST", JSON.stringify({
                        "amount": (parseFloat(investNum.val()) + parseFloat(serviceFee.text())).toFixed(),
                        "bankAccount": bankNum,
                        "paymentChannel": "IBOXPAY",
                        "paymentType": "WH",
                        "salesId": 1,
                        "rechargeChannel": 3,
                        "fundPassword": pswd.val()
                    }))
                    .done(function(res) {
                        if (res.code == 200) {
                            var amount = investNum.val();
                            var date = res.data;
                            var url = 'investSucceed.html?amount=' + amount + '&date=' + date + '&v=' + Math.random();
                            $.router.load(url, true);
                        } else {
                            capion('error', res.msg || '申购失败，稍后再试');
                        }
                    });
            }
        });
    });
});


//投资成功页
$(document).on("pageInit", "#invest-succeed", function() {
    var d = new Date();
    var succeedModel = Backbone.Model.extend({
        defaults: function() {
            var today = d.Format('yyyy-MM-dd');
            var profitDate = $.Request('date');
            var profitDate = profitDate || '';
            var redeemDate = profitDate || '';
            var amount = $.Request('amount') || 0;
            var profit = 0.038 * parseFloat(amount);
            return {
                currentDate: today,
                profitDate: profitDate,
                redeemDate: redeemDate,
                amount: parseFloat(amount).toFixed(2),
                profit: profit.toFixed(2)
            }
        }
    })
    var succeedView = Backbone.View.extend({
        el: "#invest-success-content",
        template: _.template($("#subscribe-template").html()),
        render: function() {
            //this.$el.parent().html(this.$el);
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var app = new succeedView({ model: new succeedModel }).render();
    $("#invest-succeed .succeed").off("click");
    $("#invest-succeed .succeed").on("click", function() {
        $.router.load("home.html", true);
    })
})
