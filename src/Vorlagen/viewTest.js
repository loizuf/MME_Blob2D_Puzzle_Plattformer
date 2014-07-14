appTest.viewTest = (function() {
	var that = {},
	canvas, context, debugCanvas, debugContext, stage,

	init = function() {
		_initView();
		_ticker();

		return that;
	},

	applyEntity = function(data) {
		stage.addChild(data);
	},

	update = function() {
		stage.update();
	},

	_ticker = function() {
		createjs.Ticker.setFPS(30);
		createjs.Ticker.useRAF = true;
		createjs.Ticker.addEventListener("tick", _tick);
		
	},

	_initView = function() {
		canvas = document.getElementById('gameCanvas');
		debugCanvas = document.getElementById('debugCanvas');
		context = canvas.getContext("2d");
		stage = new createjs.Stage(canvas);
		stage.snapPixelsEnabled = true;
	},

	_tick = function() {
		var onTickRequest = $.Event('onTick');
		$(that).trigger(onTickRequest);
	};

	that.init = init;
	that.applyEntity = applyEntity;
	that.update = update;
	return that;
})();