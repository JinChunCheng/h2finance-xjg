$(document).on("pageInit", "#redeem-ctt", function() {

    var redeemVerify = false;

    var cardsModel = Backbone.Model.extend({ //创建自己的模式并且拓展

        defaults: function() { //设置默认数据、
            return {
                bankAccount: "",
                bankName: "",
                bankCode: "default-grey", //银行编码
                totalAssets: "0", //总投资金额
                freeBalance: "0" //可赎回
            }
        },
        initialize: function() {},
        url: function() { //相当于/id
            return '/'
        }

    });
    //处理视图层
    var cardsView = Backbone.View.extend({
        el: '#cardsItems',
        template: _.template($('#cards-template').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        events: {
            "click .redeem-all": function() {
                var redeemMoney = $(".redeem-num input"),
                    reg = /^[1-9]\d{0,7}$/;
                redeemMoney.val(app.model.attributes.freeBalance);
                inputVerify($("#cardsItems"));
                redeemVerify = true;
            },
            "input #redeem-amount": function() {
                redeemVerify = false;
                if (!$(this).val()) {
                    inputVerify($("#cardsItems"));
                    redeemVerify = true;
                };
            },
            "click .card-next": function() {
                if (redeemVerify) {
                    var redeemMoney = $(".redeem-num input"),
                        reg = /^[1-9]\d{0,7}$/;
                    //接口获取用户最大可赎回金额
                    var freeBalance = app.model.attributes.freeBalance;
                    var val = redeemMoney.val();
                    if (val <= freeBalance) {
                        $.router.load("#redeem-iptpwd-ctt", true);
                    } else {
                        capion("error", "最多可赎回" + app.model.attributes.freeBalance + "元");
                    }
                };
            }
        },
        initialize: function() {
            var self = this;
            this.listenTo(this.model, "change", function() {
                App.CacheService.save('card-page', this.model.attributes);
                this.render();
            }); //监听变化刷新视图

            this.reloadData();
        },
        reloadData: function(opt) {
            var self = this;
            var service = new Service(PORTAL_CONFIG.API_XJG + '/bankCardAccount');
            service.ajax('GET', {})
                .done(function(res) {
                    self.setData(res.data);
                    processCallback(true, res.data, opt);
                })
                .fail(function(err) {
                    processCallback(false, res.data, opt);
                });


            function processCallback(success, data, opt) {
                if (opt && typeof opt.callback === 'function') {
                    opt.callback(success, data);
                }
            }
        },
        setData: function(data) {
            this.model.set(data);
        }
    });
    var app = new cardsView({ model: new cardsModel }).render();

    $(document).on("pageInit", "#redeem-iptpwd-ctt", function() {
        var pswd = $(".verifyIpt"),
            pswdVerify = false;
        pswd.on("input", function() {
            if (!$(this).val()) {
                pswdVerify = false;
                $(".big-btn").attr("disabled", true);
            } else {
                pswdVerify = true;
                $(".big-btn").attr("disabled", null);
            }
        });

        $("#redeem-iptpwd-ctt .pwd-verify").off("click");
        $("#redeem-iptpwd-ctt .pwd-verify").on("click", function() {
            //调用验证密码接口，正确则跳转，否则提示资金密码不正确
            if (!pswdVerify) {
                capion("error", "请输入资金密码！");
            } else {
                var amount = $('#redeem-amount').val();
                var pwd = $('#redeem-pwd').val();
                var service = new Service(PORTAL_CONFIG.API_XJG + "/redeem/handle/" + amount + "/" + pwd);
                //var service = new Service("http://172.21.20.15:8083/redeem/handle/" + amount + "/" + pwd);
                service.ajax('PUT', {}).done(function(res) {
                    if (res.code == 200 || res.code == 11003) {
                        var url = 'redeemSucceed.html?code=' + res.code + '&amount=' + amount + '&v=' + Math.random();
                        $.router.load(url, true);
                    } else
                        capion("error", res.msg || '赎回失败，请稍后再试！');
                });
            }

        });

    });
});


//赎回成功页
$(document).on("pageInit", "#redeem-succeed", function() {
    var d = new Date();
    var succeedModel = Backbone.Model.extend({
        defaults: function() {
            var today = d.Format('yyyy-MM-dd hh:mm:ss');
            var amount = $.Request('amount') || 0;
            var bg = 'reedem-bg1';
            var message = '赎回申请成功!';
            if ($.Request('code') == 11003) {
                bg = 'reedem-bg2';
                message = '赎回申请处理中...';
            }
            return {
                message: message,
                reedemBg: bg,
                date: today,
                amount: parseFloat(amount).toFixed(2)
            }
        }
    })
    var succeedView = Backbone.View.extend({
        el: "#redeem-success-content",
        template: _.template($("#tmp-redeem-success").html()),
        render: function() {
            //this.$el.parent().html(this.$el);
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });
    var app = new succeedView({ model: new succeedModel }).render();
});
