BlobApp.Blob = (function Blob(sprite, x_pos, y_pos, sizeX, sizeY, blobID) {

	this.prototype = new DynamicEntity(sprite, x_pos, y_pos, sizeX, sizeY);
	this.prototype.applyPhysicsBody = function(sprite) { 
		$(this).trigger('entityRequested', sprite, "blob");
	
	};
	
	this.prototype.init =function(){
		if(blobID == 1){
			sprite = new createjs.Bitmap("/res/img/greenblob.png");
		}else{
			sprite = new createjs.Bitmap("/res/img/redblob.png");
		}
		

		/* koordinaten kommen aus dem levelloader */
		sprite.x = x_pos;
		sprite.y = y_pos;

		/* setzen auf höhe/2, breite /2 */
		sprite.regX = 12;
		sprite.regY = 12;
		sprite.snapToPixel = true;
		sprite.mouseEnabled = false;
		applyPhysicsBody(sprite, "blob");
	}
	init();

	this.blobID = blobID;
});