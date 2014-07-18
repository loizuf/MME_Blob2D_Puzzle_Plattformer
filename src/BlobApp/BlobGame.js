BlobApp.BlobGame = (function() {
	var that = {},

	init = function(){
		console.log("initiated");
		var $menuplay = $('#menu-play');
		$menuplay.on('click',startGame);
	},

	startGame = function(){
		console.log("started game");
		var $menucontainer = $('#menu-container');
		var $gamecanvas = $('#canvas-container');
		$gamecanvas.css('display', 'block');
		$menucontainer.css('display', 'none');
		BlobApp.MainController.init();
	};

	that.init = init;
	return that;
})();