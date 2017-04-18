
// from REST API -> Redis message
// publish message
var lb = 0;
module.exports = function ( app, redis, client, redisKey, properties ) {	
	app.get("/chat", function(req, res){
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}						
		
		res.render("chat", {
			title: "Chat"	,
			username: req.user.username
		});		
	});
	
	//방 리스트
	app.get("/chat/:username/room", function(req, res){
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}		
		
		console.log( req.originalUrl );
		client.lrange( req.originalUrl, 0, -1, function(err, reply) {						
			console.log( reply );
			res.render("chat_room_list", {
				title: "방 목록",
				list: reply
			});	
		});							
	});
	
	//방 생성 화면
	app.get("/chat/:username/room/new", function(req, res){
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}		
		var username = req.params.username;		
		
		res.render( "new_chat_room", {
			title: "방 생성",
			username: username
		});
	});
	
	//방 생성
	app.post("/chat/:username/room", function(req, res){
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}		
		var username = req.params.username;
		var title = req.body.title;
		var result = {};
		if( !title || title === '' ) {
			result.success = 0;
			result.error = 'Title is NULL.';
			res.json( result );
			return;			
		}
		
		console.log(req.originalUrl);
		var key = req.originalUrl +"/" + title;
		console.log(key);
		
		//push to redis		
		client.rpush( req.originalUrl, req.body.title );
						
		//redis publish
		client.publish( key, 'start room' );
				
		res.redirect("/chat/"+username+"/room/"+title);				
	});
	
	//방 참여
	app.get("/chat/:username/room/:title", function(req, res){
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}								
		
		//to do load balancing
		var count = properties.get('server.count');				
		var ip = properties.get('server_'+lb+'.ip');
		var port = properties.get('server_'+lb+'.port');
		lb = (lb+1)%count;						
		req.session.ip = ip;
		req.session.port = port;
		
		//redis notify to socket server
		var msg = "crte|"+req.originalUrl ;
		console.log( ip + "->"+msg);
		client.publish( ip, msg );				
		
		res.render("chat_room", {
			title: req.params.title,
			ip: ip,
			port: port,
			username: req.user.username
		});
		
	});
	
	app.post("/chat/:username/room/:title/message", function(req, res){
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}		
		var username = req.params.username;
		var title = req.params.title;
		
		console.log( '메시지=>'+ req.body.message );
		
		//redis publish
		var channel = '/chat/' + username + '/room/' + title;
		client.publish( channel, req.body.message );
		
		var result = {};
		result.success = '1';
		result.error = '0';
		res.json(result);
	});
};