$(function() {

    $(document).on('pageInit', '#idx-ctt', function() {

        /**
         * set cashbox token into local storage
         */
        (function() {
            _hcqApp.global.clearCache();
            //token from cashbox
            var cashboxToken = $.Request('token');

            //if cashbox token existed in url
            //relogin with this cashbox token
            if (cashboxToken) {
                //one key login
                var loginService = new Service(PORTAL_CONFIG.API_XJG + "/register/" + cashboxToken);
                loginService.ajax('GET', {}, { handleError: false }).done(function(res) {
                    if (res.code == 200 && res.data && res.data.token) {
                        App.Storage.set(PORTAL_CONFIG.CASHBOX_TOKEN, cashboxToken);
                        App.Storage.set('TOKEN', res.data.token);
                        App.Storage.set('USER', JSON.stringify(res.data));
                        window.location.href = 'home.html';
                    } else {
                        window.location.href = 'error.html?code=' + res.code + '&v=' + Math.random();
                    }
                }).fail(function(err) {
                    window.location.href = 'error.html?v=' + Math.random();
                });
            } else {
                window.location.href = 'error.html?v=' + Math.random();
            }
        })();

    });
});
