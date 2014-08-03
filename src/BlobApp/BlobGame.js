BlobApp.BlobGame = (function() {
	var that = {},

	init = function(){
		var $menuplay = $('#menu-play');
		$menuplay.unbind("click");
		$menuplay.on('click', _startGame);

	},

	_startGame = function(){
		var $menucontainer = $('#menu-container');
		var $gamecanvas = $('#canvas-container');
		
		$gamecanvas.css('display', 'block');
		$menucontainer.css('display', 'none');
		
		BlobApp.MainController.init();
	};

	that.init = init;
	return that;
})();