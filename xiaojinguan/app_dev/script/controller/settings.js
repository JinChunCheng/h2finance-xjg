$(function() {

    $(document).on('pageInit', '#settings-ctt', function() {

        var SettingsModel = Backbone.Model.extend({
            defaults: {
                title: '小金罐',
                profitYesterday: '0.00',
                profitTotal: '3000.00',
                totalAmount: '50000.00',
                profitPerTT: '0.6535' //万份收益
            }
        });

        var SettingsView = Backbone.View.extend({
            model: new SettingsModel,
            el: $('#settings-ctt'),
            template: _.template($('#settings-template').html()),
            render: function() {
                this.$el.append(this.template(this.model.toJSON()));
            }
        });

        var app = new SettingsView().render();
    });
});
