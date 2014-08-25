BlobApp.PhysicsHandler = (function() {
	var that = {},

	isResetted = false;

	SCALE = 30, STEP = 20, TIMESTEP = 1/20,
	PLAYER_ONE_NAME = "p1", PLAYER_TWO_NAME="p2",
	GROWTH_FACTOR = 0.1, STRETCH_HEIGHT = 4, TRAMPOLIN_WIDTH = 2;
	
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	var world;
	var lastTimestamp = Date.now();
	var fixedTimestepAccumulator = 0;
	var bodiesToRemove = [];
	var actors = [];
	var bodies =[];

	var greenBlob;
	var redBlob;

	var TILESIZEX = 12.5;
	var TILESIZEY = 12.5;
	var stretchSize = 2;
	var trampolinSize = 1;

	var isTrampolinActive = false;
	var isStretchActive = false;

	var bridgeIsActive = false,	bridgeBody = undefined,	bridgeStart = undefined, bridgeClimbDirection = undefined;
	var heliIsActive = false, heliBody = undefined;
	var sphereIsActive = false,	sphereBody = undefined;

	init = function(){
		_setupPhysics();
		_registerListener();

		return that;
	},

	_resetGame = function() {
		var bodyList = world.GetBodyList();

		while(bodyList!=null){
			var tmpBody = bodyList.GetNext();
			bodiesToRemove.push(bodyList);
			bodyList = tmpBody;
		}

		bodies.length = 0;


		$('body').trigger('onResetGame');
	},

	_setupPhysics = function() {
		var debugDraw = new b2DebugDraw();

        debugDraw.SetSprite(document.getElementById("gameCanvas").getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        

		world = new b2World(new b2Vec2(0, 10), true);
		world.SetDebugDraw(debugDraw);
	},

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
	applyEntity = function(event, spriteAndNumber) {
		sprite = spriteAndNumber["sprite"];
		userData = spriteAndNumber["userData"];
		entityID = userData[0];

		var x = (sprite.x) / SCALE,	y = (sprite.y) / SCALE,
			width = TILESIZEX / SCALE,
			height = (entityID == EntityConfig.DOORID) ? TILESIZEY * 2 / SCALE : TILESIZEY / SCALE;

		var entity = createDefaultBoxEntity(x, y, width, height);

		entity.SetUserData(userData);  
		
		var actor = new _actorObject(entity, sprite);
		
		bodies.push(entity); 
		
	},

	applyBlobEntity = function(event, spriteAndNumber) {
		sprite = spriteAndNumber["sprite"];
		userData = spriteAndNumber["userData"][0];

		
		var width = (TILESIZEX - 1) / SCALE,
			height = (userData == EntityConfig.REDBLOBID) ? ((TILESIZEY * 2) - 3 )/ SCALE : (TILESIZEY - 1) / SCALE;

		var fixture = createDefaultBoxFixture(width, height);
		var bodyDef = new b2BodyDef;

		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = (sprite.x) / SCALE;
		bodyDef.position.y = (sprite.y) / SCALE;
		bodyDef.fixedRotation = true;

		var entity = world.CreateBody(bodyDef);

		entity.CreateFixture(fixture);

		entity.SetUserData([userData,undefined]);
		
		var actor = new _actorObject(entity, sprite);
		var blobEntityCreated = $.Event('blobEntityCreated');

		$("body").trigger(blobEntityCreated, entity);

		bodies.push(entity); 	
	},

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
			if(heliBody != undefined) {
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

	_handleGreenBlobGrowth = function() {
		var greenBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
				break;
			}
		}

		if(trampolinSize <= TRAMPOLIN_WIDTH) {
			var fixture = createDefaultBoxFixture(trampolinSize * (TILESIZEX - 1) / SCALE, (TILESIZEY - 1) / SCALE);

			greenBlobEntity.DestroyFixture(greenBlobEntity.GetFixtureList());
			greenBlobEntity.CreateFixture(fixture);	

			trampolinSize += GROWTH_FACTOR;
		}
	},

	_handleGreenBlobShrinking = function() {
		var greenBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
				break;
			}
		}

		if(trampolinSize >= 1) {
			var fixture = createDefaultBoxFixture(trampolinSize * (TILESIZEX - 1) / SCALE, (TILESIZEY - 1) / SCALE);

			greenBlobEntity.DestroyFixture(greenBlobEntity.GetFixtureList());
			greenBlobEntity.CreateFixture(fixture);

			trampolinSize -= GROWTH_FACTOR;
		}
	},

	_handleRedBlobGrowth = function() {
		var redBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				redBlobEntity = bodies[i];
				break;
			}
		}

		if(redBlobEntity == undefined) return;

		if(stretchSize <= STRETCH_HEIGHT) {
			var fixture = createDefaultBoxFixture((TILESIZEX - 1) / SCALE, stretchSize * (TILESIZEY - 1) / SCALE);

			redBlobEntity.DestroyFixture(redBlobEntity.GetFixtureList());
			redBlobEntity.CreateFixture(fixture);

			stretchSize += GROWTH_FACTOR;
		}
	},

	_handleRedBlobShrinking = function() {
		var redBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				redBlobEntity = bodies[i];
				break;
			}
		}

		if(stretchSize >= 2) {
			var fixture = createDefaultBoxFixture((TILESIZEX - 1) / SCALE, stretchSize * (TILESIZEY - 1) / SCALE);

			redBlobEntity.DestroyFixture(redBlobEntity.GetFixtureList());
			redBlobEntity.CreateFixture(fixture);

			stretchSize -= GROWTH_FACTOR;
		}
	},

	_applyForce = function(event, direction) {
		var entity = direction.entity;
		if((entity.m_linearVelocity.x > -3) && (entity.m_linearVelocity.x < 3)) {
			entity.ApplyImpulse(new b2Vec2(direction.directionX, 
				direction.directionY), entity.GetPosition());
		}
	},

	// TODO better code
	_applyForceJump = function(event, direction) {
			var entity = direction.entity;
			entity.ApplyImpulse(new b2Vec2(direction.directionX, direction.directionY), entity.GetPosition());
	},

	_applyBorder = function(event, borderData) {
		var x = (borderData.x) / SCALE,
			y = (borderData.y) / SCALE,
			width = borderData.width/SCALE,
			height = borderData.height/SCALE;

		var entity = createDefaultBoxEntity(x, y, width, height);

		entity.SetUserData(borderData.userData);
	}, 

	_applySensor = function(event, data) {
		var sprite = data.sprite;

		var x = (sprite.x) / SCALE,
			y = (sprite.y) / SCALE,
			width = (data.width) ? data.width * TILESIZEX/SCALE : TILESIZEX/SCALE,
			height = (data.height * TILESIZEY)/SCALE;

		var entity = createDefaultBoxEntity(x, y, width, height, true);		

		entity.SetUserData(data.userData);
	},

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

	/* Heli stuff */
	_initHeli = function() {
		greenBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
				break;
			}
		}

		var heliEnt = new BlobApp.Heli(greenBlobEntity.m_xf.position.x * SCALE, 
			greenBlobEntity.m_xf.position.y * SCALE -15, 50, 50);

		sprite = heliEnt.sprite;

		$('body').trigger("heliEntityRequested", {"sprite" : sprite});

		_setSprites(heliEnt);

		if(heliIsActive) {
			return;
		}

		heliIsActive = true;

		blobBodies = [];
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID 
				|| bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				bodiesToRemove.push(bodies[i]);
			}
		}
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				bodies.splice(i, 1);
			}
		}
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				bodies.splice(i, 1);
			}
		}

		// Create Heli (= Create Blob)
		//sprite = spriteAndNumber["sprite"];
		userData = "Heli";
		
		var fixture = new b2FixtureDef;

		fixture.density = 1;
		fixture.restitution = 0.5;
		fixture.friction = 0.1;	
	
		/*shape anpassen*/
		fixture.shape = new b2PolygonShape;

		//	if(userData == EntityConfig.REDBLOBID){
		//}else{
		//	fixture.shape.SetAsBox((TILESIZEX-1) / SCALE, (TILESIZEY-1) / SCALE);
		//}
		
		var bodyDef = new b2BodyDef;

		/*dynamic/static body*/
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.fixedRotation = true;
		bodyDef.position.x = (sprite.x) / SCALE;
		bodyDef.position.y = (sprite.y) / SCALE;

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

		// assign actor
		entity.SetUserData([userData, undefined]);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		
		var actor = new _actorObject(entity, sprite);

		bodies.push(entity); 
		heliBody = entity;	
	},

	_initSphere = function() {
		greenBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
				break;
			}
		}

		var sphereEntity = new BlobApp.Sphere(greenBlobEntity.m_xf.position.x * SCALE + 50,
			greenBlobEntity.m_xf.y * SCALE -15, 50, 50);
		
		var sprite = sphereEntity.sprite;

		$('body').trigger("sphereEntityRequested", {"sprite" : sprite});

		_setSprites(sphereEntity);

		if(sphereIsActive) {
			return;
		}

		sphereIsActive = true;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID 
				|| bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				bodiesToRemove.push(bodies[i]);
			}
		}
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				bodies.splice(i, 1);
			}
		}
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				bodies.splice(i, 1);
			}
		}

		// Create Sphere (= Create Blob)
		//sprite = spriteAndNumber["sprite"];
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
		entity.SetUserData(userData);

		var actor = new _actorObject(entity, sprite);

		bodies.push(entity);
		sphereBody = entity;
	},

	_moveSphere = function(event, data) {
		sphereBody.ApplyImpulse(new b2Vec2(data.speed, 0), sphereBody.GetPosition());
	}

	_disassembleSphere = function(event, data) {
		if(data.sprites[0].name == "blobRed") {
			sprite1 = data.sprites[0];
			sprite2 = data.sprites[1];
		} else {
			sprite1 = data.sprites[1];
			sprite2 = data.sprites[0];
		}


		userData1 = (sprite1.name=="blobRed") ? EntityConfig.REDBLOBID : EntityConfig.GREENBLOBID;
		userData2 = (userData1 == EntityConfig.REDBLOBID) ? EntityConfig.GREENBLOBID : EntityConfig.REDBLOBID;

		var xPos = sphereBody.m_xf.position.x;
		var yPos = sphereBody.m_xf.position.y;

		sprite1.x = (xPos * SCALE) + 12.5;
		sprite2.x = (xPos * SCALE) - 12.5;


		sprite1.y = (yPos * SCALE) - 3;
		sprite2.y = (yPos * SCALE) - 3;
		
		_recreateBlob(sprite1, userData1);
		_recreateBlob(sprite2, userData2);

		$('body').trigger('removeSphereFromView', {"sprites" : data.sprites});
		sphereIsActive = false;

		bodiesToRemove.push(sphereBody);
	},

	_initBridge = function(event, data) {
		greenBlobEntity = undefined;

		bridgeStart = data.direction;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
				break;
			}
		}

		var bridgeEntity = new BlobApp.Bridge(greenBlobEntity.m_xf.position.x * SCALE + 50,
			greenBlobEntity.m_xf.y * SCALE + 12.5, 175, 75);
		
		sprite = bridgeEntity.sprite;

		$('body').trigger("bridgeEntityRequested", {"sprite" : sprite});

		_setSprites(bridgeEntity);

		if(bridgeIsActive) {
			return;
		}

		bridgeIsActive = true;


		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID 
				|| bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				bodiesToRemove.push(bodies[i]);
			}
		}
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				bodies.splice(i, 1);
			}
		}
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				bodies.splice(i, 1);
			}
		}

		// Create Bridge (= Create Blob)
		//sprite = spriteAndNumber["sprite"];
		userData = "Bridge"
		
		var x = (greenBlobEntity.m_xf.position.x + 75 / SCALE); 
		var y = greenBlobEntity.m_xf.position.y

		var width = TILESIZEX / SCALE;
		var height = TILESIZEY / SCALE;	 	

		var entity = createDefaultBoxEntity(x, y, width, height, false);
		entity.SetUserData(userData);

		var actor = new _actorObject(entity, sprite);

		bodies.push(entity);		
		bridgeBody = entity;
	},

	_disassembleBridge = function(event, data) {
		if(data.sprites[0].name == "blobRed") {
			sprite1 = data.sprites[0];
			sprite2 = data.sprites[1];
		} else {
			sprite1 = data.sprites[1];
			sprite2 = data.sprites[0];
		}

		userData1 = (sprite1.name == "blobRed") ? EntityConfig.REDBLOBID : EntityConfig.GREENBLOBID;
		userData2 = (userData1 == EntityConfig.REDBLOBID) ? EntityConfig.GREENBLOBID : EntityConfig.REDBLOBID;

		var xPos = bridgeBody.m_xf.position.x;
		var yPos = bridgeBody.m_xf.position.y;

		if(bridgeStart == "left") {
			if(bridgeClimbDirection == "left") {
				sprite1.x = (xPos * SCALE) + 12.5 - 80;
				sprite2.x = (xPos * SCALE) - 12.5 - 80;		

				sprite1.y = (yPos * SCALE) - 3;
				sprite2.y = (yPos * SCALE) - 3;
			} else {
				sprite1.x = (xPos * SCALE) + 12.5 + 115;
				sprite2.x = (xPos * SCALE) - 12.5 + 115;		

				sprite1.y = (yPos * SCALE) - 3;
				sprite2.y = (yPos * SCALE) - 3;
			}

		} else {
			if(bridgeClimbDirection == "left") {
				sprite1.x = (xPos * SCALE) + 12.5 - 240;
				sprite2.x = (xPos * SCALE) - 12.5 - 240;		

				sprite1.y = (yPos * SCALE) - 3;
				sprite2.y = (yPos * SCALE) - 3;
			} else {
				sprite1.x = (xPos * SCALE) + 12.5
				sprite2.x = (xPos * SCALE) - 12.5	

				sprite1.y = (yPos * SCALE) - 3;
				sprite2.y = (yPos * SCALE) - 3;
			}
		}		
		
		_recreateBlob(sprite1, userData1);
		_recreateBlob(sprite2, userData2);

		$('body').trigger('removeBridgeFromView', {"sprites" : data.sprites});
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

	_moveHeli = function(event, data) {
		var isX = data.dir=="x";
		var speedX = isX ? data.speed : 0;
		var speedY = isX ? 0 : data.speed;

		heliBody.ApplyImpulse(new b2Vec2(speedX, speedY), heliBody.GetPosition());
	},

	_stopHeli = function() {
		$('body').trigger('heliAnimationChanged', {"animationKey" : AnimationKeys.STOP});
	},

	_disassembleHeli = function(event, data) {

		if(data.sprites[0].name == "blobRed") {
			sprite1 = data.sprites[0];
			sprite2 = data.sprites[1];
		} else {
			sprite1 = data.sprites[1];
			sprite2 = data.sprites[0];
		}


		userData1 = (sprite1.name=="blobRed") ? EntityConfig.REDBLOBID : EntityConfig.GREENBLOBID;
		userData2 = (userData1 == EntityConfig.REDBLOBID) ? EntityConfig.GREENBLOBID : EntityConfig.REDBLOBID;

		var xPos = heliBody.m_xf.position.x;
		var yPos = heliBody.m_xf.position.y;

		sprite1.x = (xPos * SCALE) + 12.5;
		sprite2.x = (xPos * SCALE) - 12.5;


		sprite1.y = (yPos * SCALE) - 3;
		sprite2.y = (yPos * SCALE) - 3;
		
		_recreateBlob(sprite1, userData1);
		_recreateBlob(sprite2, userData2);

		$('body').trigger('removeHeliFromView', {"sprites" : data.sprites});
		heliIsActive = false;

		bodiesToRemove.push(heliBody);
	},

	_recreateBlob = function(sprite, userData) {
		var width = (TILESIZEX - 1) / SCALE,
			height = (userData == EntityConfig.REDBLOBID) ? ((TILESIZEY * 2) - 3 ) / SCALE : (TILESIZEY - 1) / SCALE;

		var fixture = createDefaultBoxFixture(width, height);
		var bodyDef = new b2BodyDef;

		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = (sprite.x) / SCALE;
		bodyDef.position.y = (sprite.y) / SCALE;
		bodyDef.fixedRotation = true;

		var entity = world.CreateBody(bodyDef);

		userData == EntityConfig.REDBLOBID ? redBlobBody = entity : greenBlobBody = entity;

		entity.CreateFixture(fixture);

		entity.SetUserData([userData, undefined]);
		
		var actor = new _actorObject(entity, sprite);
		var blobEntityCreated = $.Event('blobEntityCreated');

		$("body").trigger(blobEntityCreated, entity);

		bodies.push(entity); 
	},

	_registerListener = function() {
		$("body").on("entityRequested", applyEntity);
		$('body').on("blobRequested", applyBlobEntity);

		$('body').on('onInputRecieved', _applyForce);
		$('body').on('onInputRecievedJump', _applyForceJump);

		$('body').on('borderRequested',_applyBorder);
		$("body").on('sensorRequested', _applySensor);

		$('body').on('onTrampolinActive', _activateTrampolin);
		$('body').on('onTrampolinInactive', _deactivateTrampolin);

		$('body').on('onStretchActive', _activateStretch);
		$('body').on('onStretchInactive', _deactivateStretch);

		$('body').on('openDoor',_openDoor);
		$('body').on('onKeyPickedUp', _pickUpKey);
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

		$('body').trigger('physTeleportFinished');
	},

	_activateTrampolin = function() {
		isTrampolinActive = !isTrampolinActive;

		var greenBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
				break;
			}
		}

		var trampolinEntity = new BlobApp.Trampolin(greenBlobEntity.m_xf.position.x, 
				greenBlobEntity.m_xf.position.y, 50, 25, greenBlobEntity);
		var sprite = trampolinEntity.sprite;

		$("body").trigger("trampolinEntityRequested", {"sprite" : sprite});
		
		var actor = undefined;

		for(var i = 0; i < actors.length; i++) {
			if(actors[i].body == greenBlobEntity) {
				actor = actors[i];
				break;
			}
		}
		var oldSprite = actor.skin;
		actor.skin = sprite;
		// TODO this is not good code :/
		trampolinEntity.setActor(actor);
		trampolinEntity.setOldSprite(oldSprite);

		 
	},

	_deactivateTrampolin = function() {
		$("body").trigger("trampolinAnimationChanged", {"animationKey" : AnimationKeys.STOP});
		var width = (TILESIZEX - 1) / SCALE;
		var height = (TILESIZEY - 1) / SCALE;

		isTrampolinActive = !isTrampolinActive;

		var greenBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
				break;
			}
		}

		var fixture = createDefaultBoxFixture(width, height);

		greenBlobEntity.DestroyFixture(greenBlobEntity.GetFixtureList());
		greenBlobEntity.CreateFixture(fixture);
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

		var redBlobEntity = undefined;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				redBlobEntity = bodies[i];
				break;
			}
		}

		if(redBlobEntity == undefined) {
			isStretchActive = !isStretchActive;
			return;	
		}
		
		var stretchEntity = new BlobApp.Stretch(redBlobEntity.m_xf.position.x, 
				redBlobEntity.m_xf.position.y, 25, 100, redBlobEntity);

		var sprite = stretchEntity.sprite;	
	
		var actor = undefined;

		for(var i = 0; i < actors.length; i++) {
			if(actors[i].body == redBlobEntity) {
				actor = actors[i];
				break;
			}
		}

		$("body").trigger("stretchEntityRequested", {"sprite" : sprite}); // viewController

		var oldSprite = actor.skin;

		actor.skin = sprite;
		// TODO this is not good code :/
		stretchEntity.setActor(actor);
		stretchEntity.setOldSprite(oldSprite);
	},

	_deactivateStretch = function() {
		$("body").trigger("stretchAnimationChanged", {"animationKey" : AnimationKeys.STOP});
		isStretchActive = !isStretchActive;
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

	_pickUpKey = function(event, data) {
		bodiesToRemove.push(data.body);
		$('body').trigger('keyPickedUp');
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
	};

	that.init = init;
	that.SCALE = SCALE;
	that.update = update;

	return that;
})();