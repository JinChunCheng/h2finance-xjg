$(function() {

    $(document).on('pageInit', '#myassets', function() {
        //为服务传递参数
        //var service = new Service('script/json/data-myAssets.json');
        var service = new Service(PORTAL_CONFIG.API_XJG + '/getAssetsCount');
        var myAssetsModel = Backbone.Model.extend({ //创建自己的模式并且拓展

            defaults: function() { //设置默认数据
                return {
                    newtotalAssets: "",
                    newsgSuccessBalance: "",
                    newztBalance: "",
                    newsgzBalance: "",
                    newfrozenBalance: ""
                }
            },
            initialize: function() {},
            url: function() { //相当于/id
                return '/'
            }

        });
        //处理视图层
        var myAssetsView = Backbone.View.extend({
            el: '#assetsItems',
            template: _.template($('#assets-template').html()),
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            events: {},
            initialize: function() {
                var self = this;
                this.listenTo(this.model, "change", function() {
                    this.render();
                }); //监听变化刷新视图

                this.reloadData();
            },
            reloadData: function(opt) {
                var self = this;

                service.ajax('GET', {})
                    .done(function(res) {
                        if (res.data) {
                            //res.data = { ztBalance: 50, successBalance: 20, sgzBalance: 30 };
                            res.data.totalAssets = res.data.ztBalance + res.data.successBalance + res.data.sgzBalance;
                            self.setData(res.data);
                        }
                        processCallback(true, res.data, opt);
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

                //处理svg
                function circleSvg(data) {
                    if (!data)
                        return;
                    const
                        circle1 = document.querySelectorAll("circle")[1],
                        circle2 = document.querySelectorAll("circle")[2],
                        circle3 = document.querySelectorAll("circle")[3],
                        //totalAssets  总资产
                        //sgSuccessBalance  申购成功金额
                        //ztBalance  在途金额
                        //sgzBalance   申请中金额
                        //frozenBalance  冻结     
                        percentOne = data.successBalance / data.totalAssets,
                        percentTwo = 1- percentOne;// data.ztBalance / data.totalAssets,
                        percentThree = data.sgzBalance / data.totalAssets,
                        perimeter = Math.PI * 2 * 150;

                    function svg() {
                        circle1.setAttribute('stroke-dasharray', perimeter * 1 + ",0");
                        circle2.setAttribute('stroke-dasharray', perimeter * percentTwo + "," + perimeter * (1- percentTwo));
                        circle3.setAttribute('stroke-dasharray', perimeter * percentThree + "," + perimeter * (1 - percentThree));
                    }

                    setTimeout(
                        svg, 200
                    );
                };

                //过滤数据
                function handleNum(str) {
                    var newStr = "";
                    var count = 0;
                    str = str + "";
                    if (str.indexOf(".") == -1) {
                        for (var i = str.length - 1; i >= 0; i--) {
                            if (count % 3 == 0 && count != 0) {
                                newStr = str.charAt(i) + "," + newStr;
                            } else {
                                newStr = str.charAt(i) + newStr;
                            }
                            count++;
                        }
                        str = newStr + ".00"; //自动补小数点后两位
                        return str
                    } else {
                        for (var i = str.indexOf(".") - 1; i >= 0; i--) {
                            if (count % 3 == 0 && count != 0) {
                                newStr = str.charAt(i) + "," + newStr;
                            } else {
                                newStr = str.charAt(i) + newStr; //逐个字符相接起来
                            }
                            count++;
                        }
                        str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
                        return str
                    }
                };

                function handleData(data) {
                    if (data) {
                        data.newtotalAssets = handleNum(data.totalAssets);
                        data.newztBalance = handleNum(data.ztBalance);
                        data.newsgSuccessBalance = handleNum(data.successBalance);
                        data.newsgzBalance = handleNum(data.sgzBalance);
                        data.newfrozenBalance = handleNum(data.frozenBalance);
                    }
                    return data;
                };
                var newData = handleData(data);
                this.model.set(newData);
                circleSvg(data);
            }
        });
        var app = new myAssetsView({ model: new myAssetsModel }).render();
    });
});
