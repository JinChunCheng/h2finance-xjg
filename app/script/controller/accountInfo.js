$(function() {
    $(document).on('pageInit', '#account-dt', function() {
        var accountModel = Backbone.Model.extend({
            defaults: function() {
                return {
                    name: '',
                    idNo: '',
                    mobile: ''
                }
            },
        });
        var accountView = Backbone.View.extend({
            el: $(".account-ul"),
            template: _.template($('#account-li').html()),
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
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
                var user = App.Storage.get('USER');
                if(user) {
                    this.setData(JSON.parse(user));
                }
            },
            setData: function(data) {
                this.model.set(data);
                this.model.trigger('change');
            }
        });
        new accountView({ model: new accountModel }).render();
    });
});
