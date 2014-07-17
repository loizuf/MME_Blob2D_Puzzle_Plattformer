BlobApp.PhysicsHandler = (function() {
	var that = {},
	SCALE = 30, STEP = 20, TIMESTEP = 1/20;
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

	var TILESIZEX = 12;
	var TILESIZEY = 12;


	init = function(){
		_setupPhysics();
		_registerListener();
		return that;
	};

	
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
		userData = spriteAndNumber["number"];


		var fixture = new b2FixtureDef;
		//console.log(skin);
		fixture.density = 1;
		fixture.restitution = 0;
		fixture.friction = 0.1;
		/*shape anpassen*/
		fixture.shape = new b2PolygonShape;

		fixture.shape.SetAsBox(TILESIZEX / SCALE, TILESIZEY / SCALE);


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
		userData = spriteAndNumber["number"];
		
		var fixture = new b2FixtureDef;
		//console.log(skin);
		fixture.density = 1;
		fixture.restitution = 0;
		fixture.friction = 0.1;	
	
		/*shape anpassen*/
		fixture.shape = new b2PolygonShape;

		if(userData == EntityConfig.REDBLOBID){
			fixture.shape.SetAsBox(TILESIZEX / SCALE, TILESIZEY*2 / SCALE);
		}else{
			fixture.shape.SetAsBox(TILESIZEX / SCALE, TILESIZEY / SCALE);
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
		entity.SetUserData(userData);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		var actor = new _actorObject(entity, sprite);

		//entity muss in das blob Model. Debug lösung über Event
		var blobEntityCreated = $.Event('blobEntityCreated');
		$("body").trigger(blobEntityCreated, entity);
		//bodies.push(entity); 	
	},

	update = function() {
		var now = Date.now();
		var dt = now - lastTimestamp;

		fixedTimestepAccumulator += dt;
		lastTimestamp = now;

		while(fixedTimestepAccumulator >= STEP) {		

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

	}

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

	_registerListener = function() {
		//$("body").on("entityRequested", applyEntity);
		$('body').on("blobRequested", applyBlobEntity);
		$('body').on('onInputRecieved', _applyForce);
		$('body').on('onInputRecievedJump', _applyForceJump);
		$('body').on('borderRequested',_applyBorder);
		_registerCollisionHandler();
	},

	_registerCollisionHandler = function(){
		var listener = new Box2D.Dynamics.b2ContactListener;
		listener.BeginContact = function(contact){

		//	console.log(contact.GetFixtureA().GetBody().GetUserData(),contact.GetFixtureB().GetBody().GetUserData());
			a = contact.GetFixtureA().GetBody().GetUserData();
			b = contact.GetFixtureB().GetBody().GetUserData();
			switch(a){
				case EntityConfig.GREENBLOBID: 
				_handleGreenBlobCollision(contact.GetFixtureA().GetBody(), b);
				break;
				case EntityConfig.REDBLOBID: 
				_handleRedBlobCollision(contact.GetFixtureA().GetBody(), b);
				break;
			} 

		}
		world.SetContactListener(listener);
	},

	_handleGreenBlobCollision = function(body, bUserData){
		console.log("greenblob collided");
		switch(bUserData){
			case EntityConfig.REDBLOBID:
			//TODO handle trampolin
			break;
			case EntityConfig.VERTICALBORDERID:
			console.log("verticalBorder collided");
			break;
			case EntityConfig.HORIZONTALBORDERID:
			$('body').trigger('onReAllowJump', body);
			console.log("horizontalborder collided");
			break;

		}
	},
	_handleRedBlobCollision = function(body, bUserData){
		console.log("redblob collided");
		switch(bUserData){
			case EntityConfig.GREENBLOBID:
			//TODO handle carry
			break;
			case EntityConfig.VERTICALBORDERID:
			console.log("verticalBorder collided");
			break;
			case EntityConfig.HORIZONTALBORDERID:
			$('body').trigger('onReAllowJump', body);
			console.log("horizontalborder collided");
			break;
		}

	};

	that.init = init;
	that.SCALE = SCALE;
	that.update = update;

	return that;
})();