
// from REST API -> Redis message
// publish message
module.exports = function ( app, redis, client, redisKey ) {	
	app.get("/chat", function(req, res){
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}		
		
		res.render("chat", {
			title: "Chat",
			ip: "http://localhost",
			port: "3001"
		});
		
		//res.sendFile(__dirname + '/views/chat.html');
	});
	
	app.post("/chat", function(req, res){
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}		
		console.log( '메시지=>'+ req.body.message );
		
		//redis publish
		client.publish("chat", req.body.message );
		
		var result = {};
		result.success = '1';
		result.error = '0';
		res.json(result);
	});
};