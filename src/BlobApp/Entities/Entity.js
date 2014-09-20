/*
	This class is the superclass for all other entities. "Entities" are wrapper class for a sprite
	(and sometimes a little functionality that just fit there). Sometimes, the variables in the PhysicsHandler
	are also called entities; "entity" is really just a fancy word for "something", nothing technical, which
	is why it seemed fitting as a name for all different types of images.
___

	This explanation applies for all the EntityTypes:

	Entities always have a sprite and it usually is their own (the GenericEntity-objects all share a tilesetsheet).
	The entities can be animated by triggering specific events. Their classes usually contain lots of magic numbers. 
	They depend heavily on the images and it is impossible to generalize those values (even their width and height).
*/
BlobApp.Entity = (function Entity(x_pos, y_pos, sizeX, sizeY) {
	var thisVar = this;
	this.x_coordinate = x_pos;
	this.y_coordinate = y_pos;
	this.sizeX = sizeX;
	this.sizeY = sizeY;

	//intended for overríde
	this.init = function(){};

	this.setupSprite = function(sprite) {
		sprite.regX = Math.floor(sizeX/2);
		sprite.regY = Math.floor(sizeY/2);

		sprite.x = thisVar.x_coordinate;
		sprite.y = thisVar.y_coordinate;

		sprite.snapToPixel = false;
		sprite.mouseEnabled = false;
	};
});