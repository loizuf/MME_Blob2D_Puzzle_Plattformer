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



	/* 
		all of the elements in the array have to follow this scheme:
		ID/Key, Object

		Brauchen wir das??
	*/
	_objects = [],

	// Object, currentPosition (x, y), stopPositions[](x, y, waittime), movingToPosition (index of next position in stopPositions[] array)
	_movingObjects = [],
	// Object1, Object2, Status
	// e.g. lever object, door object, status
	_triggerConnections = [],


	// Nicht aufgenommen / Aufgenommen
	keyState,

	PLAYER_STATES = ["dead", "res_wait", "alive", "goal"];
	// Tot / Wartet auf wiederbelebung / Lebendig / fertig
	player1State,
	// Wie player1State
	player2State,


	init = function() {

	};


	return that;
})();