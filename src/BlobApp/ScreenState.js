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
		ID, position [, state] (i.e. state is optional)

		TODO
		The state can be a complex object itself, the possible states are defined in the constants.
		For moving objects, the state contains the starting and ending points, the speed etc.
	*/
	_objects = [],

	keyState,



	init = function() {

	};


	return that;
})();