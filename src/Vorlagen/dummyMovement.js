	In physicsTest:


	moveLeft = function() {
		bodies[0].ApplyForce(new b2Vec2(-2, 0), bodies[0].GetPosition());

	},

	moveRight = function() {
		bodies[0].ApplyForce(new b2Vec2(2, 0), bodies[0].GetPosition());
	};

		that.moveLeft = moveLeft;
	that.moveRight = moveRight;


Im Controller:

	switch(e.keyCode) {
			 //       p2Jump : 38,
      //  p2Left : 37,
     //   p2Right : 39,
      //  p2Trigger : 40 

      		case 37: 
	      		_moveEntityLeft(); 
	      		break;
      		case 39: 
      			_moveEntityRight(); 
      			break;
      		default: entityTest.spawn();
		}



		_moveEntityLeft = function() {
		physicsTest.moveLeft();
	},

	_moveEntityRight = function() {
		physicsTest.moveRight();
	},