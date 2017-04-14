
// from REST API -> Redis message
// publish message
module.exports = function ( app, redis, client, redisKey ) {
	app.get("/chat", function ( req, res) {
		res.render("chat", {
			title: "Chat"
		});
	});			
};