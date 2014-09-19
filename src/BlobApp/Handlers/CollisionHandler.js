// This was removed from the physics handler because the physics handler became too "big"
// It is essentially a wrapper class for the b2ContactListener and not a module.
BlobApp.CollisionHandler = (function() {
	var that = {};
	var private = {};

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

	this.init = function() {
		contactListener = new Box2D.Dynamics.b2ContactListener;

		private._handleContacts();

		keyPickedUp = false;
	},

	this.getContactListener = function() {
		return contactListener;
	},

	/*	ALl of the functionality in this class has its start in here. */
	private._handleContacts = function() {
		contactListener.BeginContact = function(contact) {
			aID = contact.GetFixtureA().GetBody().GetUserData()[0];
			bID = contact.GetFixtureB().GetBody().GetUserData()[0];

			bodyA = contact.GetFixtureA().GetBody();
			bodyB = contact.GetFixtureB().GetBody();

			switch(aID){
				case EntityConfig.GREENBLOBID: 
					private._handleGreenBlobCollision(bodyA,bodyB, bID, contact);
				break;

				case EntityConfig.REDBLOBID: 
					private._handleRedBlobCollision(bodyA,bodyB, bID, contact);
				break;

				case "Heli":
					private._handleHeliCollision(bodyA, bodyB, bID, contact);
				break;
			} 

			// For whatever reason, the sphere is not the first object in a contact (usually, it should be the one that's moving, i.e. the sphere.)
			if(bID === "Sphere") {
				private._handleSphereCollision(bodyB, bodyA, aID, contact);
			}
		},

		contactListener.EndContact = function(contact) {

			aID = contact.GetFixtureA().GetBody().GetUserData()[0];
			bID = contact.GetFixtureB().GetBody().GetUserData()[0];

			bodyA = contact.GetFixtureA().GetBody();
			bodyB = contact.GetFixtureB().GetBody();

			switch(aID){
				case EntityConfig.GREENBLOBID: 
					private._handleGreenBlobEndCollision(bodyA,bodyB, bID, contact);
				break;
				case EntityConfig.REDBLOBID: 
					private._handleRedBlobEndCollision(bodyA,bodyB, bID, contact);
				break;
				case "Heli":
					private._handleHeliCollisionEnd(bodyA, bodyB, bID, contact);
				break;
			} 

			if(bID === "Sphere") {
				private._handleSphereCollisionEnd(bodyB, bodyA, aID, contact);
			}
		};
	},

	/* called when the green blob touches something. */
	private._handleGreenBlobCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID){
			case EntityConfig.BUTTONID:
				private._handleButtonCollison(bodyB, contact);
			break;
			
			case EntityConfig.KEYID:
				private._pickUpKey(bodyA, bodyB);
			return;
			
			case EntityConfig.GOALID:
				private._attemptFinish(EntityConfig.GREENBLOBID);
			return;
			
			case EntityConfig.HELITRIGGER:
				private._playerInTriggerZone("greenBlob", "heli", bodyB);
			return;
			
			case EntityConfig.HELISTOPTRIGGER:
				return;

			case EntityConfig.TELETRIGGER:
				private._playerInTriggerZone("greenBlob", "tele", bodyB);
			return;

			case EntityConfig.BRIDGELEFTTRIGGER:
				private._playerInTriggerZone("greenBlob", "bridgeLeft", bodyB);
			return;

			case EntityConfig.BRIDGERIGHTTRIGGER:
				private._playerInTriggerZone("greenBlob", "bridgeRight", bodyB);
			return;

			case EntityConfig.SPHERETRIGGER:
				private._playerInTriggerZone("greenBlob", "sphere", bodyB);
			return;

			case EntityConfig.SLINGSHOTTRIGGERLEFT:
				private._playerInTriggerZone("greenBlob", "slingshotLeft", bodyB);
			return;

			case EntityConfig.SLINGSHOTTRIGGERRIGHT:
				private._playerInTriggerZone("greenBlob", "slingshotRight", bodyB);
			return;

			case EntityConfig.MOVINGGROUNDID:
				if(contact.m_manifold.m_localPlaneNormal.y > 0) {
					private._movingGroundEntered(bodyA,bodyB,true);
				}

			break;

			case EntityConfig.SPIKEID:
				private._playerOnSpikes("greenBlob");
			break;

			//MenuNavigation
			case EntityConfig.NEWGAMEDOOR:
			case EntityConfig.CONTINUEDOOR:
				private._playerInMenuDoorZone("greenBlob", bodyB);
			return;

			//Overworld Navigation
			case EntityConfig.LEVELDOOR:
				private._playerEnteredLevelLoadZone("greenBlob", bodyB);
			return;
		}

		if(contact.m_manifold.m_localPlaneNormal.y > 0) {
			$('body').trigger('onReAllowJump', bodyA);
			private._addJuice(bodyA, 1);
		}
	},

	/*	called when the red blob touches something. */
	private._handleRedBlobCollision = function(bodyA,bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.GREENBLOBID:							
				if(contact.m_manifold.m_localPlaneNormal.y > 0) {
					y = contact.m_fixtureA.m_body.GetLinearVelocity().y;					
					$('body').trigger("onTrampolinContact", {body: bodyA, yVel: y});	
					return;
				}
			break;

			case EntityConfig.VERTICALBORDERID:
			break;

			case EntityConfig.HORIZONTALBORDERID:
			break;

			case EntityConfig.BUTTONID:
				private._handleButtonCollison(bodyB, contact);
			break;

			case EntityConfig.KEYID:
				private._pickUpKey(bodyA, bodyB);
				return;

			case EntityConfig.GOALID:
				private._attemptFinish(EntityConfig.REDBLOBID);
				return;
			
			case EntityConfig.HELITRIGGER:
				private._playerInTriggerZone("redBlob", "heli", bodyB);
				return;

			case EntityConfig.HELISTOPTRIGGER:
				return;
			
			case EntityConfig.TELETRIGGER:
				private._playerInTriggerZone("redBlob", "tele", bodyB);
				return;
			
			case EntityConfig.BRIDGELEFTTRIGGER:
				private._playerInTriggerZone("redBlob", "bridgeLeft", bodyB);
				return;

			case EntityConfig.BRIDGERIGHTTRIGGER:
				private._playerInTriggerZone("redBlob", "bridgeRight", bodyB);
				return;

			case EntityConfig.SPHERETRIGGER:
				private._playerInTriggerZone("redBlob", "sphere", bodyB);
				return;

			case EntityConfig.SLINGSHOTTRIGGERLEFT:
				private._playerInTriggerZone("redBlob", "slingshotLeft", bodyB);
				return;

			case EntityConfig.SLINGSHOTTRIGGERRIGHT:
				private._playerInTriggerZone("redBlob", "slingshotRight", bodyB);
				return;

			case EntityConfig.MOVINGGROUNDID:
				if(contact.m_manifold.m_localPlaneNormal.y > 0) {
					private._movingGroundEntered(bodyA,bodyB,true);
				}
				break;

			case EntityConfig.SPIKEID:
				private._playerOnSpikes("redBlob");
			break;

			//MenuNavigation
			case EntityConfig.NEWGAMEDOOR:
			case EntityConfig.CONTINUEDOOR:
				private._playerInMenuDoorZone("redBlob", bodyB);
				return;

			//Overworld Navigation
			case EntityConfig.LEVELDOOR:
				private._playerEnteredLevelLoadZone("redBlob", bodyB);
				return;
		}

		if(contact.m_manifold.m_localPlaneNormal.y > 0) {
			$('body').trigger('onReAllowJump', bodyA);
			private._addJuice(bodyA, 2);
		}
	},

	/* called when the green blob stops touching something. */
	private._handleGreenBlobEndCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELITRIGGER : 
			case EntityConfig.TELETRIGGER :
			case EntityConfig.BRIDGELEFTTRIGGER :
			case EntityConfig.BRIDGERIGHTTRIGGER :
			case EntityConfig.SPHERETRIGGER :
			case EntityConfig.SLINGSHOTTRIGGERLEFT :
			case EntityConfig.SLINGSHOTTRIGGERRIGHT :
			
				private._playerLeftTriggerZone("greenBlob", bodyB);
			break;

			case EntityConfig.LEVELDOOR:
				private._playerLeftLevelLoadTriggerZone("greenBlob");
			break;

			case EntityConfig.NEWGAMEDOOR:
			case EntityConfig.CONTINUEDOOR:
				private._playerLeftMenuDoorZone("greenBlob");
			break;

			case EntityConfig.MOVINGGROUNDID:
				if(contact.m_manifold.m_localPlaneNormal.y > 0) {
					private._movingGroundEntered(bodyA,bodyB,false);
				}

			break;
		}
	},

	/* called when the red blob stops touching something. */
	private._handleRedBlobEndCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELITRIGGER : 
			case EntityConfig.TELETRIGGER :
			case EntityConfig.BRIDGELEFTTRIGGER :
			case EntityConfig.BRIDGERIGHTTRIGGER :
			case EntityConfig.SPHERETRIGGER :
			case EntityConfig.SLINGSHOTTRIGGERLEFT :
			case EntityConfig.SLINGSHOTTRIGGERRIGHT :

				private._playerLeftTriggerZone("redBlob", bodyB);
			break;

			case EntityConfig.LEVELDOOR:
				private._playerLeftLevelLoadTriggerZone("redBlob");
			break;

			case EntityConfig.NEWGAMEDOOR:
			case EntityConfig.CONTINUEDOOR:
				private._playerLeftMenuDoorZone("greenBlob");
			break;

			case EntityConfig.MOVINGGROUNDID:
				if(contact.m_manifold.m_localPlaneNormal.y > 0) {
					private._movingGroundEntered(bodyA,bodyB,false);
				}
			return;
		}
	},

	/* called when the heli touches something. */
	private._handleHeliCollision = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.HELISTOPTRIGGER:
				private._stopHeli();
			break;

			case EntityConfig.MOVINGGROUNDID:
				if(contact.m_manifold.m_localPlaneNormal.y > 0) {
					private._movingGroundEntered(bodyA,bodyB,true);
				}
			break;

			case EntityConfig.SPIKEID:
				private._playerOnSpikes("heli");
			break;

			case EntityConfig.KEYID:
				private._pickUpKey(bodyA, bodyB);
			break;
		}

		var xVelocityBorder = 6, yVelocityBorder = 6;

		private._enableCameraShaking(bodyA, xVelocityBorder, yVelocityBorder, contact);
	},

	/* called when the sphere touches something. */
	private._handleSphereCollision = function(bodyA, bodyB, bID, contact) {
		var xVelocityBorder = 6, yVelocityBorder = 5;

		private._enableCameraShaking(bodyA, xVelocityBorder, yVelocityBorder, contact);
		
		switch(bID) {
			case EntityConfig.MOVINGGROUNDID:
				if(contact.m_manifold.m_localPlaneNormal.y > 0) {
					private._movingGroundEntered(bodyA,bodyB,true);
				}
			break;

			case EntityConfig.KEYID:
				private._pickUpKey(bodyA, bodyB);
			break;

			case EntityConfig.BUTTONID:
				private._handleButtonCollison(bodyB, contact);
			break;
		}
	},

	/* called when the heli stops touching something. */
	private._handleHeliCollisionEnd = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.MOVINGGROUNDID:
				private._movingGroundEntered(bodyA,bodyB,false);	
			break;
		}
	},

	/* called when the sphere stops touching something. */
	private._handleSphereCollisionEnd = function(bodyA, bodyB, bID, contact) {
		switch(bID) {
			case EntityConfig.MOVINGGROUNDID:
				private._movingGroundEntered(bodyA,bodyB,false);
			break;
		}
	},

	/* Triggers events that open a door and "destroys" the button */
	private._handleButtonCollison = function(bodyB, contact) {
		var buttonID = bodyB.GetUserData()[1];
		var contactDirection = contact.m_manifold.m_localPlaneNormal.y;
		
		if(contact.m_fixtureB.m_body.GetUserData()[0] == "Sphere"){
			contactDirection = -contactDirection;
		}

		if(contactDirection > 0) {
			$('body').trigger('doorOpenRequested', buttonID);
			$('body').trigger('buttonActivated', {userData : bodyB.GetUserData(), body: bodyB});
		}
	},

	/* Triggers an event that kills a player */
	private._playerOnSpikes = function(playerName) {
		if (playerName == "greenBlob") {
			$('body').trigger("blobanimationChanged", {blobID: EntityConfig.GREENBLOBID, animationKey: AnimationKeys.DEATH});
		} else {
			$('body').trigger("blobanimationChanged", {blobID: EntityConfig.REDBLOBID, animationKey: AnimationKeys.DEATH});
		}

		$('body').trigger('playerOnSpikes', playerName);
		$('body').trigger('disableAllMovements');
		$('body').trigger('unbindForces', playerName);
	},

	/* If the speed of the bodies involved was high enough, this triggers events that shake the screen */
	private._enableCameraShaking = function(bodyA, xVelocityBorder, yVelocityBorder, contact) {
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

	/* Triggers events that make the blobs behave differently when the "action button"/down key is pressed. Also some visualisation. */
	private._playerInTriggerZone = function(player, zoneName, bodyB) {
			$('body').trigger(player+"InTriggerZone", {name: zoneName, triggerID: bodyB.GetUserData()[1]});
			$('body').trigger("coopTriggerAnimationChanged", {animationKey: AnimationKeys.BIGSHINE, name: zoneName, triggerID: bodyB.GetUserData()});
			
			private._showHintBubble(bodyB, player, "down");
	},

	/* Triggers events that reset what happens when the down key is pressed. Also some visualisation. */
	private._playerLeftTriggerZone = function(player, bodyB) {
			$('body').trigger(player+"LeftTriggerZone");			
			$('body').trigger("coopTriggerAnimationChanged", {animationKey: AnimationKeys.SMALLSHINE, triggerID: bodyB.GetUserData()});
			// removes the hint bubble.
			var messageToView = {
				generic: false,
				remove: ["bubble"+player]
			};

			$('body').trigger("requestViewEntity", messageToView);
	},

	/* Called when the players reach the goal. */
	private._attemptFinish = function(blobID) {
		if(blobID == EntityConfig.REDBLOBID) {
			$('body').trigger('blobFinishAttempt', PLAYER_ONE_NAME);
		} else if(blobID == EntityConfig.GREENBLOBID) {
			$('body').trigger('blobFinishAttempt', PLAYER_TWO_NAME);
		}
	},

	/* Starts a new game. */
	private._newGameRequested = function(blobID) {
		$('body').trigger('newGameRequest', blobID);
	},

	/* Continues from the saved state. */
	private._continueRequested = function() {
		$('body').trigger('continueRequest');
	},

	/* Overrides what happens when the "up" key is pressed (the level will be laoded) */
	private._playerEnteredLevelLoadZone = function(player, bodyB) {
		if(bodyB.GetUserData()[3]){
			var levelID = bodyB.GetUserData()[1];
			var overID = bodyB.GetUserData()[2];
			
			$('body').trigger(player+'InLevelLoadTriggerZone', {lvlID: levelID, owID: overID});
			
			private._showHintBubble(bodyB, player, "up");
		}
	},

	/* Resets what happens when the "up" key is pressed. (the blob will jump) */
	private._playerLeftLevelLoadTriggerZone = function(player) {
		$('body').trigger(player + 'LeftLevelLoadTriggerZone');
		
		var messageToView = {
				generic: false,
				remove: ["bubble"+player]
			};

		$('body').trigger("requestViewEntity", messageToView);
	},

	private._playerInMenuDoorZone = function(player, bodyB){
		var doorType = bodyB.GetUserData()[0];
		$('body').trigger(player+'InMenuDoorZone', doorType);
	},

	private._playerLeftMenuDoorZone = function(player, bodyB) {
		$('body').trigger(player + 'LeftMenuDoorZone');
	},

	/* Triggers events that make the players pick up the key. */
	private._pickUpKey = function(bodyA, bodyB) {
		if(!keyPickedUp) {
			keyPickedUp = true;
			$('body').trigger('onKeyPickedUp', {body:bodyB});
			$('body').trigger("animateGoal", {animationKey: AnimationKeys.UNLOCK});

			var messageToView = {
				generic: false,
				remove: ["key"]
			};

			$('body').trigger("requestViewEntity", messageToView);
		}
	},

	/* Juice = dust :) */
	private._addJuice = function(bodyA, blobHeight) {
		var messageToView = {
			generic: false,
			x: bodyA.m_xf.position.x * 30,
			y: ((blobHeight == 1) ? bodyA.m_xf.position.y - 12.5 / 30 : bodyA.m_xf.position.y) * 30,
			entityID: "Juice"
		};

		$('body').trigger("requestViewEntity", messageToView);
	},

	private._showHintBubble = function(body, player, type) {
		var messageToView = {
			generic: false,
			x: bodyB.m_xf.position.x * 30,
			y: bodyB.m_xf.position.y * 30 - 75,
			entityID: "Bubble",
			bubbleInfo : {
				bubbleType : type,
				id : "bubble" + player
			}
		};

		$('body').trigger("requestViewEntity", messageToView);
	},

	private._movingGroundEntered = function(bodyA, bodyB, entered){
		if(entered){
			$('body').trigger("entityLandedOnMe",{cont:[bodyB.GetUserData()[1],bodyA]});
		}else{
			$('body').trigger("entityLeftMe",{cont:[bodyB.GetUserData()[1],bodyA]});
		}
	},

	private._stopHeli = function() {
		$('body').trigger('heliAnimationChanged', {"animationKey" : AnimationKeys.STOP});
	};

	return this;
});