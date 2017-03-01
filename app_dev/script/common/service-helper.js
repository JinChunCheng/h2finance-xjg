/**
 * @author youhaiyang
 * @version 1.0.0
 * @description service helper file, in order to...
 */

/**
 * constructor of the general service
 * @param {[type]} url [description]
 */
function Service(url) {
    this.rootUrl = url;
    this.handleData = function(data, config) {
        //check if login or not
        if (data && data.code != 200) {
            console.log(data);
            if (data.code == 410) {
                window.location.href = "error.html?code=" + data.code + "&v=" + Math.random();
                return null;
            } else if (data.code == 500 && config.handleError === true) {
                capion('error', '网络繁忙，请稍后再试');
                return null;
            }
        }
        //code === 200
        return data;
    };
}

/**
 * implement of the general service
 * call ajax method in promise type
 * @type {Object}
 */
Service.prototype = {
    constructor: Service,
    ajax: function(method, param, options) {
        var config = $.extend({}, { indicator: true, handleError: true, timeout: 10000 }, options);
        var token = App.Storage.get('TOKEN') || '';
        var df = $.Deferred();
        if (config) {
            if (config.indicator) {
                setTimeout(function() { $.showIndicator(); }, 0);
            }
            if (config.loader) {
                setTimeout(function() { $.showPreloader(); }, 0);
            }
        }
        try {
            $.ajax({
                cache: false,
                //timeout: config.timeout || 10000, //default 10 seconds
                type: method || 'GET',
                url: this.rootUrl,
                data: param,
                dataType: 'json',
                contentType: 'application/json',
                xhrFields: { withCredentials: true },
                headers: {
                    token: token
                }
            }).done(function(data, result, req) {
                setTimeout(function() {
                    $.hideIndicator();
                    $.hidePreloader();
                }, 500);
                //process response data
                var d = this.handleData(data, config);
                if (d) {
                    df.resolve(d);
                }
            }.bind(this)).fail(function(req, result, status) {
                //hide loading layer
                $.hideIndicator();
                $.hidePreloader();
                //show error message
                console.log(result);
                capion("error", "网络连接失败，请稍后再试");
                //df.resolve(result);
                df.reject(result);
            }.bind(this));

            return df;
        } catch (e) {
            alert(e);
        }
    }
};
