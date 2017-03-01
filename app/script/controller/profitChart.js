$(function(){
	$(document).on("pageInit",'#idx-ctt',function(){
		/**
			*service instance
			*@type {Service}
		**/
		var chart = new Service(PORTAL_CONFIG.API_PROFIT);

		/**
			*use data form cache firstly
			@type{[type]}

		**/
		var cachedData = App.CacheService.get('')
	})
})