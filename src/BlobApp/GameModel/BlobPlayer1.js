BlobApp.BlobPlayer1 = (function() {
	this.prototype = new BlobApp.BlobSuperClass();
	// Manipulates the movement direction so that the blob moves to the left
	this.prototype._moveLeft = function() {
		$('body').trigger('onInputRecieved', {entity: _blobEntity, directionX: -0.5, directionY: 0});
	},

	// Manipulates the movement direction so that the blob moves to the right
	this.prototype._moveRight = function() {
		$('body').trigger('onInputRecieved',{entity: _blobEntity, directionX: 0.5, directionY: 0});
	},

	// Makes the Blob jump
	this.prototype._jump = function() {
		if(_jumpAllowed != false) {
			$('body').trigger('onInputRecievedJump',{entity: _blobEntity, directionX: 0, directionY: -6});
			_jumpAllowed = false;
		}
	},
	this.prototype._setupMovementFunctions = function() {
		_currentLeft = _moveLeft;
		_currentRight = _moveRight;
		_currentUp = _jump;
		_currentDown = _triggerSpecial;
	},

	this.prototype.init();
	//console.log(this.prototype);
});