$(function() {

    $(document).on('pageInit', '#home-ctt', function() {

        var chart = [{ recordDate: '1-1', annualizedYield: '1' },
            { recordDate: '1-1', annualizedYield: '1' },
            { recordDate: '1-1', annualizedYield: '1' },
            { recordDate: '1-1', annualizedYield: '1' },
            { recordDate: '1-1', annualizedYield: '1' },
            { recordDate: '1-1', annualizedYield: '1' },
            { recordDate: '1-1', annualizedYield: '1' },
            { recordDate: '1-1', annualizedYield: '1' },
            { recordDate: '1-1', annualizedYield: '1' }
        ];
        /**
         * service instance
         * @type {Service}
         */

        /**
         * use data from cache firstly
         * @type {[type]}
         */
        var cachedData = null; // App.CacheService.get('index-page');
        var IndexModel = Backbone.Model.extend({
            dataFromCache: cachedData ? true : false,
            defaults: cachedData || function() {
                return {
                    title: '汇存钱',
                    yesterdayProfit: '0',
                    totalAssets: '0',
                    moreIncome: '0', //万份收益
                    isAuthor: 0,
                    isRedeem: 0,
                    isSetPwd: 0,
                    isBindBank: 0
                }
            },
            initialize: function() {

            },
            url: function() {
                return '/';
            }
        });

        var IndexView = Backbone.View.extend({
            el: ('#cttItems'),
            template: _.template($('#home-template').html()),
            templatenav: _.template($('#home-nav').html()),
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                $(".bar-bottom-tab").html(this.templatenav(this.model.toJSON()));
                $(".btn-bottom-lf").off("click");
                $(".btn-bottom-lf").on("click", function() {
                    App.Storage.set("invest", "1");
                })
                $(".btn-bottom-rt").off("click");
                $(".btn-bottom-rt").on("click", function() {
                    App.Storage.set("invest", "2");
                })
                this.renderChart();
                return this;
            },
            events: {},
            initialize: function() {
                var self = this;
                this.listenTo(this.model, "change", function() {
                    App.CacheService.save('index-page', this.model.attributes);
                    this.render();
                });
                //load data from server side
                if (!self.model.dataFromCache)
                    this.reloadData({ indicator: true });

                // 添加'refresh'监听器
                var refreshSelector = '#home-ctt>.pull-to-refresh-content';
                $(document).off('refresh', refreshSelector);
                $(document).on('refresh', refreshSelector, function(e) {
                    self.reloadData({
                        callback: function(success, res) {
                            $.pullToRefreshDone(refreshSelector);
                        }
                    });
                });
                //go back to cashbox app
                $(document).off('click', '#home-ctt .back-to-app');
                $(document).on('click', '#home-ctt .back-to-app', function() {
                    self.backToApp();
                });
            },
            reloadData: function(opt) {
                var self = this;
                var service = new Service(PORTAL_CONFIG.API_XJG + "/member/base");

                service.ajax('GET', {}, { indicator: opt.indicator === true })
                    .done(function(res) {
                        processCallback(true, null, opt);
                        if (res.code == 200) {
                            if (res.data) {
                                App.Storage.set('USER', JSON.stringify(res.data));
                                chart = res.data.profit.annualizedYield;
                                self.setData(res.data.profit);
                            }
                        }
                    })
                    .fail(function(err) {
                        processCallback(false, null, opt);
                    });

                function processCallback(success, data, opt) {
                    if (opt && typeof opt.callback === 'function') {
                        opt.callback(success, data);
                    }
                }
            },
            backToApp: function() {
                _hcqApp.cashbox.backToApp();
            },
            setData: function(data) {
                this.model.set(data);
            },
            renderChart: function() {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('home_chart'));

                var minValue = 0.1;
                chart.forEach(function(item) {
                    if (item.annualizedYield < minValue) {
                        minValue = item.annualizedYield;
                    }
                });
                minValue = minValue * 100 - 0.01;
                // 指定图表的配置项和数据
                var option = {
                    backgroundColor: '#f7f8fa',
                    animation: false,
                    grid: {
                        left: '-17%',
                        right: '-7%',
                        bottom: '0%',
                        top: '15%',
                        containLabel: true
                    },
                    xAxis: [{
                        axisLine: { show: false },
                        axisTick: { show: false },
                        axisLabel: {
                            textStyle: {
                                color: '#8d8d92'
                            }
                        },
                        type: 'category',
                        boundaryGap: false,
                        data: [FormatDateNoYear(chart[6].recordDate),FormatDateNoYear(chart[6].recordDate), FormatDateNoYear(chart[5].recordDate), FormatDateNoYear(chart[4].recordDate), FormatDateNoYear(chart[3].recordDate), FormatDateNoYear(chart[2].recordDate), FormatDateNoYear(chart[1].recordDate), FormatDateNoYear(chart[0].recordDate), FormatDateNoYear(chart[0].recordDate)],
                    }],
                    yAxis: [{
                        type: 'value',
                        min: minValue,
                        scale: true,
                        nameGap: 1,
                        axisLabel: { show: false },
                        axisLine: { show: false },
                        axisTick: { show: false },
                        splitLine: { show: false }
                    }],
                    series: [{
                        type: 'line',
                        symbolSize: 8,
                        itemStyle: {
                            normal: {
                                color: '#FDBC8E'
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: '#FDBC8E',
                                width: 3
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#8d8d92'
                                }
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#F8DCC7' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#F7F8FA' // 100% 处的颜色
                                }], false)
                            }
                        },
                        data: [
                            parseFloat(chart[6].annualizedYield * 100).toFixed(3),
                            parseFloat(chart[6].annualizedYield * 100).toFixed(3),
                            parseFloat(chart[5].annualizedYield * 100).toFixed(3),
                            parseFloat(chart[4].annualizedYield * 100).toFixed(3),
                            parseFloat(chart[3].annualizedYield * 100).toFixed(3),
                            parseFloat(chart[2].annualizedYield * 100).toFixed(3),
                            parseFloat(chart[1].annualizedYield * 100).toFixed(3),
                            parseFloat(chart[0].annualizedYield * 100).toFixed(3),
                            parseFloat(chart[0].annualizedYield * 100).toFixed(3)
                        ]
                    }]
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }
        });

        var app = new IndexView({ model: new IndexModel });//.render();

    });
});
