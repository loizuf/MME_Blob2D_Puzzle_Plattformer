/*
	The PhysicsHandler is one of the most important modules in this application.
	It creates all the boxes and is responsible for most of the movement.
	Therefore, it often needs to be aware of what is going on in the game.
*/
BlobApp.PhysicsHandler = (function() {
	var that = {},

		isResetted = false;

	SCALE = 30, STEP = 20, TIMESTEP = 1/20,
	PLAYER_ONE_NAME = "p1", PLAYER_TWO_NAME="p2",
	GROWTH_FACTOR = 0.1, STRETCH_HEIGHT = 4, TRAMPOLIN_WIDTH = 2;
	
	// box2d variables
	var	b2Vec2 = Box2D.Common.Math.b2Vec2,
		b2BodyDef = Box2D.Dynamics.b2BodyDef,
		b2Body = Box2D.Dynamics.b2Body,
		b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
		b2Fixture = Box2D.Dynamics.b2Fixture,
		b2World = Box2D.Dynamics.b2World,
		b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
		b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
		world,

	// For updating
		lastTimestamp = Date.now(),
		fixedTimestepAccumulator = 0,
	
	// Helper arrays
		bodiesToRemove = [],
		actors = [],
		bodies =[],

	// Tile and blob dimensions
		TILESIZEX = 12.5,
		TILESIZEY = 12.5,
		stretchSize = 2,
		trampolinSize = 1,

	// Variables for the special skills
		isTrampolinActive = false,
		isStretchActive = false,
		bridgeIsActive = false,	bridgeBody = undefined,	bridgeStart = undefined, bridgeClimbDirection = undefined,
		heliIsActive = false, heliBody = undefined,
		sphereIsActive = false,	sphereBody = undefined,

	init = function(){		
		_setupPhysics();
		_registerListener();

		return that;
	},

	// destroys all bodies
	_resetGame = function() {
		var bodyList = world.GetBodyList();

		while(bodyList!=null){
			var tmpBody = bodyList.GetNext();
			bodiesToRemove.push(bodyList);
			bodyList = tmpBody;
		}

		bodies.length = 0;
		actors.length = 0;


		$('body').trigger('onResetGame');
	},

	/* box2d (and debug view) initialization */
	_setupPhysics = function() {
		var debugDraw = new b2DebugDraw();

        debugDraw.SetSprite(document.getElementById("gameCanvas").getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);        

		world = new b2World(new b2Vec2(0, 10), true);
		world.SetDebugDraw(debugDraw);

		bodies.length = 0; // 'bodies' and 'actors' are two arrays we create, and even bodies that box2d
		actors.length = 0; // has already destroyed can still be in those arrays. They need to be emptied "by hand".
	},

	/* called from the MainController after loading is finished; connects the view and the physics */
	createActors = function(actorObjects) {
		for(var i = 0; i < actorObjects.length; i++) {
			var newActor = new _actorObject(actorObjects[i].body, actorObjects[i].sprite);
			actors.push(newActor);
		}
	},

	/* must be called in order to connect the view sprites and the bodies */
	getBodies = function() {
		return bodies;
	},

	// creates a static box at the specified position and dimensions.
	createDefaultBoxEntity = function(x, y, width, height, sensor) {
		var fixture = createDefaultBoxFixture(width, height, sensor);
		var bodyDef = new b2BodyDef;

		bodyDef.type = b2Body.b2_staticBody;
		bodyDef.position.x = x;
		bodyDef.position.y = y;

		var entity = world.CreateBody(bodyDef);
		entity.CreateFixture(fixture);

		return entity;
	},

	// creates a dynamic box at the specified position and dimensions.
	createDynamicBoxEntity = function(x, y, width, height, sensor) {
		var fixture = createDefaultBoxFixture(width, height, sensor);
		var bodyDef = new b2BodyDef;

		bodyDef.type = b2Body.b2_staticBody;
		bodyDef.position.x = x;
		bodyDef.position.y = y;

		var entity = world.CreateBody(bodyDef);
		entity.CreateFixture(fixture);

		return entity;
	},

	// creates a fixture with the specified dimensions.
	createDefaultBoxFixture = function(width, height, sensor) {
		var fixture = new b2FixtureDef;

		fixture.density = 1;
		fixture.restitution = 0;
		fixture.friction = 0.1;

		if(sensor) {
			fixture.isSensor = true;
		}

		fixture.shape = new b2PolygonShape;
		fixture.shape.SetAsBox(width, height);

		return fixture;
	},

	/*das muss vom levelloader aufgerufen werden!*/
	applyEntity = function(event, data) {
		userData = data["userData"];
		entityID = userData[0];

		var x = (data.x) / SCALE,
			y = (data.y) / SCALE,
			width = data.width / SCALE,
			height = data.height / SCALE;

		if(entityID==EntityConfig.MOVINGGROUNDID){
			var entity = createDynamicBoxEntity(x, y, width, height);
		}else{
			var entity = createDefaultBoxEntity(x, y, width, height);
		}
		
		entity.SetUserData(userData);  
				
		bodies.push(entity); 

		if(entityID == EntityConfig.MOVINGGROUNDID){
			dat = {"cont" : [data.num,entity]}
			$('body').trigger('onMovingGroundCreated',dat);
		}	
	},

	applyBlobEntity = function(event, data) {
		userData = data["userData"][0];

		var width = (data.width - 2) / SCALE / 2,
			height = (data.height - 3) / SCALE / 2;
		if(data.height > 20) data.height = 21;

		var fixture = createDefaultBoxFixture(width, height);
		var bodyDef = new b2BodyDef;

		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = (data.x) / SCALE;
		bodyDef.position.y = (data.y) / SCALE;
		bodyDef.fixedRotation = true;

		var entity = world.CreateBody(bodyDef);

		entity.CreateFixture(fixture);

		entity.SetUserData([userData,undefined]);
		
		var blobEntityCreated = $.Event('blobEntityCreated');

		$("body").trigger(blobEntityCreated, entity);

		bodies.push(entity); 	
	},

	/* 
		Called periodically (for every onTick)
		However, it might update the bodies more than once, depending on how much time has passed.
	*/
	update = function() {
		var now = Date.now();
		var dt = now - lastTimestamp;

		fixedTimestepAccumulator += dt;
		lastTimestamp = now;

		for(var i = 0; i < bodiesToRemove.length; i++) {
			world.DestroyBody(bodiesToRemove[i]);
		}

		bodiesToRemove.length = 0;

		while(fixedTimestepAccumulator >= STEP) {		
			if(heliBody != undefined) { // This means that the heli has basically much lighter gravity.
				heliBody.ApplyForce( new b2Vec2(0, -8.5 * heliBody.GetMass()), heliBody.GetPosition());
			}

			for(var i = 0, l = actors.length; i < l; i++) {
				actors[i].update();
			}

			fixedTimestepAccumulator -= STEP;

			world.Step(TIMESTEP, 10, 10);
			world.ClearForces();
   			world.DrawDebugData();
		}	

		if(isTrampolinActive == true) {
			_handleGreenBlobGrowth();
		} else {
			_handleGreenBlobShrinking();
		}

		if(isStretchActive == true) {
			_handleRedBlobGrowth();
		} else {
			_handleRedBlobShrinking();
			
		}
	},

	// Trampolin abolity body stretching
	_handleGreenBlobGrowth = function() {
		var greenBlobEntity = _getBody(EntityConfig.GREENBLOBID);
		if(greenBlobEntity == undefined) return;

		if(trampolinSize <= TRAMPOLIN_WIDTH) {
			var fixture = createDefaultBoxFixture(trampolinSize * (TILESIZEX - 1) / SCALE, (TILESIZEY - 1) / SCALE);

			greenBlobEntity.DestroyFixture(greenBlobEntity.GetFixtureList());
			greenBlobEntity.CreateFixture(fixture);	

			trampolinSize += GROWTH_FACTOR;
		}
	},

	// Trampolin ability body shrinking
	_handleGreenBlobShrinking = function() {
		var greenBlobEntity = _getBody(EntityConfig.GREENBLOBID);

		if(trampolinSize >= 1 && greenBlobEntity != undefined) {
			var fixture = createDefaultBoxFixture(trampolinSize * (TILESIZEX - 1) / SCALE, (TILESIZEY - 1) / SCALE);

			greenBlobEntity.DestroyFixture(greenBlobEntity.GetFixtureList());
			greenBlobEntity.CreateFixture(fixture);

			trampolinSize -= GROWTH_FACTOR;
		}
	},

	// Stretch ability body stretching
	_handleRedBlobGrowth = function() {
		var redBlobEntity = _getBody(EntityConfig.REDBLOBID);
		if(redBlobEntity == undefined) return;

		if(stretchSize <= STRETCH_HEIGHT) {
			var fixture = createDefaultBoxFixture((TILESIZEX - 1) / SCALE, stretchSize * (TILESIZEY - 1) / SCALE);

			redBlobEntity.DestroyFixture(redBlobEntity.GetFixtureList());
			redBlobEntity.CreateFixture(fixture);

			stretchSize += GROWTH_FACTOR;
		}
	},

	// Stretch ability body shrinking
	_handleRedBlobShrinking = function() {
		var redBlobEntity = _getBody(EntityConfig.REDBLOBID);

		if(stretchSize >= 2 && redBlobEntity != undefined) {
			var fixture = createDefaultBoxFixture((TILESIZEX - 1) / SCALE, stretchSize * (TILESIZEY - 1) / SCALE);

			redBlobEntity.DestroyFixture(redBlobEntity.GetFixtureList());
			redBlobEntity.CreateFixture(fixture);

			stretchSize -= GROWTH_FACTOR;
		}
	},

	// Helper method, finds a body with the specified userData (returns undefined if there is no such body)
	_getBody = function(userData) {
		var body = undefined;
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == userData) {
				body = bodies[i];
				break;
			}
		}
		return body;
	},

	/* For blob movement */
	_applyForce = function(event, direction) {
		var entity = direction.entity;
		if((entity.m_linearVelocity.x > -3) && (entity.m_linearVelocity.x < 3)) {
			entity.ApplyImpulse(new b2Vec2(direction.directionX, 
				direction.directionY), entity.GetPosition());
		}
	},

	/* For blob jumps */
	_applyForceJump = function(event, direction) {
			var entity = direction.entity;
			entity.ApplyImpulse(new b2Vec2(direction.directionX, direction.directionY), entity.GetPosition());
	},

	/* 
		Very similar to _applyEntity, except this one creates a sensor body.
		A sensor is a body that will register when it is touched, but not have an actual collison.
	*/
	_applySensor = function(event, data) {
		var x = (data.x) / SCALE,
			y = (data.y) / SCALE,
			width = (data.width) / SCALE,
			height = (data.height) / SCALE;

		var entity = createDefaultBoxEntity(x, y, width, height, true);		

		entity.SetUserData(data.userData);
	},

	/*
		The actor object "class":
		Actor objects connect the body to a sprite and can be drawn on the canvas.
	*/
	_actorObject = function(body, skin) {
		this.body = body;
		this.skin = skin;
		this.update = function() {
			this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
			this.skin.x = (this.body.GetWorldCenter().x * SCALE);
			this.skin.y = (this.body.GetWorldCenter().y * SCALE);
		}
		actors.push(this);
	},

	/* Heli initialization. */
	_initHeli = function() {
		if(heliIsActive) return; // That shouldn't even be possible, but better safe than sorry.
		
		var greenBlobEntity = _getBody(EntityConfig.GREENBLOBID),
		 	x = greenBlobEntity.m_xf.position.x,
		 	y = greenBlobEntity.m_xf.position.y,
			
		messageToView = {
			generic: false,
			x: x * SCALE,
			y: y * SCALE - 15,
			entityID: "Heli",
			remove: ["blobGreen", "blobRed"]
		};
		$('body').trigger("requestViewEntity", messageToView);

		heliIsActive = true;

		greenBlobEntity.DestroyFixture(greenBlobEntity.GetFixtureList());
		redBlobEntity = _getBody(EntityConfig.REDBLOBID);
		redBlobEntity.DestroyFixture(redBlobEntity.GetFixtureList());

		// Create Heli (= Create Blob)
		//sprite = spriteAndNumber["sprite"];
		var heliEntity = _createHeliBody(x, y);

		userData = "Heli";
		
		// assign actor
		heliEntity.SetUserData([userData, undefined]);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		
		$('body').trigger("connectToView", {body : heliEntity});

		bodies.push(heliEntity); 
		heliBody = heliEntity;	
	},

	_createHeliBody = function(x, y) {
		var fixture = new b2FixtureDef;

		fixture.density = 1;
		fixture.restitution = 0.5;
		fixture.friction = 0.1;	
	
		/*shape anpassen*/
		fixture.shape = new b2PolygonShape;
		
		var bodyDef = new b2BodyDef;

		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.fixedRotation = true;
		bodyDef.position.x = x;
		bodyDef.position.y = y;

		var entity = world.CreateBody(bodyDef);

		fixture.shape.SetAsArray(
			[new b2Vec2(-(TILESIZEX * 2 - 1 )/ SCALE, -2.5 * (TILESIZEY - 1) / SCALE),
			 new b2Vec2(-(TILESIZEX * 2 - 1 ) / SCALE, -3 *(TILESIZEY - 1) / SCALE),
			 new b2Vec2((TILESIZEX * 2 - 1 ) / SCALE, -3 * (TILESIZEY - 1) / SCALE),
			 new b2Vec2((TILESIZEX * 2 - 1 ) / SCALE, -2.5 * (TILESIZEY - 1) / SCALE)],
			 4);

		entity.CreateFixture(fixture);

		fixture.shape.SetAsArray(
			[new b2Vec2(-((TILESIZEX * 2 - 1 ) / SCALE) / 2, (TILESIZEY - 1) / SCALE),
			 new b2Vec2(-((TILESIZEX * 2 - 1 ) / SCALE) / 2, -2.5 * (TILESIZEY - 1) / SCALE),
			 new b2Vec2(((TILESIZEX * 2 - 1 ) / SCALE) / 2, -2.5 * (TILESIZEY - 1) / SCALE),
			 new b2Vec2(((TILESIZEX * 2 - 1 ) / SCALE) / 2, (TILESIZEY - 1) / SCALE)],
			 4);

		entity.CreateFixture(fixture);

		return entity;
	},

	_moveHeli = function(event, data) {
		var isX = data.dir=="x";
		var speedX = isX ? data.speed : 0;
		var speedY = isX ? 0 : data.speed;

		heliBody.ApplyImpulse(new b2Vec2(speedX, speedY), heliBody.GetPosition());
	},

	_disassembleHeli = function(event, data) {
		var xPos = heliBody.m_xf.position.x;
		var yPos = heliBody.m_xf.position.y;

		sprite1X = (xPos * SCALE) + 12.5;
		sprite2X = (xPos * SCALE) - 12.5;

		sprite1Y = (yPos * SCALE) - 3;
		sprite2Y = (yPos * SCALE) - 3;		

		var messageToView = {
			generic : false,
			x : sprite1X,
			y : sprite1Y,
			entityID : EntityConfig.REDBLOBID,
			remove: ["heli"]
		};		
		$('body').trigger("requestViewEntity", messageToView);

		messageToView = {
			generic : false,
			x : sprite2X,
			y : sprite2Y,
			entityID : EntityConfig.GREENBLOBID
		};		
		$('body').trigger("requestViewEntity", messageToView);

		userData1 = EntityConfig.REDBLOBID;
		userData2 = EntityConfig.GREENBLOBID;
		
		_recreateBlob(sprite1X / SCALE, sprite1Y / SCALE, userData1);
		_recreateBlob(sprite2X / SCALE, sprite2Y / SCALE, userData2);

		heliIsActive = false;

		bodiesToRemove.push(heliBody);
	},

	_initSphere = function() {		
		if(sphereIsActive) return;
		var	greenBlobEntity = _getBody(EntityConfig.GREENBLOBID),
			x = greenBlobEntity.m_xf.position.x * SCALE + 50,
			y = greenBlobEntity.m_xf.position.y * SCALE - 15,

		messageToView = {
			generic: false,
			x: x,
			y: y,
			entityID: "Sphere",
			remove: ["blobGreen", "blobRed"]
		};
		$('body').trigger("requestViewEntity", messageToView);

		sphereIsActive = true;

		greenBlobEntity.DestroyFixture(greenBlobEntity.GetFixtureList());
		redBlobEntity = _getBody(EntityConfig.REDBLOBID);
		redBlobEntity.DestroyFixture(redBlobEntity.GetFixtureList());

		// Create Sphere 
		userData = "Sphere";

		var fixture = new b2FixtureDef;

		fixture.density = 1;
		fixture.restitution = 0.5;
		fixture.friction = 0.1;
		fixture.shape = new b2CircleShape(25 / SCALE);

		var bodyDef = new b2BodyDef;

		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = greenBlobEntity.m_xf.position.x;
		bodyDef.position.y = greenBlobEntity.m_xf.position.y - 12.5 / SCALE;

		var entity = world.CreateBody(bodyDef);

		entity.CreateFixture(fixture);
		entity.SetUserData([userData, undefined]);

		bodies.push(entity);
		sphereBody = entity;

		$('body').trigger("connectToView", {body : entity});
	},

	_moveSphere = function(event, data) {
		sphereBody.ApplyImpulse(new b2Vec2(data.speed, 0), sphereBody.GetPosition());
	},

	_disassembleSphere = function(event, data) {
		var xPos = sphereBody.m_xf.position.x;
		var yPos = sphereBody.m_xf.position.y;

		sprite1X = (xPos * SCALE) + 12.5;
		sprite2X = (xPos * SCALE) - 12.5;

		sprite1Y = (yPos * SCALE) - 3;
		sprite2Y = (yPos * SCALE) - 3;		

		var messageToView = {
			generic : false,
			x : sprite1X,
			y : sprite1Y,
			entityID : EntityConfig.REDBLOBID,
			remove: ["sphere"]
		};		
		$('body').trigger("requestViewEntity", messageToView);

		messageToView = {
			generic : false,
			x : sprite2X,
			y : sprite2Y,
			entityID : EntityConfig.GREENBLOBID
		};		
		$('body').trigger("requestViewEntity", messageToView);

		userData1 = EntityConfig.REDBLOBID;
		userData2 = EntityConfig.GREENBLOBID;
		
		_recreateBlob(sprite1X / SCALE, sprite1Y / SCALE, userData1);
		_recreateBlob(sprite2X / SCALE, sprite2Y / SCALE, userData2);

		sphereIsActive = false;

		bodiesToRemove.push(sphereBody);
	},

	_initBridge = function(event, data) {
		if(bridgeIsActive) return;

		direction = data.direction;
		
		// get bridge trigger for positions
		greenBlobEntity = _getBody(EntityConfig.GREENBLOBID),
		triggerZoneEntity = undefined;

		bridgeStart = data.direction,

		contact = greenBlobEntity.GetContactList().contact;

		do {
			currentBody = contact.GetFixtureB().GetBody();
			if(currentBody.GetUserData()[0] == EntityConfig.BRIDGELEFTTRIGGER ||
				currentBody.GetUserData()[0] == EntityConfig.BRIDGERIGHTTRIGGER) {
				triggerZoneEntity = currentBody;
				break;

			}
			contact = contact.GetNext();
		} while(contact);

		messageToView = {
			generic: false,
			x: triggerZoneEntity.m_xf.position.x * SCALE + 75,
			y: triggerZoneEntity.m_xf.position.y * SCALE + 12.5,
			entityID: "Bridge",
			direction : data.direction,
			remove: ["blobGreen", "blobRed"]
		};
		$('body').trigger("requestViewEntity", messageToView);

		bridgeIsActive = true;

		greenBlobEntity.DestroyFixture(greenBlobEntity.GetFixtureList());
		redBlobEntity = _getBody(EntityConfig.REDBLOBID);
		redBlobEntity.DestroyFixture(redBlobEntity.GetFixtureList());

		// Create Bridge (= Create Blob)
		//sprite = spriteAndNumber["sprite"];
		userData = "Bridge";
		
		var x = (direction == "left") ? 
			(triggerZoneEntity.m_xf.position.x + 100 / SCALE) : (triggerZoneEntity.m_xf.position.x - 100 / SCALE) ; 
		var y = triggerZoneEntity.m_xf.position.y

		var width = TILESIZEX / SCALE;
		var height = TILESIZEY / SCALE;	 	

		var entity = createDefaultBoxEntity(x, y, width, height, false);
		entity.SetUserData([userData, undefined]);

		bodies.push(entity);		
		bridgeBody = entity;

		$('body').trigger("connectToView", {body : entity});
	},

	_disassembleBridge = function(event, data) {
		var xPos = bridgeBody.m_xf.position.x;
		var yPos = bridgeBody.m_xf.position.y;

		if(bridgeStart == "left") {
			if(bridgeClimbDirection == "left") {
				sprite1X = (xPos * SCALE) + 12.5 - 112.5;
				sprite2X = (xPos * SCALE) - 12.5 - 112.5;

				sprite1Y = (yPos * SCALE) - 3;
				sprite2Y = (yPos * SCALE) - 3;	
			} else {
				sprite1X = (xPos * SCALE) + 12.5 + 110;
				sprite2X = (xPos * SCALE) - 12.5 + 110;

				sprite1Y = (yPos * SCALE) - 3;
				sprite2Y = (yPos * SCALE) - 3;	
			}
		} else {
			if(bridgeClimbDirection == "left") {
				sprite1X = (xPos * SCALE) - 12.5 - 110;
				sprite2X = (xPos * SCALE) + 12.5 - 110;

				sprite1Y = (yPos * SCALE) - 3;
				sprite2Y = (yPos * SCALE) - 3;	
			} else {
				sprite1X = (xPos * SCALE) - 12.5 + 112.5;
				sprite2X = (xPos * SCALE) + 12.5 + 112.5;

				sprite1Y = (yPos * SCALE) - 3;
				sprite2Y = (yPos * SCALE) - 3;	
			}			
		}
	
		var messageToView = {
			generic : false,
			x : sprite1X,
			y : sprite1Y,
			entityID : EntityConfig.REDBLOBID,
			remove: ["bridge"]
		};		
		$('body').trigger("requestViewEntity", messageToView);

		messageToView = {
			generic : false,
			x : sprite2X,
			y : sprite2Y,
			entityID : EntityConfig.GREENBLOBID
		};		
		$('body').trigger("requestViewEntity", messageToView);

		userData1 = EntityConfig.REDBLOBID;
		userData2 = EntityConfig.GREENBLOBID;
		
		_recreateBlob(sprite1X / SCALE, sprite1Y / SCALE, userData1);
		_recreateBlob(sprite2X / SCALE, sprite2Y / SCALE, userData2);

		bridgeIsActive = false;

		bodiesToRemove.push(bridgeBody);
	},

	_setSprites = function(entity) {
		sprites = [];

		for(var i = 0; i < actors.length; i++) {
			if(actors[i].body.GetUserData()[0] == EntityConfig.GREENBLOBID
				|| actors[i].body.GetUserData()[0] == EntityConfig.REDBLOBID) {
				sprites.push(actors[i].skin);
			}
		}

		entity.setBlobSprites(sprites);
	},

	_fireSlingshot = function(event, data) {			
		var slingX = data.xPos,
			slingY = data.yPos,
			angle = data.angle,
			tension = data.force,
			direction = data.direction;

		greenBlobEntity = undefined;
		redBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
			} else if(bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				redBlobEntity = bodies[i];
			}
		}

		if(direction == "left") {
			greenBlobEntity.SetPosition(new b2Vec2((slingX + 1.5 * TILESIZEX) / SCALE, (slingY-TILESIZEY) / SCALE ));
			redBlobEntity.SetPosition(new b2Vec2((slingX + 0.5 * TILESIZEX) / SCALE, (slingY) / SCALE ));

			var radians = angle * Math.PI / 180;

			greenBlobEntity.ApplyImpulse(new b2Vec2(Math.cos(radians) * tension, -Math.sin(radians) * tension), greenBlobEntity.GetPosition());
			$('body').trigger('onSlingshotFinished');
		} else if(direction == "right") {
			greenBlobEntity.SetPosition(new b2Vec2((slingX - 1.5 * TILESIZEX) / SCALE, (slingY - TILESIZEY) / SCALE ));
			redBlobEntity.SetPosition(new b2Vec2((slingX - 0.5 * TILESIZEX) / SCALE, (slingY) / SCALE ));

			var radians = angle * Math.PI / 180;

			greenBlobEntity.ApplyImpulse(new b2Vec2(-Math.cos(radians) * tension, -Math.sin(radians) * tension), greenBlobEntity.GetPosition());
			$('body').trigger('onSlingshotFinished');
		}		
	},

	_recreateBlob = function(x, y, userData) {
		var width = (TILESIZEX - 1) / SCALE,
			height = (userData == EntityConfig.REDBLOBID) ? ((TILESIZEY * 2) - 3 ) / SCALE : (TILESIZEY - 1) / SCALE;

		var fixture = createDefaultBoxFixture(width, height);
		var blobEntity = _getBody(userData);
	
		blobEntity.SetPosition(new b2Vec2(x, y));
		blobEntity.CreateFixture(fixture);

		$('body').trigger("connectToView", {body : blobEntity});
	},

	_registerListener = function() {
		$("body").on("entityRequested", applyEntity);
		$('body').on("blobRequested", applyBlobEntity);
		$("body").on('sensorRequested', _applySensor);

		$('body').on('onInputRecieved', _applyForce);
		$('body').on('onInputRecievedJump', _applyForceJump);

		$('body').on('onTrampolinActive', _activateTrampolin);
		$('body').on('onTrampolinInactive', _deactivateTrampolin);
		$('body').on('trampolinStopRequested', _restoreGreenBlobAfterTrampolin);

		$('body').on('onStretchActive', _activateStretch);
		$('body').on('onStretchInactive', _deactivateStretch);
		$('body').on('stretchStopRequested', _restoreRedBlobAfterStretch);

		$('body').on('openDoor',_openDoor);
		$('body').on('onKeyPickedUp', _pickUpKeyPhysics);
		$('body').on('buttonActivated', _removeButtonBody);
		$('body').on('onTrampolinContact', _handleTrampolinContact);
		
		// START: DUMMY HELI
		$('body').on('startHeli', _initHeli);
		$('body').on('heliMove', _moveHeli);
		$('body').on('heliStopRequested', _disassembleHeli);
		// END: DUMMY HELI

		//START: DUMMY BRIDGE
		$('body').on('startBridge', _initBridge);
		$('body').on('bridgeStopRequested', _disassembleBridge);
		$('body').on('onBridgeDirectionChosen', _setBridgeClimbDirection)

		//START: DUMMY  SPHERE
		$('body').on('startSphere', _initSphere);
		$('body').on('sphereMove', _moveSphere);
		$('body').on('sphereStopRequested', _disassembleSphere);

		//START: DUMMY TELEPORT
		$('body').on('teleportRequested', _doTeleport);

		//DUMMY SLINGSHOT
		$('body').on('slingshotFinished', _fireSlingshot);
		// DESTRUCTION
		$('body').on("restartPhys", _restartPhys);
		$('body').on("destroyPhysics", _destroyWorld);
		$('body').on("resetGame", _resetGame);

		_registerCollisionHandler();
	},

	_setBridgeClimbDirection = function(event, data) {
		if(data.direction == "left") {
			bridgeClimbDirection = "left";
		} else if(data.direction == "right") {
			bridgeClimbDirection = "right";
		}
	},

	_doTeleport = function() {
		var greenBlobEntity = undefined;
		var redBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
			} else 	if(bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				redBlobEntity = bodies[i];
			}
		}

		redX = redBlobEntity.m_xf.position.x;
		redY = redBlobEntity.m_xf.position.y;

		greenX = greenBlobEntity.m_xf.position.x;
		greenY = greenBlobEntity.m_xf.position.y;

		greenBlobEntity.SetPosition(new b2Vec2(redX, redY + 11 / SCALE));
		redBlobEntity.SetPosition(new b2Vec2(greenX, greenY - 13 / SCALE));
	},

	_activateTrampolin = function() {
		isTrampolinActive = true;
		var greenBlobEntity = _getBody(EntityConfig.GREENBLOBID);

		messageToView = {
			generic: false,
			x: greenBlobEntity.m_xf.position.x * SCALE,
			y: greenBlobEntity.m_xf.position.y * SCALE,
			entityID: "Trampolin",
			remove: ["blobGreen"]
		};
		$('body').trigger("requestViewEntity", messageToView);

		$('body').trigger("connectToView", {body : greenBlobEntity, special: "Trampolin"});
	},

	_deactivateTrampolin = function() {
		isTrampolinActive = false;		
	}

	_restoreGreenBlobAfterTrampolin = function() {
		messageToView = {
			generic: false,
			entityID: EntityConfig.GREENBLOBID,
			remove: ["trampolin"]
		};
		$('body').trigger("requestViewEntity", messageToView);

		$('body').trigger("connectToView", {body : _getBody(EntityConfig.GREENBLOBID)});
	},

	_handleTrampolinContact = function(event, data) {
		if(isTrampolinActive == true) {
			_applyForceJump(null, {"entity" : data.body, "directionX" : 0, "directionY" : -2.2 * data.yVel});
			$("body").trigger("trampolinAnimationChanged", {"animationKey" : AnimationKeys.BOUNCE});
		} else {
			$('body').trigger('onReAllowJump', bodyA);
		}
	},

	_activateStretch = function() {
		isStretchActive = !isStretchActive;

		var redBlobEntity = _getBody(EntityConfig.REDBLOBID);
		messageToView = {
			generic: false,
			x: redBlobEntity.m_xf.position.x * SCALE,
			y: redBlobEntity.m_xf.position.y * SCALE,
			entityID: "Stretch",
			remove: ["blobRed"]
		};
		$('body').trigger("requestViewEntity", messageToView);
			
		$('body').trigger("connectToView", {body : redBlobEntity, special: "Stretch"});
	},

	_deactivateStretch = function() {		
		$("body").trigger("stretchAnimationChanged", {"animationKey" : AnimationKeys.STOP});
		isStretchActive = !isStretchActive;
	},

	_restoreRedBlobAfterStretch = function() {
		messageToView = {
			generic: false,
			entityID: EntityConfig.REDBLOBID,
			remove: ["stretch"]
		};
		$('body').trigger("requestViewEntity", messageToView);

		$('body').trigger("connectToView", {body : _getBody(EntityConfig.REDBLOBID)});
	},
	
	_restartPhys = function() {
		lastTimestamp = Date.now();
	},

	_destroyWorld = function() {
		var bodyList = world.GetBodyList();

		while(bodyList != null) {	
			var tmpBody = bodyList.GetNext();
			bodiesToRemove.push(bodyList);
			bodyList = tmpBody;
		}

		bodies.length = 0;

		_resetVariables();

		$('body').trigger("onReloadGame");
	},

	_registerCollisionHandler = function() {
		var collisionHandler = BlobApp.CollisionHandler();

		collisionHandler.init();

		var listener = collisionHandler.getContactListener();	

		world.SetContactListener(listener);
	},	

	_pickUpKeyPhysics = function(event, data) {
		bodiesToRemove.push(data.body);
	},	

	_removeButtonBody = function(event, data) {
		bodiesToRemove.push(data.body);
	},

	_openDoor = function(event, doorID) {
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.DOORID && bodies[i].GetUserData()[1] == doorID) {
				bodiesToRemove.push(bodies[i]);
			}
		}
	},

	_resetVariables = function() {
		heliIsActive = false;
		sphereIsActive = false;
		bridgeIsActive = false;
		isTrampolinActive = false;
		isStretchActive = false;
	};

	that.init = init;
	that.SCALE = SCALE;
	that.update = update;	
	that.getBodies = getBodies;
	that.createActors = createActors;

	return that;
})();