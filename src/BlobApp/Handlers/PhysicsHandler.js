BlobApp.PhysicsHandler = (function() {
	var that = {},

	isResetted = false;

	SCALE = 30, STEP = 20, TIMESTEP = 1/20,
	PLAYER_ONE_NAME = "p1", PLAYER_TWO_NAME="p2";
	
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


	init = function(){
		_setupPhysics();
		_registerListener();

		return that;
	},

	_resetGame = function() {
		a = world.GetBodyList();

		var cnt = 0;
		while(a!=null){
			cnt++;
			console.log("destroying", cnt);
			tmp = a.GetNext();
			bodiesToRemove.push(a);
			a = tmp;
		}
	
		$('body').trigger('onResetGame');
		
	},

	_setupPhysics = function() {
		/* die borders noch schöner gestalten?! */
		var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(document.getElementById("gameCanvas").getContext("2d"));
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.5);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        

		world = new b2World(new b2Vec2(0,10), true);
		world.SetDebugDraw(debugDraw);
	},


	/*das muss vom levelloader aufgerufen werden!*/
	applyEntity = function(event, spriteAndNumber) {
		sprite = spriteAndNumber["sprite"];
		userData = spriteAndNumber["userData"];
		entityID = userData[0]

		var fixture = new b2FixtureDef;
		//console.log(skin);
		fixture.density = 1;
		fixture.restitution = 0;
		fixture.friction = 0.1;
		/*shape anpassen*/
		fixture.shape = new b2PolygonShape;
		if(entityID == EntityConfig.DOORID){
			fixture.shape.SetAsBox(TILESIZEX / SCALE, TILESIZEY*2 / SCALE);
		}else{
			fixture.shape.SetAsBox(TILESIZEX / SCALE, TILESIZEY / SCALE);
		}

		var bodyDef = new b2BodyDef;


		/*dynamic/static body*/
		bodyDef.type = b2Body.b2_staticBody;

		bodyDef.position.x = (sprite.x) / SCALE;
		bodyDef.position.y = (sprite.y) / SCALE;
		
		var entity = world.CreateBody(bodyDef);
		entity.CreateFixture(fixture);

		// assign actor
		entity.SetUserData(userData);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		var actor = new _actorObject(entity, sprite);
		bodies.push(entity); 
		
	},

	applyBlobEntity = function(event, spriteAndNumber) {
		sprite = spriteAndNumber["sprite"];
		userData = spriteAndNumber["userData"][0];

		
		var fixture = new b2FixtureDef;
		//console.log(skin);
		fixture.density = 1;
		fixture.restitution = 0;
		fixture.friction = 0.1;	
	
		/*shape anpassen*/
		fixture.shape = new b2PolygonShape;

		if(userData == EntityConfig.REDBLOBID){
			fixture.shape.SetAsBox((TILESIZEX-1) / SCALE, ((TILESIZEY*2)-3 )/ SCALE);
		} else {
			fixture.shape.SetAsBox((TILESIZEX-1) / SCALE, (TILESIZEY-1) / SCALE);
		}
		
		var bodyDef = new b2BodyDef;


		/*dynamic/static body*/
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = (sprite.x) / SCALE;
		bodyDef.position.y = (sprite.y) / SCALE;
		
		bodyDef.fixedRotation = true;

		var entity = world.CreateBody(bodyDef);
		entity.CreateFixture(fixture);
		// assign actor
		entity.SetUserData([userData,undefined]);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		var actor = new _actorObject(entity, sprite);

		//entity muss in das blob Model. Debug lösung über Event
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

			if(heliBody != undefined)
				heliBody.ApplyForce( new b2Vec2(0, -8.5*heliBody.GetMass()), heliBody.GetPosition());

			// update active actors
			for(var i=0, l=actors.length; i<l; i++) {
				actors[i].update();
			}

			world.Step(TIMESTEP, 10, 10);

			fixedTimestepAccumulator -= STEP;
			world.ClearForces();
   			//world.m_debugDraw.m_sprite.graphics.clear();
   			world.DrawDebugData();
		}	
	},

	_applyForce = function(event, direction) {
		var entity = direction.entity;
		if((entity.m_linearVelocity.x > -3) && (entity.m_linearVelocity.x < 3)) {
			entity.ApplyImpulse(new b2Vec2(direction.directionX, direction.directionY), entity.GetPosition());
		}
	},

	// TODO better code
	_applyForceJump = function(event, direction) {
			var entity = direction.entity;
			entity.ApplyImpulse(new b2Vec2(direction.directionX, direction.directionY), entity.GetPosition());
	},

	_applyBorder = function(event, borderData){
		var fixture = new b2FixtureDef;
		fixture.density = 1;
		fixture.restitution = 0;
		fixture.friction = 0.1;
		/*shape anpassen*/
		fixture.shape = new b2PolygonShape;
		fixture.shape.SetAsBox(borderData.width/SCALE, borderData.height/SCALE);

		var bodyDef = new b2BodyDef;

		/*dynamic/static body*/
		bodyDef.type = b2Body.b2_staticBody;

		bodyDef.position.x = (borderData.x) / SCALE;
		bodyDef.position.y = (borderData.y) / SCALE;
		
		var entity = world.CreateBody(bodyDef);
		entity.CreateFixture(fixture);
		// assign actor
		entity.SetUserData(borderData.userData);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		//var actor = new _actorObject(entity, sprite);
		//bodies.push(entity); 

	}, 

	_applyKey = function(event, data) {
		var sprite = data.sprite;
		console.log(data.height);
		var fixture = new b2FixtureDef;
		fixture.density = 1;
		fixture.restitution = 0;
		fixture.friction = 0;
		fixture.shape = new b2PolygonShape;
		fixture.shape.SetAsBox(TILESIZEX/SCALE, (data.height*TILESIZEY)/SCALE);

		fixture.isSensor = true;

		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_staticBody;

		bodyDef.position.x = (sprite.x) / SCALE;
		bodyDef.position.y = (sprite.y) / SCALE;

		var entity = world.CreateBody(bodyDef);
		entity.CreateFixture(fixture);
		entity.SetUserData(data.userData);
	},


	_actorObject = function(body, skin) {
		this.body = body;
		this.skin = skin;
		this.update = function() {
			//this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
			this.skin.x = (this.body.GetWorldCenter().x * SCALE);
			this.skin.y = (this.body.GetWorldCenter().y * SCALE);
		}
		actors.push(this);
	},


	// Heli stuff
	heliIsActive = false,
	heliBody = undefined,

	_initHeli = function() {

		greenBlobEntity = undefined;
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID) {
				greenBlobEntity = bodies[i];
				console.log(greenBlobEntity);
				break;
			}
		}



		var heliEnt = new BlobApp.Heli(greenBlobEntity.m_xf.position.x * SCALE, 
									   greenBlobEntity.m_xf.position.y * SCALE, 50, 50);
		sprite = heliEnt.sprite;
		$('body').trigger("heliEntityRequested", {"sprite" : sprite});

		if(heliIsActive) return;
		heliIsActive = true;

		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.GREENBLOBID || bodies[i].GetUserData()[0] == EntityConfig.REDBLOBID) {
				bodiesToRemove.push(bodies[i]);
			}
		}

		// Create Heli (= Create Blob)
		//sprite = spriteAndNumber["sprite"];
		userData = "Heli";
		
		var fixture = new b2FixtureDef;
		//console.log(skin);
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
			[new b2Vec2(-(TILESIZEX*2-1 )/ SCALE, -2.5*(TILESIZEY-1)/SCALE),
			 new b2Vec2(-(TILESIZEX*2-1 )/ SCALE, -3*(TILESIZEY-1)/SCALE),
			 new b2Vec2((TILESIZEX*2-1 )/ SCALE, -3*(TILESIZEY-1)/SCALE),
			 new b2Vec2((TILESIZEX*2-1 )/ SCALE, -2.5*(TILESIZEY-1)/SCALE)],
			 4);
		entity.CreateFixture(fixture);

		fixture.shape.SetAsArray(
			[new b2Vec2(-((TILESIZEX*2-1 )/ SCALE)/2, (TILESIZEY-1)/SCALE),
			 new b2Vec2(-((TILESIZEX*2-1 )/ SCALE)/2, -2.5*(TILESIZEY-1)/SCALE),
			 new b2Vec2(((TILESIZEX*2-1 )/ SCALE)/2, -2.5*(TILESIZEY-1)/SCALE),
			 new b2Vec2(((TILESIZEX*2-1 )/ SCALE)/2, (TILESIZEY-1)/SCALE)],
			 4);
		entity.CreateFixture(fixture);
	

		// assign actor
		entity.SetUserData([userData,undefined]);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		var actor = new _actorObject(entity, sprite);

		bodies.push(entity); 
		heliBody = entity;	
	},

	_moveHeli = function(event, data) {
		var isX = data.dir=="x";
		var speedX = isX? data.speed : 0;
		var speedY = isX? 0 : data.speed;

		heliBody.ApplyImpulse(new b2Vec2(speedX, speedY), heliBody.GetPosition());
	},

	_registerListener = function() {
		$("body").on("entityRequested", applyEntity);
		$('body').on("blobRequested", applyBlobEntity);
		$('body').on('onInputRecieved', _applyForce);
		$('body').on('onInputRecievedJump', _applyForceJump);
		$('body').on('borderRequested',_applyBorder);
		$("body").on('keyRequested', _applyKey);
		$('body').on('openDoor',_openDoor);
		// START: DUMMY HELI
		$('body').on('startHeli', _initHeli);
		$('body').on('heliMove', _moveHeli);
		// END: DUMMY HELI
		$('body').on("restartPhys", _restartPhys);
		$('body').on("destroyPhysics", _destroyWorld);
		$('body').on("resetGame", _resetGame);
		_registerCollisionHandler();
	},
	
	_restartPhys = function(){
		console.log("whey");
		lastTimestamp = Date.now();
	},
	_destroyWorld = function() {
		console.log("Zin'rok");
		a = world.GetBodyList();

		var cnt = 0;
		while(a!=null){
			cnt++;
			console.log("destroying", cnt);
			tmp = a.GetNext();
			bodiesToRemove.push(a);
			a = tmp;
		}

		$('body').trigger("onReloadGame");
	},

	_registerCollisionHandler = function(){
		var listener = new Box2D.Dynamics.b2ContactListener;
		listener.BeginContact = function(contact){
		//	console.log(contact.GetFixtureA().GetBody().GetUserData(),contact.GetFixtureB().GetBody().GetUserData());
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
			} 

		}
		world.SetContactListener(listener);
	},

	_handleButtonCollison = function(bodyB, contact){
		var buttonID = bodyB.GetUserData()[1];

		if(contact.m_manifold.m_localPlaneNormal.y>0){
			$('body').trigger('doorOpenRequested', buttonID);
		}
	},

	_handleGreenBlobCollision = function(bodyA,bodyB, bID, contact){
		//console.log("greenblob collided");
		switch(bID){
			case EntityConfig.REDBLOBID:
			//TODO handle trampolin
			break;
			case EntityConfig.VERTICALBORDERID:
			//console.log("verticalBorder collided");
			break;
			case EntityConfig.HORIZONTALBORDERID:
			break;
			case EntityConfig.BUTTONID:
				_handleButtonCollison(bodyB, contact);
			break;
			case EntityConfig.KEYID:
				_pickUpKey(bodyA, bodyB);
				return;
			break;
			case EntityConfig.GOALID:
				_attemptFinish(EntityConfig.GREENBLOBID);
				return;
			break;

		}
		if(contact.m_manifold.m_localPlaneNormal.y>0){
			$('body').trigger('onReAllowJump', bodyA);
		}
	},
	_handleRedBlobCollision = function(bodyA,bodyB, bID, contact){
		//console.log("redblob collided");
		var notTramped = true;
		switch(bID){
			case EntityConfig.GREENBLOBID:
				// Trampolin
				notTramped = false;
				if(contact.m_manifold.m_localPlaneNormal.y>0){
					y = contact.m_fixtureA.m_body.GetLinearVelocity().y;
					_applyForceJump(null, {"entity" : bodyA, "directionX" : 0, "directionY" : -2.2*y});
				}
			break;
			case EntityConfig.VERTICALBORDERID:
			//console.log("verticalBorder collided");
			break;
			case EntityConfig.HORIZONTALBORDERID:
			//console.log("horizontalborder collided");
			break;
			case EntityConfig.BUTTONID:
				_handleButtonCollison(bodyB, contact);
			break;
			case EntityConfig.KEYID:
				_pickUpKey(bodyA, bodyB);
				return;
			break;
			case EntityConfig.GOALID:
				_attemptFinish(EntityConfig.REDBLOBID);
				return;
			break;
		}
		if(contact.m_manifold.m_localPlaneNormal.y>0 && notTramped){
			$('body').trigger('onReAllowJump', bodyA);
		}

	},

	_attemptFinish = function(blobID) {
		console.log(blobID);
		if(blobID == EntityConfig.REDBLOBID){
			$('body').trigger('blobFinishAttempt', PLAYER_ONE_NAME);
		} else if(blobID == EntityConfig.GREENBLOBID){
			$('body').trigger('blobFinishAttempt', PLAYER_TWO_NAME);
		}
	},

	_pickUpKey = function(bodyA, bodyB) {
		bodiesToRemove.push(bodyB);
		$('body').trigger('keyPickedUp');
	},	


	_openDoor = function(event, doorID){
		for(var i = 0; i < bodies.length; i++) {
			if(bodies[i].GetUserData()[0] == EntityConfig.DOORID && bodies[i].GetUserData()[1] == doorID) {
				bodiesToRemove.push(bodies[i]);
			}
		}
	};

	that.init = init;
	that.SCALE = SCALE;
	that.update = update;

	return that;
})();