
// for authentication passport js
module.exports = function(app, passport, LocalStrategy, redis, client, redisKey, hasher ) {		
	app.get("/login", function(req, res) {
		//ejs 페이지 로드
		res.render( 'login' ,{
			title : "Login"	//값 설정.
		});
	});
	
	passport.serializeUser(function(username, done) {
		done(null, username );  //username 은 user key 값.
	});

	//login 이후에는 deserializeUser로 사용자를 식별.
	passport.deserializeUser( function( username, done) {				
		//find user
		var key = redisKey.redisUsername( username );
		client.hgetall(key, function( err, reply ) {			
			if( !reply ) {			
				console.log("not found");
				return done(null, false, { message: 'Not found'} );				
			}
			console.log( reply );
			done(null, username);
		});						
	});
	
	passport.use( new LocalStrategy(
			//실제 인증 시 실행되는 전략.
			function(username, password, done ){
				//if(err) { return done(err); } // db connect error 처리
											
				var key = redisKey.redisUsername(username);
				client.hgetall(key, function( err, reply ) {					
					if( !reply ) {			
						console.log("not found");
						return done(null, false, { message: 'Not found'} );				
					}
					console.dir( reply );
					
					hasher( {password:password, salt: reply.salt }, function(err, pass, salt, hash){	
						if( hash !== reply.password ) {
							console.log("incorrect password hash->"+hash);
							console.log("incorrect password db pw->"+reply.password);
							return done(null, false, { message: 'Incorrect Password'} );
						}
																		
						done(null, username);	 // user login 성공 -> serializeUser 호출						
					} );																						
				});																					
			}
	));
	
	//두번째 function은 middleware. 미리 구현된 인증 함수.
	//첫번째 인자는 local 전략.
	app.post("/login", 
		passport.authenticate('local', { 
			successRedirect: "/chat",
			failureRedirect: '/login',
			failureFlash: false		// flush error message
		}) );		
	
	app.get("/signup", function ( req, res) {
		res.render("signup", {
			title: "Sign up"
		});
	});
	
	app.post("/signup", function ( req, res) {
		var username = req.body.username;				
		if( !username ) {			
			res.render("signup", {
				title: "Sign up",				
			});
			console.log("not username");
			return;
		}	
		
		var key = redisKey.redisUsername( username );
		
		client.get( key, function ( err, reply ) {			
			if( reply ) {
				console.log( reply.toString() );
				console.log("already exists");
				res.render("signup", {
					title: "Sign up",				
				});
				return;
			}			
			var password = req.body.password;
			var email = req.body.email;		
			//암호화			
			hasher( {password:password}, function(err, pass, salt, hash){	
				client.hmset( key,
					{
						"password": hash,
						"salt": salt,
						"email": email
					}
				);				
				res.redirect("/login");	
			} );						
		});							
	});
};