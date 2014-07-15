appTest.entityTest = (function() {
	var that = {},

	init = function() {
		return that;
	},
	
	/*hierhin kommt unser konzipiertes klassenmodell ausm wiki/aus der vorarbeit*/
	spawn = function() {
		/* hier wird ausgewählt ob bmp, sprite, animated sprite etc */
		var entityBMP = new createjs.Bitmap("../../res/img/blob.png");

		/* koordinaten kommen aus dem levelloader */
		entityBMP.x= Math.round(Math.random()*795);
		entityBMP.y = Math.round(Math.random()*595);

		/* setzen auf höhe/2, breite /2 */
		entityBMP.regX = 12;
		entityBMP.regY = 12;
		entityBMP.snapToPixel = true;
		entityBMP.mouseEnabled = false;
		
		var onSpawnRequest = $.Event('onSpawnRequested');
		$(that).trigger(onSpawnRequest, entityBMP);
		return that;
	},
	moveLeft = function() {
		bodies[0].ApplyForce(new b2Vec2(-2, 0), bodies[0].GetPosition());

	},

	moveRight = function() {
		bodies[0].ApplyForce(new b2Vec2(2, 0), bodies[0].GetPosition());
	};

	that.moveLeft = moveLeft;
	that.moveRight = moveRight;
	that.init = init;
	that.spawn = spawn;
	return that;
})();