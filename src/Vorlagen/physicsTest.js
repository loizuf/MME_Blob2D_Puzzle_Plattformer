appTest.physicsTest = (function() {

	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	var that = {},
	SCALE = 30, STEP = 20, TIMESTEP = 1/20;
	var world;
	var lastTimestamp = Date.now;
	var fixedTimestepAccumulator = 0;
	var bodiesToRemove = [];
	var actors = [];
	var bodies =[];
	
	setup = function() {
		_setupPhysics();
		console.log("phys init");
		return that;
	},

	applyEntity = function(skin) {
		var fixture = new b2FixtureDef;
		fixture.density = 1;
		fixture.restitution = 0.6;
		fixture.shape = new b2CircleShape(24 / SCALE);

		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = skin.x / SCALE;
		bodyDef.position.y = skin.y / SCALE;
		
		var entity = world.CreateBody(bodyDef);
		entity.CreateFixture(fixture);

		// assign actor
		var actor = new _actorObject(entity, skin);
		entity.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		bodies.push(entity);
		
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
   			world.m_debugDraw.m_sprite.graphics.clear();
   			world.DrawDebugData();
		}	
	},

	_setupPhysics = function() {
		world = new b2World(new b2Vec2(0,10), true);
		_addDebug();
		// boundaries - floor
		var floorFixture = new b2FixtureDef;
		floorFixture.density = 1;
		floorFixture.restitution = 1;
		floorFixture.shape = new b2PolygonShape;
		floorFixture.shape.SetAsBox(550 / SCALE, 10 / SCALE);

		var floorBodyDef = new b2BodyDef;
		floorBodyDef.type = b2Body.b2_staticBody;
		floorBodyDef.position.x = -25 / SCALE;
		floorBodyDef.position.y = 509 / SCALE;

		var floor = world.CreateBody(floorBodyDef);
		floor.CreateFixture(floorFixture);

		// boundaries - left
		var leftFixture = new b2FixtureDef;
		leftFixture.shape = new b2PolygonShape;
		leftFixture.shape.SetAsBox(10 / SCALE, 550 / SCALE);

		var leftBodyDef = new b2BodyDef;
		leftBodyDef.type = b2Body.b2_staticBody;
		leftBodyDef.position.x = -9 / SCALE;
		leftBodyDef.position.y = -25 / SCALE;

		var left = world.CreateBody(leftBodyDef);
		left.CreateFixture(leftFixture);

		// boundaries - right
		var rightFixture = new b2FixtureDef;
		rightFixture.shape = new b2PolygonShape;
		rightFixture.shape.SetAsBox(10 / SCALE, 550 / SCALE);

		var rightBodyDef = new b2BodyDef;
		rightBodyDef.type = b2Body.b2_staticBody;
		rightBodyDef.position.x = 509 / SCALE;
		rightBodyDef.position.y = -25 / SCALE;

		var right = world.CreateBody(rightBodyDef);
		right.CreateFixture(rightFixture);
	},

	_addDebug = function() {
			/*var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(debugContext);
			debugDraw.SetDrawScale(SCALE);
			debugDraw.SetFillAlpha(0.7);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);*/
	},

	_actorObject = function(body, skin) {
		this.body = body;
		this.skin = skin;

		this.update = function() {
			this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
			this.skin.x = this.body.GetWorldCenter().x * SCALE;
			this.skin.y = this.body.GetWorldCenter().y * SCALE;
		}
		actors.push(this);
	}

	that.setup = setup;
	that.update = update;
	that.applyEntity = applyEntity;
	return that;
})();