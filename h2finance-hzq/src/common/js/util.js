export default {
    install(Vue) {
        //调用app的native方法
        function _callNative(methodName, paramMap, cb, flag) {
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
                    if (callback && result) {
                        result = JSON.parse(result);
                        callback(result);
                    }
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
                    if (flag) {

                    } else {
                        delete window[callbackName];
                    }
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
                console.log(ifreame);
                //$('<iframe id="iframe_' + callbackName + '"></iframe>').attr('src', src).hide().appendTo(document.body);
            }
        }

        var _cashbox = {
            callNative: _callNative,
            exit: function() {
                _callNative('exit', {}, function(res) {});
            },
            init: function() {
                var _appParams = { hasTitleBar: false, hasBackBtn: false };
                _callNative('setClientInfo', _appParams, function(res) {});
            },
            recharge: function(params, cb) {
                _callNative("cashboxTrading", params, cb);
            }
        };


        var _request = function(key) {
            var sValue = location.search.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
            return sValue ? sValue[1] : sValue;
        };

        //缓存
        var _storage = {
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
            },
            remove: function(key) {
                if (window.localStorage) {
                    localStorage.removeItem(key);
                    return;
                }
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                document.cookie = key + "=;expires=" + exp.toGMTString();
            },
            clear: function() {
                if (window.localStorage) {
                    localStorage.clear();
                }
            }
        };

        // 对Date的扩展，将 Date 转化为指定格式的String
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
        // 例子： 
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
        Date.prototype.Format = function(fmt) { //author: meizz 
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        // static data
        var _data = {
            APP_CODE: '2001233', //测试环境
            // APP_CODE: '2001234', //生产环境
            SECRET_KEY: '!QA2Z@w1sxO*(-8L', //加密串
            PAYMENT_CHANNEL: 'IBOXPAY', //支付渠道
            RECHARGE_CHANNEL: 1, //充值渠道：1代表汇赚钱
            SALES_ID: 1, //销售平台：1代表钱盒
            //代扣支持的银行
            BANKS: [
                { code: '103100000026', name: '中国农业银行' },
                { code: '105100000017', name: '中国建设银行' },
                { code: '303100000006', name: '中国光大银行' },
                { code: '307584007998', name: '平安银行' },
                { code: '309391000011', name: '兴业银行' },
                { code: '302100011000', name: '中信银行' },
                { code: '403100000004', name: '中国邮政储蓄银行' },
                { code: '305100000013', name: '中国民生银行' },
                { code: '104100000004', name: '中国银行' },
                { code: '102100099996', name: '中国工商银行' },
                { code: '306581000003', name: '广发银行' }
            ]
        };

        // 加密解密
        var _crypto = require("crypto-js");
        var _security = {
            // 加密
            encrypt: function(value) {
                // 秘钥格式转换
                var key = _crypto.enc.Utf8.parse(_data.SECRET_KEY);
                // 加密文本格式转换
                var srcs = _crypto.enc.Utf8.parse(value);
                // 开始加密
                var encrypted = _crypto.AES.encrypt(srcs, key, { mode: _crypto.mode.ECB, padding: _crypto.pad.Pkcs7 });
                return encrypted.toString();
            },
            // 解密
            decrypt: function(value) {
                // 秘钥格式转换
                var key = _crypto.enc.Utf8.parse(_data.SECRET_KEY);
                // 开始解密
                var decrypt = _crypto.AES.decrypt(value, key, { mode: _crypto.mode.ECB, padding: _crypto.pad.Pkcs7 });
                // 解密文本格式转换
                return _crypto.enc.Utf8.stringify(decrypt).toString();
            }
        };

        //公共方法
        var _helper = {
            //验证是否支持银行卡
            verifyBank: function(bankCode) {
                var result = false;
                _data.BANKS.forEach(function(item) {
                    if (item.code == bankCode) {
                        result = true;
                        return;
                    }
                });
                return result;
            }
        };

        Vue.prototype.Util = {
            Data: _data,
            Cashbox: _cashbox,
            Request: _request,
            Storage: _storage,
            Security: _security,
            Helper: _helper
        };
    }
}
