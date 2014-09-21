// The bubbles that indicate what button to press etc.
BlobApp.HintBubble = (function HintBubble(x_pos, y_pos, additionalInfo) {
	this.prototype = new BlobApp.Entity(x_pos, y_pos - 75, 100, 75);
	
	var thisVar = this,
		sprite,
		tilesetSheet,
		tileset;

	this.hintID = additionalInfo.id; // contains "bubbleGreen" or "bubbleRed"
	this.bubbleType = additionalInfo.bubbleType; // contains "down" (blinking down key) or "redBlob" or "greenBlob"

	this.prototype.init = function() {
		var tileset = new Image();
		tileset.src = "res/img/sign_alt.png";

		_listeners();

		// callback for loading sprite after tileset is loaded
		tileset.onLoad = thisVar._initSprite(tileset, 100, 75);		
		thisVar._listeners();
	},	

	this._listeners = function() {
		$('body').on("animateHintBubble", thisVar._animate);		
		$('body').on("startSlingshot", thisVar._removeBubbles);
		$('body').on("startTele", thisVar._removeBubbles);
	},

	this._removeBubbles = function() {
		$('body').trigger("juiceRequested", {removeByName : ["bubbleredBlob"]});
		$('body').trigger("juiceRequested", {removeByName : ["bubblegreenBlob"]});
	},

	this._initSprite = function(tileset, width, height) {
		var imageData = {
			images : [ tileset ],
			frames : {
				width : width,
				height : height,
			},

			animations : {
				blinkController: [0, 1, "blinkController", 0.035],
				blinkPlayer1: [4, 5, "blinkPlayer1", 0.035],
				blinkPlayer2: [2, 3, "blinkPlayer2", 0.035],
				waitingForPlayer2: [6, 7, "waitingForPlayer2", 0.035],
				waitingForPlayer1: [8, 9, "waitingForPlayer1", 0.035],
				levelLoadPlayer1: [12,13,"levelLoadPlayer1", 0.035],
				levelLoadPlayer2: [10,11,"levelLoadPlayer2", 0.035],
				blinkControllerUp: [14,15, "blinkControllerUp", 0.035]
			}
		}

		tilesetSheet = new createjs.SpriteSheet(imageData);
		sprite = new createjs.Sprite(tilesetSheet);
		sprite.name = thisVar.hintID;
		thisVar.prototype.setupSprite(sprite);

		var aniName = _getAnimationName (thisVar.hintID, 
			(thisVar.hintID == "bubblegreenBlob")? "p1" : "p2", 
			thisVar.bubbleType, 
			(thisVar.hintID == "bubblegreenBlob")? Controls.p1 : Controls.p2);
 
		sprite.gotoAndPlay(aniName);
	},

	_getAnimationName = function(hintID, blobID, bubbleType, controls) {
		if (hintID == "bubblegreenBlob" && blobID != "p1") return;
		if (hintID == "bubbleredBlob" && blobID != "p2") return;

		if (bubbleType == "down") {
			if (controls == 1) {
				return (blobID == "p1")? "blinkPlayer1" : "blinkPlayer2"
			} else {
				return "blinkController";
			}
		} else if (bubbleType == "up") {
			if (controls == 1) {
				return (blobID == "p1")? "levelLoadPlayer1" : "levelLoadPlayer2"
			} else {
				return "blinkControllerUp";
			}
		}

	}
	
	this._animate = function(event, data) {
		var aniName = "";
		switch (data.animationKey) {
			case AnimationKeys.PRESSBUTTON:
				aniName = _getAnimationName(thisVar.hintID, data.blobID, thisVar.bubbleType, 
					(data.blobID == "p1")? Controls.p1 : Controls.p2);
			break;
			case AnimationKeys.WAITING:
				if(thisVar.hintID == "bubblegreenBlob" && data.blobID =="p1") {
					aniName = "waitingForPlayer2";
				} else if(thisVar.hintID == "bubbleredBlob" && data.blobID =="p2") {
					aniName = "waitingForPlayer1";
				}
			break;
		}
		if(aniName != "") sprite.gotoAndPlay(aniName);
	};

	this.prototype.init();
	this.sprite = sprite;
});