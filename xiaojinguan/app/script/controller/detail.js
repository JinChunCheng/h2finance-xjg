$(function() {

    $(document).on('pageInit', '#transaction-ctt', function() {

        var transactionType = $.Request('type') || '';
        var pageSize = 10,
            pageNum = 1,
            pageCount = 0,
            refreshSelector = '#transaction-ctt>.pull-to-refresh-content',
            infiniteSelector = '#transaction-ctt>.infinite-scroll-bottom',
            loading = false,
            actionType = "refresh",
            cachedData = App.CacheService.get('page-transaction');

        var Transaction = Backbone.Model.extend({
            idAttribute: 'nothing'
        });
        var TransactionList = Backbone.Collection.extend({
            dataFromCache: false,
            model: Transaction,
            url: '/'
        });
        var TransactionView = Backbone.View.extend({
            el: $('#cttItems'),
            template: _.template($('#transaction-template').html()),
            initialize: function() {
                var self = this;
                self.setView({ transactionType: transactionType });
                self.listenTo(self.collection, "change", function() {
                    App.CacheService.save('page-transaction', self.collection);
                    self.render();
                });
                if (!self.collection.dataFromCache)
                    self.reloadData({ indicator: true });

                $(document).on('refresh', refreshSelector, function(e) {
                    self.reloadData({ indicator: false });
                });

                $(document).on('infinite', infiniteSelector, this.initInfinite);
            },
            render: function() {
                var items = this.collection.toJSON();
                if (items.length == 0 ) {
                    $('#transaction-ctt .message-no-data').show();
                } else {
                    $('#transaction-ctt .message-no-data').hide();
                }
                if (actionType == 'refresh') {
                    //$(document).on('infinite', infiniteSelector, this.initInfinite);
                    this.$el.html(this.template({ collection: items }));
                } else {
                    this.$el.append(this.template({ collection: items }));
                }
                return this;
            },
            setView: function(opt) {
                $('#transaction-panel .item-inner').forEach(function(item) {
                    var currentDom = $(item);
                    if (currentDom.attr('data-type') == opt.transactionType) {
                        currentDom.addClass('active');
                    } else {
                        currentDom.removeClass('active');
                    }
                });
                var titleDom = $('#transaction-ctt .transaction-title');
                var title = '资产明细';
                switch (opt.transactionType) {
                    case 'S':
                    case 'D':
                        title = '申购记录';
                        break;
                    case 'R':
                        title = '赎回记录';
                        break;
                    case 'I':
                        title = '收益明细';
                        break;
                    default:
                        break;
                }
                titleDom.text(title);
            },
            search: function(opt) {
                if (loading)
                    return;
                beforeProcess();
                loading = true;
                var self = this;
                var service = new Service(PORTAL_CONFIG.API_XJG + '/assets/list');
                var condition = {
                    data: { transactionType: transactionType },
                    paginate: { pageSize: pageSize, pageNum: pageNum }
                };
                service.ajax('GET', { where: JSON.stringify(condition) }, { indicator: opt.indicator === true })
                    .done(function(res) {
                        res.data = res.data || { items: [] };
                        res.data.items = res.data.items || [];
                        pageCount = res.data.paginate.pagesCount;
                        setTimeout(function() {
                            loading = false;
                            processCallback(true, res.data, opt);
                        }, 500);
                    })
                    .fail(function(err) {
                        loading = false;
                        processCallback(false, err, opt);
                    });

                function beforeProcess() {
                    if (opt && typeof opt.beforeProcess === 'function') {
                        opt.beforeProcess();
                    }
                }

                function processCallback(success, data, opt) {
                    if (opt && typeof opt.callback === 'function') {
                        opt.callback(success, data);
                    }
                }
            },
            reloadData: function(opt) {
                actionType = "refresh";
                var self = this;
                var options = $.extend({}, {
                    beforeProcess: function() {
                        pageNum = 1;
                    },
                    callback: function(success, data) {
                        if (success) {
                            self.setData(data);
                        }
                        $.pullToRefreshDone(refreshSelector);
                    }
                }, opt);
                self.search(options);
            },
            loadMore: function(beforeProcess, callback) {
                actionType = "load-more";
                var self = this;
                var options = {
                    indicator: false,
                    loader: false,
                    beforeProcess: beforeProcess,
                    callback: function(success, data) {
                        self.setData(data);
                        if (callback && typeof callback == 'function') {
                            callback(success, data);
                        }
                    }
                };
                this.search(options);
            },
            setData: function(data, clear) {
                App.CacheService.save('page-transaction', data.items);
                data.items.forEach(function(item) {
                    item.amount = formatMoney(item.amount);
                    item.balance = formatMoney(item.balance);
                    item.amount = item.transactionType == 'R' ? '- ' + item.amount : '+ ' + item.amount;
                    item.finishDatetime = FormatDate(item.finishDatetime);
                    if (item.transactionType == "R") {
                        if (item.assetsType == 'S')
                            item.assetsTypeName = '赎回成功';
                        else if (item.assetsType == 'F')
                            item.assetsTypeName = '赎回失败';
                        else
                            item.assetsTypeName = '赎回处理中';
                    } else if (item.transactionType == "S" || item.transactionType == "D") {
                        item.assetsTypeName = '申购';
                        if (item.assetsType == "W") {
                            item.assetsTypeName = '待申购';
                        } else if (item.assetsType == "C") {
                            item.assetsTypeName = '申购取消';
                        } else if (item.assetsType == "S") {
                            item.assetsTypeName = '申购成功';
                        } else if (item.assetsType == "F") {
                            item.assetsTypeName = '申购失败';
                        } else if (item.assetsType == "P") {
                            item.assetsTypeName = '申购待确认';
                        }
                    } else if (item.transactionType == "I") {
                        item.assetsTypeName = '收益';
                    } else {
                        return false;
                    }

                });
                this.collection.set(data.items);
                this.collection.trigger('change');
            },
            initInfinite: function() {
                if (pageCount>0&&pageNum >= pageCount) {
                    // // 加载完毕，则注销无限加载事件，以防不必要的加载
                    // $.detachInfiniteScroll($('.infinite-scroll'));
                    // // 删除加载提示符
                    // $('.infinite-scroll-preloader').remove();
                    $(".no-more-data").show();
                    return;
                }else{
                    $(".no-more-data").hide();
                }

                app.loadMore(function() {
                    pageNum++;
                    $('.infinite-scroll-preloader').show();
                }, function(success, data) {
                    $('.infinite-scroll-preloader').hide();
                    if (success) {
                        $.refreshScroller();
                    }
                });
            }
        });
        var app = new TransactionView({ collection: new TransactionList });

        $(document).off('click', '#transaction-panel .item-inner');
        $(document).on('click', '#transaction-panel .item-inner', function() {
            transactionType = $(this).attr('data-type');
            app.setView({ transactionType: transactionType });
            app.reloadData({ indicator: true });
            $.closePanel();
        });
    });
});
