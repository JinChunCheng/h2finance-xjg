/*计时*/
function timer(time, sendCode) {
    var hander;
    clearInterval(hander);
    sendCode.html(time <= 0 ? "发送校验码" : time + "秒");
    sendCode.attr("disabled", true);
    hander = setInterval(function() {
        if (time <= 0) {
            clearInterval(hander); //清除倒计时
            sendCode.removeAttr("disabled");
            sendCode.text("发送校验码");
            return false;
        } else {
            if (time == 60) {
                time = time - 1;
            }
            sendCode.html(time-- + "秒");
        }
    }, 1000);
}
//格式化当前日期
Date.prototype.Format = function(sty, date) {
        var o = {
            'y+': new Date(date).getFullYear() || this.getFullYear(), //年
            "M+": new Date(date).getMonth() + 1 || this.getMonth() + 1, //月份 
            "d+": new Date(date).getDate() || this.getDate(), //日 
            "h+": new Date(date).getHours() || this.getHours(), //小时 
            "m+": new Date(date).getMinutes() || this.getMinutes(), //分 
            "s+": new Date(date).getSeconds() || this.getSeconds(), //秒 
            "q+": Math.floor((new Date(date).getMonth() + 3) / 3) || Math.floor((this.getMonth() + 3) / 3), //季度 
            "s": new Date(date).getMilliseconds() || this.getMilliseconds() //毫秒 
        }
        for (var i in o) {
            if (("" + o[i]).length < 2) {
                o[i] += ("0" + o[i]);
            };
            if (new RegExp("(" + i + ")").test(sty)) {
                sty = sty.replace(RegExp.$1, ("" + o[i]).substr(("" + o[i]).length - RegExp.$1.length));
            };
        };
        return sty;
    }
    //格式化日期数据

function FormatDate(date) {
    var newTime;
    newTime = new Date(date);
    var year = newTime.getFullYear();
    var month = (newTime.getMonth() + 1) > 9 ? newTime.getMonth() + 1 : '0' + (newTime.getMonth() + 1);
    var day = newTime.getDate() > 9 ? newTime.getDate() : '0' + newTime.getDate();
    var hour = newTime.getHours();
    return year + '-' + month + '-' + day;
};

function FormatDateNoYear(date) {
    var newTime;
    newTime = new Date(date);
    var month = (newTime.getMonth() + 1) > 9 ? newTime.getMonth() + 1 : '0' + (newTime.getMonth() + 1);
    var day = newTime.getDate() > 9 ? newTime.getDate() : '0' + newTime.getDate();
    var hour = newTime.getHours();
    return month + '-' + day;
};
//弹窗
function capion(state, des) {
    state == "success" ? succeed() : errored();

    function succeed() {
        $.toast("<img src='../../img/succeed-icon.png'><span>" + des + "</span>", 3000, "success");
        ($(".modal-overlay").length != 0) ? $(".modal-overlay").addClass("modal-overlay-visible"): $(document.body).append("<div class='modal-overlay modal-overlay-visible'></div>");
        setTimeout(function() {
            $(".modal-overlay").removeClass("modal-overlay-visible");
        }, 3000);
    }

    function errored() {
        $.alert("<img src='../../img/stop-icon.png'><span>" + des + "</span>", function() {
            return "noBank";
        });
    }
}


//格式化后台传回数据
function dataFormat(type, data) { //type为money时，将数据三个一组划分，加,分割;type为num时，保留传入数据的前三位和后三位，其余用*代替；type为name时，保留传入数据的第一位，其余用*代替
    var res = "";
    data = data + "";
    var len = 0,
        sur = 0,
        dataFix = "00",
        resd = "",
        arr = [];
    switch (type) {
        case "money":
            if (data.split("").indexOf(".") != -1) {
                dataFix = data.split(".")[1];
                data = data.split(".")[0];
            };
            len = parseInt(data.length / 3) || 0; //type为money时，将数据三个一组划分，加,分割
            sur = data.length % 3;
            for (var i = len; i >= 0; i--) {
                if (i > 0) {
                    resd = data.substr(sur + (i - 1) * 3, 3);
                    arr.unshift(resd);
                } else {
                    if (sur>0) {
                        resd = data.substr(0, sur);
                        arr.unshift(resd);
                    };    
                }
            }
            res = arr.join(",") + "."+dataFix;
            break;
        case "num":
            data = data.split(""); //type为num时，保留传入数据的前三位和后三位，其余用*代替；
            len = data.length;
            for (var j = 0; j < len; j++) {
                if (j > 2 && j < len - 3) {
                    data.splice(j, 1, "*");
                };
            };
            res = data.join("");
            break;
        case "name":
            data = data.split(""); //type为name时，保留传入数据的第一位，其余用*代替
            len = data.length;
            for (var k = 0; k < len; k++) {
                if (k > 0) {
                    data.splice(k, 1, "*");
                };
            };
            res = data.join("");
    }
    return res;
}

//format money
function formatMoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}
//input框非空验证
function inputVerify(param, checked) {
    param.find(".big-btn").attr("disabled", true);
    var i = 0;
    var len = param.find("input").length;
    param.find("input").each(function() {
        if (!$(this).val()) {} else {
            i++;
        }
    })
    if (!checked) {
        if (i == len) {
            param.find(".big-btn").attr("disabled", null);
        };
    } else {
        if (i == len && (checked === true || checked.is(":checked"))) {
            param.find(".big-btn").attr("disabled", null);
        };
    }
}
