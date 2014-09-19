/*
	The screen state module contains:
		- a list of all the objects on the screen
		- for all of those objects: the state they are in and what that means
		(i.e. SlingshotTrigger, player 1 ready, waiting for player 2)

		- Screen-wide values like whether or not the key has been retrieved yet,
		- if the players are dead / alive / waiting to be resurrected
		- the position and speed, starting and ending points of all moving platforms,
		- whether the doors are open, levers have been pulled
		- etc. etc.

*/

BlobApp.ScreenState = ( function() {
	var that = {},

	// Object, currentPosition (x, y), stopPositions[](x, y, waittime), movingToPosition (index of next position in stopPositions[] array)
	_movingObjects = [],

	// Object1, Object2, Status
	// e.g. lever object, door object, status
	_triggerConnections = [],

	_traps = [],

	// Nicht aufgenommen / Aufgenommen
	keyPickedUp,

	PLAYER_STATES = ["dead", "alive", "goal", "reset"],
	PLAYER_1_NAME = "p1",
	PLAYER_2_NAME = "p2",

	// Tot / Wartet auf wiederbelebung / Lebendig / fertig / wartet auf neues spiel
	player1State,
	player2State,

	init = function() {
		_listeners();

		player1State = PLAYER_STATES[1];
		player2State = PLAYER_STATES[1];

		keyPickedUp = false;

		return that;
	},

	_listeners = function() {
		$('body').on('doorOpenRequested', _onDoorOpenRequested);
	},
	
	onPlayerDead = function(player) {
		if(player == PLAYER_1_NAME) {
			player1State = PLAYER_STATES[0];
		} else {
			player2State = PLAYER_STATES[0];
		}
		console.log(player1State, player2State);
	},

	onPlayerReachGoal = function(player) {
		if(keyPickedUp){
			if(player == PLAYER_1_NAME) {
				player1State = PLAYER_STATES[2];
				$('body').trigger("playerReachedGoal", {which: "p1"});
			} else {
				player2State = PLAYER_STATES[2];
				$('body').trigger("playerReachedGoal", {which: "p2"});
			}

			if(player1State == PLAYER_STATES[2] && player2State == PLAYER_STATES[2]) {
				$("body").trigger('levelFinished');
				console.log(player1State, player2State);
			}
		}
	},

	onPlayerRequestsNewGame = function(player) {
		if(player == PLAYER_1_NAME) {
			player1State = PLAYER_STATES[3];
		} else {
			player2State = PLAYER_STATES[3];
		}

		if(player1State == PLAYER_STATES[3] && player2State == PLAYER_STATES[3]) {
			$("body").trigger('resetEverything');
		}
	},

	onPickupKey = function() {
		keyPickedUp=true;
	},

	doorCreated = function(doorNumber, buttonNumber) {
		_triggerConnections.push([doorNumber, buttonNumber]);
	},

	_onDoorOpenRequested = function(e, buttonID){
		var doorID;

		for(var i = 0,k = _triggerConnections.length; i < k; i++){
			if(_triggerConnections[i][1] == buttonID){
				doorID = _triggerConnections[i][0];
				$('body').trigger('openDoor', doorID);
				return;
			}
		}
	};

	that.onPlayerDead = onPlayerDead;
	that.onPickupKey = onPickupKey;
	that.onPlayerReachGoal = onPlayerReachGoal;
	that.doorCreated = doorCreated;
	that.onPlayerRequestsNewGame = onPlayerRequestsNewGame;
	that.init = init;

	return that;
})();