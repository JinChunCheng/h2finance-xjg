$(function() {
    $(document).on('pageInit', '#cardDetail-ctt', function() {
        var accountModel = Backbone.Model.extend({
            defaults: function() {
                return {
                    name: '',
                    idNo: '',
                    mobile: '',
                    bankAccount: '',
                    bankCode: 'default-grey',
                    bankName: ''
                }
            },
        });
        var accountView = Backbone.View.extend({
            el: $(".cardDetail-content"),
            template: _.template($('#cardDetail-tpl').html()),
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
            },
            initialize: function() {
                var self = this;
                this.listenTo(this.model, "change", function() {
                    this.render();
                });
                this.loadData();
            },
            loadData: function() {
                var self = this;
                var service = new Service(PORTAL_CONFIG.API_XJG + '/investorBank');
                service.ajax('GET', {})
                    .done(function(res) {
                        if (res.code == 200) {
                            if (res.data == null) {
                                return false;
                            }
                            var bA = res.data.bankAccount;
                            res.data.bankAccount = bA.substr(bA.length - 4);
                            self.setData(res.data);
                        }
                    });
            },
            setData: function(data) {
                this.model.set(data);
                this.model.trigger('change');
            }
        });
        new accountView({ model: new accountModel });
    });
});
