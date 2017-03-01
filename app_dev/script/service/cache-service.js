/**
 * [CacheService description]
 * @type {Object}
 */
App.CachedData = [];
App.CacheService = {
    save: function(key, value) {
        var exist = false;
        App.CachedData.forEach(function(item) {
            if (item.key === key) {
                item.value = value;
                exist = true;
                return;
            }
        });
        if (!exist) {
            App.CachedData.push({ key: key, value: value });
        }
    },
    get: function(key) {
        var value = null;
        App.CachedData.forEach(function(item) {
            if (item.key === key) {
                value = item.value;
                return;
            }
        });
        return value;
    },
    remove: function(key) {
        for (var i = 0; i < App.CachedData.length; i++) {
            var item = App.CachedData[i];
            if (item.key === key) {
                App.CachedData.splice(i, 1);
                return;
            }
        }
    }
};

/**
 * [Storage description]
 * @type {Object}
 */
App.Storage = {
    get: function(key) {
        if (window.localStorage) {
            return localStorage.getItem(key);
        }
        // if browser does not support storage, use cookie instead
        var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    set: function(key, value) {
        if (window.localStorage) {
            localStorage.setItem(key, value);
            return;
        }
        document.cookie = key + "=" + escape(value) + ";path=/";
    }
};
