/**
 * general configration
 * @type {Object}
 */
var PORTAL_CONFIG = {
    API_XJG:        'http://172.21.1.205:8088/xjg-api',
    API_META:       'http://172.21.1.205:8088/api-metadata',
    API_RECHARGE:   'http://172.21.1.205:8088/recharge-api',

    // API_XJG: 'http://xjg.h2finance.com/xjg-api',
    // API_META: 'http://xjg.h2finance.com/api-metadata',
    // API_RECHARGE: 'http://xjg.h2finance.com/recharge-api',
    
    CASHBOX_TOKEN: 'CASHBOX_TOKEN',
    INVESTMENT_MIN: 10, // mininum investment
    SECRET_KEY: '!QA2Z@w1sxO*(-8LK3spsSKEt3&gFH%^',
    BANKS: [
        { code: '104100000004', name: '中国银行' },
        { code: '102100099996', name: '中国工商银行' },
        { code: '103100000026', name: '中国农业银行' },
        { code: '105100000017', name: '中国建设银行' },
        { code: '302100011000', name: '中信银行' },
        { code: '303100000006', name: '中国光大银行' },
        { code: '305100000013', name: '中国民生银行' },
        { code: '306581000003', name: '广发银行' },
        { code: '307584007998', name: '平安银行' },
        { code: '309391000011', name: '兴业银行' },
        { code: '313100000013', name: '北京银行' },
        { code: '403100000004', name: '中国邮政储蓄银行' },
        { code: '313290000017', name: '上海银行' },
        { code: '314653000011', name: '重庆农商银行' }
    ]
};

var App = window.App || {};

(function($) {
    $.Request = function(key) {
        var sValue = location.search.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
        return sValue ? sValue[1] : sValue;
    };
})(Zepto);


//公共方法
(function(exports) {
    //调用app的native方法
    function _callNative(methodName, paramMap, cb) {
        var isAndroid = -1 !== navigator.userAgent.toLowerCase().indexOf("android");
        //android js bridge
        ! function(undefined) {
            var NAMESPACE = 'iBoxpay';
            var API_NAMESPACE = "__JSBridge__"
            var context = window[NAMESPACE] = {};
            var api = window[API_NAMESPACE] || null;
            if (!api) {
                return;
                //return alert('发生错误, 未找到 api 对象!');
            }
            context.require = function(cmd, params, callback) {
                params = params || '{}';
                var result = api.require(cmd, JSON.stringify(params));
                /*if(callback && result){
                    result = JSON.parse(result);
                    callback(result);
                }*/
            }
        }();
        var callbackName = 'cb' + (new Date().getTime());
        //TODO 加上token
        paramMap == null ? paramMap = {} : paramMap = paramMap;
        paramMap["callbackName"] = callbackName;
        //paramMap["myCallback"]=cb;
        var strJsonParam = JSON.stringify(paramMap);
        var jsonResp = {};
        window[callbackName] = function(strResp) {
            //alert("回调:"+JSON.stringify(strResp));
            try {
                jsonResp = typeof strResp == "string" ? eval(strResp) : strResp;
            } catch (err) {}
            cb(jsonResp);
            //执行回调后，删除跟回调方法相关的资源
            if (isAndroid) {
                delete window[callbackName];
            } else {
                document.getElementById('iframe_' + callbackName).remove();
                // $('#iframe_' + callbackName).remove();
            }
        };
        if (isAndroid) {
            try {
                iBoxpay.require(methodName, paramMap, window[callbackName]);
            } catch (err) {
                console.log(err);
            }
        } else {
            var src = 'callfunction://' + methodName + '?callback=' + callbackName + '&params=' + strJsonParam;
            var ifreame = document.createElement("iframe");
            ifreame.id = "iframe_" + callbackName;
            ifreame.src = src;
            ifreame.style.display = "none";
            document.body.appendChild(ifreame);
            // console.log(ifreame);
            // //$('<iframe id="iframe_' + callbackName + '"></iframe>').attr('src', src).hide().appendTo(document.body);
        }

    }

    var _cashbox = {
        callNative: _callNative,
        backToApp: function() {
            _callNative('exit', {}, function(res) {});
        },
        init: function() {
            var _appParams = { hasTitleBar: false, hasBackBtn: false };
            _callNative('setClientInfo', _appParams, function(res) {});
        }
    };

    var _global = {
        clearCache: function() {
            localStorage.clear();
        },
        verifyBank: function(bankCode) {
            var result = false;
            PORTAL_CONFIG.BANKS.forEach(function(item) {
                if (item.code == bankCode) {
                    result = true;
                    return;
                }
            });
            return result;
        }
    };

    exports.cashbox = _cashbox;
    exports.global = _global;
})(window._hcqApp = {});

//初始化app
_hcqApp.cashbox.init();
