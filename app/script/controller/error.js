$(function() {
    $(document).on("pageInit", "#error-ctt", function() {

        var errorCode = $.Request('code');
        if (errorCode && errorCode != 'undefined') {
            $("#error-code").text('(错误码:' + errorCode + ')');
        }
        $('#error-back').off('click');
        $('#error-back').on('click', function() {
            _hcqApp.cashbox.backToApp();
        });
        console.log(_hcqApp.security.encrypt('我爱你'));
        // var key = PORTAL_CONFIG.SECRET_KEY;
        // var data = "我爱你";

        // key = CryptoJS.enc.Utf8.parse(key);

        // var srcs = CryptoJS.enc.Utf8.parse(data);
        // var encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        // var encryptedStr = encrypted.toString();
        // console.log(data, encryptedStr);

        // var decrypt = CryptoJS.AES.decrypt(encryptedStr, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        // console.log(CryptoJS.enc.Utf8.stringify(decrypt).toString());
    });
});
