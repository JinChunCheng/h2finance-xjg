<!-- build:js js/app.min.js -->
	<script src="lib/zepto/zepto.js"></script>
	<script src="lib/echarts/echarts.min.js"></script>
	<script src="lib/zepto/deferred.js"></script>
	<script src="lib/zepto/callbacks.js"></script>
	<script src="lib/sm/sm.js"></script>
	<script src="lib/backbone/underscore-min.js"></script>
	<script src="lib/backbone/backbone.js"></script>
	<script src="lib/crypto/crypto-js.js"></script>
	<script src="script/common/config.js"></script>
	<script src="script/common/validate.js"></script>
	<script src="script/service/cache-service.js"></script>
	<script src="script/common/service-helper.js"></script>
	<script src="script/service/test-service.js"></script>
	<script src="script/controller/commonController.js"></script>
	<script src="script/controller/home.js"></script>
	<script src="script/controller/index.js"></script>
	<script src="script/controller/detail.js"></script>
	<script src="script/controller/settings.js"></script>
	<script src="script/controller/subscribe.js"></script>
	<script src="script/controller/setPwd.js"></script>
	<script src="script/controller/updatePwd.js"></script>
	<script src="script/controller/redeem.js"></script>
	<script src="script/controller/cardIndent.js"></script>
	<script src="script/controller/myAssets.js"></script>
	<script src="script/controller/invest.js"></script>
	<script src="script/controller/accountInfo.js"></script>
	<script src="script/controller/my.js"></script>
	<script src="script/controller/cardDetail.js"></script>
	<script src="script/controller/error.js"></script>
	
	<!-- endbuild -->

	<!-- 这段代码放在最后 -->
	<script>$(function() { $.init(); });</script>
	<script>
		(function (doc, win) {
		    var docEl = doc.documentElement;
		    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

		    var recalc = function () {
		        var clientWidth = docEl.clientWidth;
		        if (!clientWidth) return;
		        if(clientWidth>=640){
		            clientWidth=640;
		        }
		        docEl.style.fontSize = 20 * (clientWidth / 640) + 'px';
		    };
		    if (!doc.addEventListener) return;
		    win.addEventListener(resizeEvt, recalc, false);
		    doc.addEventListener('DOMContentLoaded', recalc, false);
		})(document, window);
	</script>