$(document).on("pageInit", "#card-identification", function() {
    var cacheData = JSON.parse(App.Storage.get('USER')) || {};
    var bankData = null;
    //模型层
    var CardModel = Backbone.Model.extend({
        defaults: {
            name: cacheData['name'] || '',
            idcard: cacheData['idNo'] || ''
        }
    });
    //视图层
    var CardView = Backbone.View.extend({
            el: '.card-identify',
            template: _.template($("#card-identify").html()),
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        })
        //初始化
    var app = new CardView({ model: new CardModel }).render();

    var cardNum = $(".card-num"),
        agreeService = $(".agree-ipt"),
        agreeCheck = $("#agree-ipt"),
        reg = /^\d{10,22}$/,
        cardVerify = false,
        agreeVerify = true;

    function verifyCard() {
        //卡号验证
        if (!cardNum.val()) {} else {
            if (!reg.test(cardNum.val())) {
                capion("error", "银行卡号输入错误！");
                cardVerify = false;
            } else {
                cardVerify = true;
            }
        }

        if (cardVerify && agreeVerify) {
            return true;
        } else {
            return false;
        }
    }

    agreeCheck.off("click");
    agreeCheck.on("click", function() {
        if (!$(this).is(":checked") == true) {
            agreeVerify = false;
        } else {
            agreeVerify = true;
        }
        inputVerify($("#card-identification"), $(this));
    });
    $("input").on("input propertychange", function() {
        inputVerify($("#card-identification"), agreeCheck);
    });

    $("#card-identification .card-next").off("click");
    $("#card-identification .card-next").on("click", function() {
        if (verifyCard()) {
            var service = new Service(PORTAL_CONFIG.API_META + "/bank/cardbin/" + cardNum.val());
            service.ajax("GET", {})
                .done(function(res) {
                    if (res.code == 200) {
                        if (res.data.cardType != "1") {
                            capion('error', '请使用储蓄卡！');
                            return false;
                        }
                        var available = _hcqApp.global.verifyBank(res.data.bankCode);
                        if (!available) {
                            capion('error', '暂不支持' + (res.data.bankName || '该银行') + '，请更换银行卡！');
                            return false;
                        }
                        bankData = res.data;
                        $.router.load("#carddetail-ctt", true);
                    } else {
                        capion('error', res.msg || '获取银行卡信息失败，请稍后再试！');
                    }
                });
        };
    });

    //绑定银行卡
    $(document).on("pageInit", "#carddetail-ctt", function() {

        var phoneNum = $(".phone-num"),
            verify = $(".verify"),
            bindCardCode = $("#carddetail-ctt .send-code"),
            reg = /^1[34578]\d{9}$/,
            phoneVerify = false,
            verifyVerify = false,
            agreeVerify = true;

        //模型层
        var IdentifyModel = Backbone.Model.extend({
                defaults: {
                    name: cacheData['name'],
                    idcard: cacheData['idNo'],
                    bankIcon: "default-grey",
                    bankName: "",
                    bankNum: cardNum.val().substr(cardNum.val().length - 4, 4)
                }
            })
            //视图层
        var IdentifyView = Backbone.View.extend({
            el: '.bank-identify',
            template: _.template($("#identify-message").html()),
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            initialize: function() {
                phoneNum.val(cacheData["mobile"] || '');
                this.reloadData();
                this.listenTo(this.model, 'change', function() {
                    this.render();
                })
            },
            reloadData: function() {
                this.setData({
                    bankIcon: bankData.bankCode,
                    bankName: bankData.bankName,
                    bankNum: cardNum.val().substr(cardNum.val().length - 4, 4)
                });
            },
            setData: function(data) {
                this.model.set(data);
            }
        })
        var app = new IdentifyView({ model: new IdentifyModel() }).render();

        function verifyBuy() {
            //手机号验证
            if (!phoneNum.val()) {
                phoneVerify = false;
            } else {
                if (!reg.test(phoneNum.val())) {
                    capion("error", "手机号格式不正确");
                    phoneVerify = false;
                } else {
                    phoneVerify = true;
                    if (!verify.val()) {
                        verifyVerify = false;
                    } else {
                        verifyVerify = true;
                    }
                }
            }
            if (phoneVerify && verifyVerify) {
                return true;
            } else {
                return false;
            }
        }
        verifyBuy();
        bindCardCode.off("click");
        bindCardCode.on("click", function() {
            if (phoneVerify) {
                //调用发送验证码接口
                var service = new Service(PORTAL_CONFIG.API_XJG + "/sms/BINDBANK/" + phoneNum.val());
                service.ajax("POST", {})
                    .done(function(res) {
                        if (res.code == 200) {
                            timer(60, bindCardCode);
                        } else {
                            capion("error", res.msg);
                        }
                    });

            }
        });
        $("input").on("input propertychange", function() {
            inputVerify($("#carddetail-ctt"));
        })
        $("#carddetail-ctt .send-pwd").off("click");
        $("#carddetail-ctt .send-pwd").on("click", function() {
            if (verifyBuy()) {
                var service = new Service(PORTAL_CONFIG.API_XJG + "/perfect/bindBankCard");
                //var service = new Service("http://172.21.20.20:8083/perfect/bindBankCard");
                service.ajax("POST", JSON.stringify({
                        mobile: phoneNum.val(),
                        smsCode: verify.val(),
                        bankAccount: cardNum.val(),
                        cardHolder: cacheData['name']
                    }))
                    .done(function(res) {
                        if (res.code == 200) {
                            if (App.Storage.get("invest") && (App.Storage.get("invest") == '1')||App.Storage.get("invest") == '2') {
                                $.router.load("#card-bind", true);
                            } else {
                                $.router.load("cardDetail.html", true);
                            }

                        } else {
                            capion("error", res.msg);
                        }
                    });
            }
        });
    });
});

$(document).on("pageInit", "#card-bind", function() {
    var time = new Date().Format("yyyy-MM-dd");
    $(".identify-time span").html(time);
    $("#card-bind .succeed").off("click");
    $("#card-bind .succeed").on("click", function() {
        $.router.load("invest.html", true);
    })
});
