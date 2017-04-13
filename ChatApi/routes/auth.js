
// for authentication passport js
module.exports = function(app, passport, LocalStrategy, redis, client) {
	app.get("/login", function(req, res) {
		//ejs 페이지 로드
		res.render( 'login' ,{
			title : "Login"	//값 설정.
		});
	});
	

	passport.serializeUser(function(user, done) {
		done(null, user.username );  //username 은 user key 값.
	});

	//login 이후에는 deserializeUser로 사용자를 식별.
	passport.deserializeUser( function( id, done) {
		/*
		User.findById( id, function(err, user) {
			done(err, user);
		});
		*/
		var user={ username:'test' };
		//find user
		//if not error
		//else
		done(null, user);
	});
	
	passport.use( new LocalStrategy(
			//실제 인증 시 실행되는 전략.
			function(username, password, done ){
				//if(err) { return done(err); } //error 처리
				var user={ username:'test' } ;
				if( !user ) {
					return done(null, false, { message: 'Incorrect'} );
				} else {
					return done(null, user);	 // user login 성공 -> serializeUser 호출
				}
				return done(null, false, { message: 'Not exist user.'} );
			}
	));
	//두번째 function은 middleware. 미리 구현된 인증 함수.
	//첫번째 인자는 local 전략.
	app.post("/login", 
		passport.authenticate('local', { 
			successRedirect: "/",
			failureRedirect: '/login',
			failureFlash: false		// flush error message
		}) );	
	
};