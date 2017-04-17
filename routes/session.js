
/*
 * GET home page.
 */

/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/

//session example
module.exports = function(app, redis, client) {
	app.get("/session/count", function(req, res) {		
		if( req.session.count ) {
			req.session.count++;
		} else {
			req.session.count = 1;
		}
		res.send("hi session! " + req.session.count );
	});		
	
	app.get("/auth/login", function(req,res){
		var output = "<form action='/auth/login' method='post' >" +
				"<p> <input type='text' name='username' placeholder='username'> </p> " +
				"<p> <input type='password' name='password' placeholder='password'> </p>" +
				"<p> <input type='submit'> </p>" +
				"</form>";
		res.send( output );
	});
	
	app.post("/auth/login", function(req,res) {
		var user = {
				username: 'test',
				password: 'test'
		};
		var username = req.body.username;
		var password = req.body.password;
		
		if ( username === user.username  && password === user.password ) {
			req.session.username = username;
			client.set( req.session.username, 'on');
			res.redirect("/welcome");
		} else {
			res.send("Login fail! <a href='/auth/login'>login</a>");
		}		
	});
	
	app.get("/welcome", function(req,res) {
		if( req.session.username ) {			
			res.send("Welcome +" + req.session.username);
		}else {
			res.send("Welcome <a href='/auth/login'>login</a>");	
		}
		
	});
	
	app.get("/auth/logout", function(req,res) {
		delete req.session.username;
		//database 저장이 완료되면 callback을 실행.
		req.session.save( function() {
			res.redirect("/welcome");	
		});
		
	});
};