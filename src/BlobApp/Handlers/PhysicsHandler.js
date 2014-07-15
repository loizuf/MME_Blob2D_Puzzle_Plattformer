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

	init = function(){
		_setupPhysics();
		return that;
	};

	
	_setupPhysics = function() {
		/* die borders noch schöner gestalten?! */


		world = new b2World(new b2Vec2(0,10), true);

		// boundaries - floor
		var floorFixture = new b2FixtureDef;
		floorFixture.density = 1;
		floorFixture.restitution = 0;
		floorFixture.friction = 0.2;
		console.log(floorFixture);
		floorFixture.shape = new b2PolygonShape;
		floorFixture.shape.SetAsBox(850 / SCALE, 10 / SCALE);

		var floorBodyDef = new b2BodyDef;
		floorBodyDef.type = b2Body.b2_staticBody;
		floorBodyDef.position.x = -25 / SCALE;
		floorBodyDef.position.y = 600 / SCALE;

		var floor = world.CreateBody(floorBodyDef);
		floor.SetUserData("floor");
		floor.CreateFixture(floorFixture);

		// boundaries - left
		var leftFixture = new b2FixtureDef;
		leftFixture.shape = new b2PolygonShape;
		leftFixture.shape.SetAsBox(10 / SCALE, 600 / SCALE);

		var leftBodyDef = new b2BodyDef;
		leftBodyDef.type = b2Body.b2_staticBody;
		leftBodyDef.position.x = -9 / SCALE;
		leftBodyDef.position.y = -25 / SCALE;

		var left = world.CreateBody(leftBodyDef);
		left.CreateFixture(leftFixture);

		// boundaries - right
		var rightFixture = new b2FixtureDef;
		rightFixture.shape = new b2PolygonShape;
		rightFixture.shape.SetAsBox(10 / SCALE, 800 / SCALE);

		var rightBodyDef = new b2BodyDef;
		rightBodyDef.type = b2Body.b2_staticBody;
		rightBodyDef.position.x = 800 / SCALE;
		rightBodyDef.position.y = -25 / SCALE;

		var right = world.CreateBody(rightBodyDef);
		right.CreateFixture(rightFixture);

		var listener = new Box2D.Dynamics.b2ContactListener;
		listener.BeginContact = function(contact){
		//	console.log("hoot");
			console.log(contact.GetFixtureA().GetBody().GetUserData(),contact.GetFixtureB().GetBody().GetUserData());
		}
		world.SetContactListener(listener);
	},


	/*das muss vom levelloader aufgerufen werden!*/
	applyEntity = function(skin) {
		var fixture = new b2FixtureDef;
		//console.log(skin);
		fixture.density = 1;
		fixture.restitution = 0;
		fixture.friction = 0.1;

		/*shape anpassen*/
		fixture.shape = new b2PolygonShape;
		fixture.shape.SetAsBox(25 / SCALE, 25 / SCALE);

		var bodyDef = new b2BodyDef;


		/*dynamic/static body*/
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = skin.x / SCALE;
		bodyDef.position.y = skin.y / SCALE;
		
		var entity = world.CreateBody(bodyDef);
		entity.CreateFixture(fixture);

		// assign actor
		//entity.SetUserData(bodies.length);  // set the actor as user data of the body so we can use it later: body.GetUserData()
		var actor = new _actorObject(entity, skin);
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
   			//world.m_debugDraw.m_sprite.graphics.clear();
   			world.DrawDebugData();
		}	
	},

	ActorObject = function(body, skin) {
		this.body = body;
		this.skin = skin;
		this.update = function() {
			this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
			this.skin.x = this.body.GetWorldCenter().x * SCALE;
			this.skin.y = this.body.GetWorldCenter().y * SCALE;
		}
		actors.push(this);
	};

	that.init = init;
	that.SCALE = SCALE;
	that.update = update;

	return that;
})();