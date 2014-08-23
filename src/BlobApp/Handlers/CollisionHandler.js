BlobApp.CollisionHandler = (function() {
	var that = {};

	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	var contactListener;

	init = function() {
		contactListener = new Box2D.Dynamics.b2ContactListener;

		_handleContacts();
		_registerListeners();
	},

	getContactListener = function() {
		return contactListener;
	},

	_registerListeners = function() {

	},

	_handleContacts = function() {
		contactListener.BeginContact = function(contact) {
			aID = contact.GetFixtureA().GetBody().GetUserData()[0];
			bID = contact.GetFixtureB().GetBody().GetUserData()[0];

			bodyA = contact.GetFixtureA().GetBody();
			bodyB = contact.GetFixtureB().GetBody();

			switch(aID){
				case EntityConfig.GREENBLOBID: 
					_handleGreenBlobCollision(bodyA,bodyB, bID, contact);
				break;

				case EntityConfig.REDBLOBID: 
					_handleRedBlobCollision(bodyA,bodyB, bID, contact);
				break;
				case "Heli":
					_handleHeliCollision(bodyA, bodyB, bID, contact);
				break;
			} 
		},

		contactListener.EndContact = function(contact) {
			aID = contact.GetFixtureA().GetBody().GetUserData()[0];
			bID = contact.GetFixtureB().GetBody().GetUserData()[0];

			bodyA = contact.GetFixtureA().GetBody();
			bodyB = contact.GetFixtureB().GetBody();

			switch(aID){
				case EntityConfig.GREENBLOBID: 
					_handleGreenBlobEndCollision(bodyA,bodyB, bID, contact);
				break;
				case EntityConfig.REDBLOBID: 
					_handleRedBlobEndCollision(bodyA,bodyB, bID, contact);
				break;
			} 

		};
	},

	_handleButtonCollison = function(bodyB, contact) {
		var buttonID = bodyB.GetUserData()[1];

		if(contact.m_manifold.m_localPlaneNormal.y > 0) {
			$('body').trigger('doorOpenRequested', buttonID);
		}
	},

	_handleGreenBlobCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID){
			case EntityConfig.REDBLOBID:
			break;

			case EntityConfig.VERTICALBORDERID:
			break;		

			case EntityConfig.HORIZONTALBORDERID:	
			break;			

			case EntityConfig.BUTTONID:
				_handleButtonCollison(bodyB, contact);
			break;
			
			case EntityConfig.KEYID:
				_pickUpKey(bodyA, bodyB);
				return;
			
			case EntityConfig.GOALID:
				_attemptFinish(EntityConfig.GREENBLOBID);
				return;
			
			case EntityConfig.HELITRIGGER:
				_playerInTriggerZone("greenBlob", "heli");
				return;
			
			case EntityConfig.TELETRIGGER:
				_playerInTriggerZone("greenBlob", "tele");
				return;

			case EntityConfig.BRIDGELEFTTRIGGER:
				_playerInTriggerZone("greenBlob", "bridgeLeft");
				return;

			case EntityConfig.BRIDGERIGHTTRIGGER:
				_playerInTriggerZone("greenBlob", "bridgeRight");
				return;

			case EntityConfig.SPHERETRIGGER:
				_playerInTriggerZone("greenBlob", "sphere");
				return;
		}

		if(contact.m_manifold.m_localPlaneNormal.y > 0) {
			$('body').trigger('onReAllowJump', bodyA);
			// TODO put this somewhere where it belongs
			_addJuice(bodyA, 1);
		}
	},

	_handleRedBlobCollision = function(bodyA,bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.GREENBLOBID:							
				if(contact.m_manifold.m_localPlaneNormal.y > 0) {
					y = contact.m_fixtureA.m_body.GetLinearVelocity().y;					
					$('body').trigger("onTrampolinContact", {body: bodyA, yVel: y});
					
				}
			break;

			case EntityConfig.VERTICALBORDERID:
			break;

			case EntityConfig.HORIZONTALBORDERID:
			break;

			case EntityConfig.BUTTONID:
				_handleButtonCollison(bodyB, contact);
			break;

			case EntityConfig.KEYID:
				_pickUpKey(bodyA, bodyB);
				return;		

			case EntityConfig.GOALID:
				_attemptFinish(EntityConfig.REDBLOBID);
				return;
			
			case EntityConfig.HELITRIGGER:
				_playerInTriggerZone("redBlob", "heli");
				return;
			
			case EntityConfig.TELETRIGGER:
				_playerInTriggerZone("redBlob", "tele");
				return;
			
			case EntityConfig.BRIDGELEFTTRIGGER:
				_playerInTriggerZone("redBlob", "bridgeLeft");
				return;

			case EntityConfig.BRIDGERIGHTTRIGGER:
				_playerInTriggerZone("redBlob", "bridgeRight");
				return;

			case EntityConfig.SPHERETRIGGER:
				_playerInTriggerZone("redBlob", "sphere");
				return;
		}

		if(contact.m_manifold.m_localPlaneNormal.y > 0) {
			$('body').trigger('onReAllowJump', bodyA);
			// TODO put this somewhere where it belongs
			_addJuice(bodyA, 2);
		}
	},

	_handleHeliCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELISTOPTRIGGER:
				_stopHeli();
			break;
		}
	},

	_handleRedBlobEndCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELITRIGGER : 
			case EntityConfig.TELETRIGGER :
				_playerLeftTriggerZone("redBlob");
			break;
		}
	},

	_handleGreenBlobEndCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELITRIGGER : 
			case EntityConfig.TELETRIGGER :
				_playerLeftTriggerZone("greenBlob");
			break;
		}
	},

	_playerInTriggerZone = function(player, zoneName) {
			$('body').trigger(player+"InTriggerZone", {name: zoneName});
	},

	_playerLeftTriggerZone = function(player) {
			$('body').trigger(player+"LeftTriggerZone");
	},

	_attemptFinish = function(blobID) {
		if(blobID == EntityConfig.REDBLOBID) {
			$('body').trigger('blobFinishAttempt', PLAYER_ONE_NAME);
		} else if(blobID == EntityConfig.GREENBLOBID) {
			$('body').trigger('blobFinishAttempt', PLAYER_TWO_NAME);
		}
	},

	_pickUpKey = function(bodyA, bodyB) {
		$('body').trigger("onKeyPickedUp", {body:bodyB});
	},

	_addJuice = function(bodyA, blobHeight) {
		var xPos = bodyA.m_xf.position.x,
			yPos = (blobHeight == 1)? bodyA.m_xf.position.y : bodyA.m_xf.position.y+12.5/30,
			width = 25,
			height = 25;
		var sprite = new BlobApp.Juice(xPos*30, yPos*30, width, height).sprite;

		$('body').trigger('juiceRequested', {sprite: sprite});
	};
	
	that.init = init;
	that.getContactListener = getContactListener;

	return that;
});