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

	PLAYER_STATES = ["dead", "alive", "goal"],
	PLAYER_1_NAME = "p1",
	PLAYER_2_NAME = "p2",
	// Tot / Wartet auf wiederbelebung / Lebendig / fertig
	player1State,
	// Wie player1State
	player2State,


	init = function() {
		player1State = PLAYER_STATES[1];
		player2State = PLAYER_STATES[1];
		keyPickedUp = false;
	},

	onPlayerDead = function(player) {
		if(player == PLAYER_1_NAME) {
			player1State = PLAYER_STATES[0];
		} else {
			player2Sate = PLAYER_STATES[0];
		}
	},

	onPlayerReachGoal = function(player) {
		if(player == PLAYER_1_NAME) {
			player1State = PLAYER_STATES[2];
		} else {
			player2State = PLAYER_STATES[2];
		}

		if(player1State == PLAYER_STATES[2] && player2State == PLAYER_STATES[2]) {
			// trigger success
		}
	},


	onPickupKey = function() {
		keyPickedUp=true;
	};


	return that;
})();