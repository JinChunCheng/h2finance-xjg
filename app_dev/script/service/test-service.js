/**
 * [TestService description]
 * @type {Object}
 */
App.TestService = function() {
    return {
        getAll: function(param) {
            //...
            var service = new Service(PORTAL_CONFIG.API_FINANCE);
            return service.ajax({
                id: 1,
                name: 'test'
            }, 'GET');
        }
    }
};
