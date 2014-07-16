BlobApp.ViewController = (function() {
	var that = {},
	canvas, context, debugCanvas, debugContext, stage,

	init = function() {
		_initView();
		_ticker();
		_listener();

		return that;
	},

	applyEntity = function(event, data, wurst) {
		console.log("applied entity", data);
		stage.addChild(data);
	},

	update = function() {
		//console.log("hoot");
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
		update();
		$(that).trigger(onTickRequest);
	},

	_listener = function(){
		$('body').on('entityRequested',applyEntity);
		$("body").on("blobRequested", applyEntity);
	};

	that.init = init;
	that.applyEntity = applyEntity;
	that.update = update;
	return that;
})();