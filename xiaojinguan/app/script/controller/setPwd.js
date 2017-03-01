$(document).on('pageInit', '#setpwd-ctt', function() {
    //取缓存数据
    var cacheData = JSON.parse(App.Storage.get("USER"));
    var cacheDataMy = JSON.parse(App.Storage.get('MYDATA'));
    //模型层
    var SetModel = Backbone.Model.extend({
        defaults: {
            mobile: cacheData['mobile']
        }
    });
    //视图层
    var SetView = Backbone.View.extend({
        el: '.show-mobile',
        template: _.template($("#show-mobile").html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    })
    var app = new SetView({ model: new SetModel }).render();

    //变量定义
    var phone = $("#phone-num")
        pwd = $(".pwd"),
        confirmPwd = $(".confirm-password"),
        verify = $(".verify"),
        reg = /^[0-9A-Za-z]{6,12}$/,
        pwdVerify = false,
        confirmPwdVerify = false,
        verifyVerify = false;
    //输入框前端验证
    function verifyPwd() {
        //验证密码
        if (!pwd.val()) {
            pwdVerify = false;
        } else {
            if (!reg.test(pwd.val())) {
                pwdVerify = false;
                capion("error", "密码格式错误");
            } else {
                pwdVerify = true;
                //验证确认密码
                if (!confirmPwd.val()) {
                    confirmPwdVerify = false;
                } else {
                    if (pwd.val() != confirmPwd.val()) {
                        confirmPwdVerify = false;
                        capion("error", "两次密码输入不一致");
                    } else {
                        confirmPwdVerify = true;
                        //验证验证码
                        if (!verify.val()) {
                            verifyVerify = false;
                        } else {
                            verifyVerify = true;
                        }
                    }
                }
            }
        };
        //
        if (pwdVerify && confirmPwdVerify && verifyVerify) {
            return true;
        } else {
            return false;
        }
    };
    $(document).on("keydown", ".pwd,.confirm-password", function() {
        var e = event || window.event;
        if (e.keyCode == "32") {
            return false
        };
    });
    $("input").on("input propertychange", function() {
        inputVerify($("#setpwd-ctt"));
    })

    $("#setpwd-ctt .send-code").off("click");
    $("#setpwd-ctt .send-code").on("click", function() {
        //调用发送验证码接口，接口调用成功倒计时
        if (cacheData['profit']['isSetPwd'] == '1' || (cacheDataMy && cacheDataMy['isSetPwd'] == '1')) {
            var service = new Service(PORTAL_CONFIG.API_XJG + "/sms/FINDMONEYPAS/" + phone.val());
        } else {
            service = new Service(PORTAL_CONFIG.API_XJG + "/sms/SETMONEYPAS/" + phone.val());
        }

        service.ajax('POST', {})
            .done(function(res) {
                if (res.code == 200) {
                    timer(60, $(".send-code"));
                } else {
                    capion("error", res.msg);
                }
            });

    });

    $("#setpwd-ctt .send-pwd").off("click");
    $("#setpwd-ctt .send-pwd").on("click", function() {
        if (verifyPwd()) {
            if (cacheData['profit']['isSetPwd'] == '1' || (cacheDataMy && cacheDataMy['isSetPwd'] == '1')) {
                var service = new Service(PORTAL_CONFIG.API_XJG + "/setup/find");
            } else {
                service = new Service(PORTAL_CONFIG.API_XJG + "/setup/set");
            }

            service.ajax('POST', JSON.stringify({
                mobile: phone.val(),
                newPassword: _hcqApp.security.encrypt(pwd.val()),
                smsCode: verify.val()
            })).done(function(res) {
                if (res.code == 200) {
                    if (App.Storage.get("invest") == '1') {
                        if (cacheData['profit']['isBindBank'] == '1' || (cacheDataMy && cacheDataMy['isBindBank'] == '1')) {
                            $.router.load('invest.html', true);
                        } else {
                            $.router.load('cardIndent.html', true);
                        }

                    }else if(App.Storage.get("invest") == '2') {
                        if (cacheData['profit']['isBindBank'] == '1' || (cacheDataMy && cacheDataMy['isBindBank'] == '1')) {
                            $.router.load('redeem.html',true);
                        }else{
                            $.router.load("cardIndent.html",true)
                        }
                    }else {
                        $.router.load("my.html", true);
                    }
                } else if (res.code == 20024) {
                    if (App.Storage.get("invest") == '1') {
                        if (cacheData['profit']['isBindBank'] == '1' || (cacheDataMy && cacheDataMy['isBindBank'] == '1')) {
                            $.router.load('invest.html', true);
                        } else {
                            $.router.load('cardIndent.html', true);
                        }

                    }else if(App.Storage.get("invest") == '2') {
                        if (cacheData['profit']['isBindBank'] == '1' || (cacheDataMy && cacheDataMy['isBindBank'] == '1')) {
                            $.router.load('redeem.html',true);
                        }else{
                            $.router.load("cardIndent.html",true)
                        }
                    }else {
                        $.router.load("my.html", true);
                    }
                    capion("error", res.msg);
                } else {
                    capion("error", res.msg);
                }
            });
        }
    })
})
