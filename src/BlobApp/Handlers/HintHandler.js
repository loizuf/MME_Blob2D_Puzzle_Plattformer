BlobApp.HintHandler = (function() {
	var that = {},

	/*or anything to determine what has to be displayed*/
	init = function(numHints, p1Controller, p2Controller) {
		_setHintClasses(p1Controller, p2Controller);
		showHints(numHints);
		return that;
	},

	_setHintClasses = function (p1Controller, p2Controller) {
		if(p1Controller){
			var $temp = $('.p1');
			$temp.children().addClass('offset');
		}
		if(p2Controller){
			var $temp = $('.p2');
			$temp.children().addClass('offset');
		}
	},

	showHints = function (numHints) {
		var i;
		console.log("shows "+numHints+" hints");

		for(i = 1; i <= numHints; i++){
			var $temp = $('.ht-' +i );
			$temp.removeClass('hidden');
		}
	};
	
	that.init = init;
	that.showHints = showHints;

	return that;
})();