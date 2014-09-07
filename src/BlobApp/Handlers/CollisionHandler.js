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
	var keyPickedUp;

	init = function() {
		contactListener = new Box2D.Dynamics.b2ContactListener;

		_handleContacts();
		_registerListeners();

		keyPickedUp = false;
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

			if(bID === "Sphere") {
				_handleSphereCollision(bodyB, bodyA, aID, contact);
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
			$('body').trigger('buttonActivated', {userData : bodyB.GetUserData(), body: bodyB});
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
				_playerInTriggerZone("greenBlob", "heli", bodyB);
				return;

			case EntityConfig.HELISTOPTRIGGER:
				return;
			
			case EntityConfig.TELETRIGGER:
				_playerInTriggerZone("greenBlob", "tele", bodyB);
				return;

			case EntityConfig.BRIDGELEFTTRIGGER:
				_playerInTriggerZone("greenBlob", "bridgeLeft", bodyB);
				return;

			case EntityConfig.BRIDGERIGHTTRIGGER:
				_playerInTriggerZone("greenBlob", "bridgeRight", bodyB);
				return;

			case EntityConfig.SPHERETRIGGER:
				_playerInTriggerZone("greenBlob", "sphere", bodyB);
				return;

			case EntityConfig.SLINGSHOTTRIGGERLEFT:
				_playerInTriggerZone("greenBlob", "slingshotLeft", bodyB);
				return;

			case EntityConfig.SLINGSHOTTRIGGERRIGHT:
				_playerInTriggerZone("greenBlob", "slingshotRight", bodyB);
				return;

			//MenuNavigation
			case EntityConfig.NEWGAMEDOOR:
				_newGameRequested(EntityConfig.GREENBLOBID);
				return;

			case EntityConfig.CONTINUEDOOR:
				_continueRequested();
				return;

			case EntityConfig.SPIKEID:
				_playerOnSpikes("greenBlob");
			break;

			//Overworld Navigation
			case EntityConfig.LEVELDOOR:
				_levelLoadRequested("greenBlob", bodyB);
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
				_playerInTriggerZone("redBlob", "heli", bodyB);
				return;

			case EntityConfig.HELISTOPTRIGGER:
				return;
			
			case EntityConfig.TELETRIGGER:
				_playerInTriggerZone("redBlob", "tele", bodyB);
				return;
			
			case EntityConfig.BRIDGELEFTTRIGGER:
				_playerInTriggerZone("redBlob", "bridgeLeft", bodyB);
				return;

			case EntityConfig.BRIDGERIGHTTRIGGER:
				_playerInTriggerZone("redBlob", "bridgeRight", bodyB);
				return;

			case EntityConfig.SPHERETRIGGER:
				_playerInTriggerZone("redBlob", "sphere", bodyB);
				return;

			case EntityConfig.SLINGSHOTTRIGGERLEFT:
				_playerInTriggerZone("redBlob", "slingshotLeft", bodyB);
				return;

			case EntityConfig.SLINGSHOTTRIGGERRIGHT:
				_playerInTriggerZone("redBlob", "slingshotRight", bodyB);
				return;

			//MenuNavigation
			case EntityConfig.NEWGAMEDOOR:
				_newGameRequested(EntityConfig.REDBLOBID);
				return;

			case EntityConfig.CONTINUEDOOR:
				_continueRequested();
				return;

			case EntityConfig.SPIKEID:
				_playerOnSpikes("redBlob");
			break;

			//Overworld Navigation
			case EntityConfig.LEVELDOOR:
				_levelLoadRequested("redBlob", bodyB);
				return;
		}

		if(contact.m_manifold.m_localPlaneNormal.y > 0) {
			$('body').trigger('onReAllowJump', bodyA);
			// TODO put this somewhere where it belongs
			_addJuice(bodyA, 2);
		}
	},

	_playerOnSpikes = function(playerName) {
		$('body').trigger('playerOnSpikes', playerName);
	},

	_handleHeliCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELISTOPTRIGGER:
				_stopHeli();
			break;
		}

		var xVelocityBorder = 6, yVelocityBorder = 6;

		_enableCameraShaking(bodyA, xVelocityBorder, yVelocityBorder, contact);
	},

	_handleSphereCollision = function(bodyA, bodyB, bID, contact) {
		var xVelocityBorder = 6, yVelocityBorder = 5;

		_enableCameraShaking(bodyA, xVelocityBorder, yVelocityBorder, contact);
	},

	_enableCameraShaking = function(bodyA, xVelocityBorder, yVelocityBorder, contact) {
		if((contact.m_manifold.m_localPlaneNormal.x < 0 
				|| contact.m_manifold.m_localPlaneNormal.x > 0) 
			&& (bodyA.GetLinearVelocity().x > xVelocityBorder
				|| bodyA.GetLinearVelocity(bodyA).x < -xVelocityBorder)) {

			$('body').trigger('onCameraShakeRequested', {direction: "left"});
		}

		if(bodyA.GetLinearVelocity().y > yVelocityBorder || bodyA.GetLinearVelocity().y < -yVelocityBorder) {
			$('body').trigger('onCameraShakeRequested', {direction: "up"});
		}
	},

	_handleRedBlobEndCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELITRIGGER : 
			case EntityConfig.TELETRIGGER :
			case EntityConfig.BRIDGELEFTTRIGGER :
			case EntityConfig.BRIDGERIGHTTRIGGER :
			case EntityConfig.SPHERETRIGGER :
			case EntityConfig.SLINGSHOTTRIGGERLEFT :
			case EntityConfig.SLINGSHOTTRIGGERRIGHT :

				_playerLeftTriggerZone("redBlob");
			case EntityConfig.LEVELDOOR:
				_playerLeftLevelLoadTriggerZone("redBlob");
			break;
		}
	},

	_handleGreenBlobEndCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELITRIGGER : 
			case EntityConfig.TELETRIGGER :
			case EntityConfig.BRIDGELEFTTRIGGER :
			case EntityConfig.BRIDGERIGHTTRIGGER :
			case EntityConfig.SPHERETRIGGER :
			case EntityConfig.SLINGSHOTTRIGGERLEFT :
			case EntityConfig.SLINGSHOTTRIGGERRIGHT :
			
				_playerLeftTriggerZone("greenBlob");
			break;
			case EntityConfig.LEVELDOOR:
				_playerLeftLevelLoadTriggerZone("greenBlob");
			break;
		}
	},

	_playerInTriggerZone = function(player, zoneName, bodyB) {
			$('body').trigger(player+"InTriggerZone", {name: zoneName});
			_showHintBubble(bodyB, player);
	},

	_playerLeftTriggerZone = function(player) {
			$('body').trigger(player+"LeftTriggerZone");
			// removes the hint bubble.
			$('body').trigger("juiceRequested", {removeByName : ["bubble"+player]});
	},

	_attemptFinish = function(blobID) {
		if(blobID == EntityConfig.REDBLOBID) {
			$('body').trigger('blobFinishAttempt', PLAYER_ONE_NAME);
		} else if(blobID == EntityConfig.GREENBLOBID) {
			$('body').trigger('blobFinishAttempt', PLAYER_TWO_NAME);
		}
	},

	_newGameRequested = function(blobID) {
		$('body').trigger('newGameRequest', blobID);
	},

	_continueRequested = function() {
		$('body').trigger('continueRequest');
	},

	_levelLoadRequested = function(player, bodyB) {
		if(bodyB.GetUserData()[3]){
			var levelID = bodyB.GetUserData()[1];
			var overID = bodyB.GetUserData()[2];
			$('body').trigger(player+'InLevelLoadTriggerZone', {lvlID: levelID, owID: overID});
		}

		//_showHintBubble(bodyB, player);
		//$('body').trigger('levelLoadRequest', levelID);
	},

	_playerLeftLevelLoadTriggerZone = function(player) {
		$('body').trigger(player + 'LeftLevelLoadTriggerZone');
	},

	_pickUpKey = function(bodyA, bodyB) {
		if(!keyPickedUp) {
			keyPickedUp = true;
			$('body').trigger('onKeyPickedUp', {body:bodyB});
		}
	},

	_addJuice = function(bodyA, blobHeight) {
		var xPos = bodyA.m_xf.position.x,
			yPos = (blobHeight == 1)? bodyA.m_xf.position.y-+12.5/30 : bodyA.m_xf.position.y,
			width = 50,
			height = 50;
		var sprite = new BlobApp.Juice(xPos*30, yPos*30, width, height).sprite;

		$('body').trigger('juiceRequested', {sprite: sprite});
	},

	_showHintBubble = function(body, player) {
		var bubbleX = bodyB.m_xf.position.x * 30,
			bubbleY = bodyB.m_xf.position.y * 30 - 75,
			width = 100,
			height = 75;
		var bubbleID = "bubble"+player;
		var bubble = new BlobApp.HintBubble(bubbleX, bubbleY, width, height, 
			{
				bubbleType : "down",
				id : bubbleID
			});

		$('body').trigger('juiceRequested', {sprite : bubble.sprite});
	};
	
	that.init = init;
	that.getContactListener = getContactListener;

	return that;
});