$(document).on('pageInit', '#updatePwd-ctt', function() {
    var cacheData = JSON.parse(App.Storage.get("USER"));
    var updatePwdModel = Backbone.Model.extend({
        defaults: {
            mobile: cacheData ? cacheData['mobile'] : '13718701554'
        }
    });
    var updatePwdView = Backbone.View.extend({
        el: $('.show-mobile'),
        template: _.template($("#pwd-template").html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var app = new updatePwdView({ model: new updatePwdModel }).render();
    //变量定义
    var phone = $("#phone-number"),
        oldPwd = $(".old-pwd input"),
        newPwd = $(".new-pwd input"),
        confirmPwd = $(".confirm-pwd input"),
        verify = $(".verify"),
        reg = /^[0-9A-Za-z]{6,12}$/,
        updateCode = $("#updatePwd-ctt .send-code"),
        oldVerify = false,
        newVerify = false,
        confirmVerify = false,
        verifyVerify = false;
    //验证input框
    function verifyUpdate() {
        if (!oldPwd.val()) {
            oldVerify = false;
        } else {
            oldVerify = true;
            if (!newPwd.val()) {
                newVerify = false;
            } else {
                if (!reg.test(newPwd.val())) {
                    newVerify = false;
                    capion("error", "密码格式错误");
                } else {
                    newVerify = true;
                    if (!confirmPwd.val()) {
                        confirmVerify = false;
                    } else {
                        if (confirmPwd.val() != newPwd.val()) {
                            confirmVerify = false;
                            capion("error", "两次新密码输入不一致");
                        } else {
                            confirmVerify = true;
                            if (!verify.val()) {
                                verifyVerify = false;
                            } else {
                                verifyVerify = true;
                            }
                        }
                    }
                }
            }
        }
        if (oldVerify && newVerify && confirmVerify && verifyVerify) {
            return true;
        } else {
            return false;
        }
    }

    updateCode.off('click');
    updateCode.on('click', function() {
        var service = new Service(PORTAL_CONFIG.API_XJG + "/sms/MODIFYMONEYPAS/" + phone.val());
        service.ajax('POST', {})
            .done(function(res) {
                if (res.code == 200) {
                    timer(60, updateCode);
                } else {
                    capion("error", res.msg);
                }
            });
    });
    $(document).on("keydown", ".old-pwd input,.new-pwd input,.confirm-pwd input", function() {
        var e = event || window.event;
        if (e.keyCode == "32") {
            return false;
        };
    })
    $("input").on("input propertychange", function() {
        inputVerify($("#updatePwd-ctt"));
    })

    $("#updatePwd-ctt .send-pwd").off("click");
    $("#updatePwd-ctt .send-pwd").on("click", function() {
        if (verifyUpdate()) {
            var service = new Service(PORTAL_CONFIG.API_XJG + "/setup/reset")
            service.ajax('POST', JSON.stringify({
                mobile: phone.val(),
                newPassword: _hcqApp.security.encrypt(newPwd.val()),
                smsCode: verify.val(),
                originalPassword: _hcqApp.security.encrypt(oldPwd.val())
            })).done(function(res) {
                if (res.code == 200) {
                    $.router.load("my.html", true);
                } else {
                    capion("error", res.msg);
                }
            });
        };
    })
})
