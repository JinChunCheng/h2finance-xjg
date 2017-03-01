export default {
    install(Vue) {
        Vue.prototype.session_setStorage = (key, value) => {
            localStorage.setItem(key, value);
            sessionStorage.setItem(key, value);
        };
        Vue.prototype.session_getStorage = key => {
            localStorage.getItem(key);
            sessionStorage.getItem(key);
            if (sessionStorage.getItem(key))
                return sessionStorage.getItem(key);
            else
                return localStorage.getItem(key);
        };
        Vue.prototype.session_removeItem = key => {
            if (sessionStorage.getItem(key))
                sessionStorage.removeItem(key);
            else if (localStorage.getItem(key))
                localStorage.removeItem(key);
        };
        Vue.prototype.session_length = () => ({
            sessionStorage: sessionStorage.length,
            localStorage: localStorage.length
        });
    }
}
