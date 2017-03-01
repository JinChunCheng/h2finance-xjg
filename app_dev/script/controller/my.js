$(function() {
    $(document).on("pageInit", "#my-ctt", function() {

        var myModel = Backbone.Model.extend({ //创建自己的模式并且拓展

            defaults: function() { //设置默认数据
                return {
                    totalAssets: "",
                    yesterdayProfit: "",
                    yesterDaySum: "",
                    isSetPwd: 0,
                    isBindBank: 0
                }
            },
            initialize: function() {},
            url: function() { //相当于/id
                return '/'
            }

        });
        //处理视图层
        var myView = Backbone.View.extend({
            el: $('#my-cttItems'),
            template: _.template($('#my-template').html()),
            render: function() {
                //alert(this.model.isSetPwd);
                //alert(JSON.stringify(this.model.toJSON()));
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            events: {
                'click .user-settings,.user-buy': 'updateStorage'
            },
            initialize: function() {
                var self = this;
                this.listenTo(this.model, "change", function() {
                    // App.CacheService.save('my-page', this.model.attributes);
                    this.render();
                }); //监听变化刷新视图

                this.reloadData();
            },
            reloadData: function(opt) {
                var self = this;
                var service = new Service(PORTAL_CONFIG.API_XJG + '/personCenter');
                service.ajax('GET', {})
                    .done(function(res) {
                        if (res.code == 200) {
                            self.setData(res.data);
                            App.Storage.set("MYDATA", JSON.stringify(res.data));
                            processCallback(true, res.data, opt);
                        } else
                            capion('error', '获取信息失败，请稍后再试！');
                    })
                    .fail(function(err) {
                        processCallback(false, err, opt);
                    });

                function processCallback(success, data, opt) {
                    if (opt && typeof opt.callback === 'function') {
                        opt.callback(success, data);
                    }
                }
            },
            setData: function(data) {

                data.totalAssets = formatMoney(data.totalAssets);
                data.yesterdayProfit = formatMoney(data.yesterdayProfit);
                data.yesterDaySum = formatMoney(data.yesterDaySum);
                this.model.set(data);

            },
            updateStorage: function() {
                App.Storage.set("invest", 0);
            }
        });
        var app = new myView({ model: new myModel }); //.render();

    });
});
