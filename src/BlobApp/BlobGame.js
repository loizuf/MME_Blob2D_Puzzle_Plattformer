BlobApp.BlobGame = (function() {
	var that = {},

	init = function(){
		var $menuplay = $('#menu-play');
		$menuplay.unbind("click");
		$menuplay.on('click', _enableLevelSelection);	
	},

	_enableLevelSelection = function(){		
		var $menucontainer = $('#menu-container');
		var $levelSelectContainer = $('#levelselect-container');
		
		$menucontainer.css('display', 'none');
		$levelSelectContainer.css('display', 'block');
		
		var $selectLevel1 = $('#level1');
		var $selectLevel2 = $('#level2');
		var $selectLevel3 = $('#level3');

		$selectLevel1.click({lvlID:1}, _startGame);
		$selectLevel2.click({lvlID:2}, _startGame);
		$selectLevel3.click({lvlID:3}, _startGame);
	},

	_startGame = function(event) {
		lvlID = event.data.lvlID;
		console.log("blob game", lvlID);

		$('body').unbind();
		
		var $levelSelectContainer = $('#levelselect-container');
		$levelSelectContainer.css('display', 'none');

		var $gamecanvas = $('#canvas-container');
		$gamecanvas.css('display', 'block');

		BlobApp.MainController.init(lvlID);
	};
 
	that.init = init;
	return that;
})();

