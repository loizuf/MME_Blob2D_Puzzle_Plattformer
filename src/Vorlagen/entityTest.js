appTest.entityTest = (function() {
	var that = {},

	init = function() {
		return that;
	},
	
	spawn = function() {
		var entityBMP = new createjs.Bitmap("res/img/blob.png");
		entityBMP.x= Math.round(Math.random()*795);
		entityBMP.y = Math.round(Math.random()*595);
		entityBMP.regX = 12;
		entityBMP.regY = 12;
		entityBMP.snapToPixel = true;
		entityBMP.mouseEnabled = false;
		var onSpawnRequest = $.Event('onSpawnRequested');
		$(that).trigger(onSpawnRequest, entityBMP);
		return that;
	};

	that.init = init;
	that.spawn = spawn;
	return that;
})();