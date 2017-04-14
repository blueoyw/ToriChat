
// from REST API -> Redis message
// publish message
module.exports = function ( app, redis, client, redisKey ) {
	app.get("/chat", function ( req, res) {
		if ( !req.user ) {		//passport 인증 완료 확인
			res.redirect("/login");
			return;
		}
		
		res.render("chat", {
			title: "Chat",
			username: req.user.email
		});
	});			
};