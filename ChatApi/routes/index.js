
/*
 * GET home page.
 */

/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/
module.exports = function(app, redis, client) {
	app.get("/", function(req, res) {
		//console.log("hello world!");
	});
	
	app.post("/signin", function(req, res) {
		var result = {};
		var id = req.body["id"];
		var pw = req.body["password"];
		var nick_name = req.body["nick_name"];
		var value = pw + "|" + nick_name;
		
		client.set( id, value, redis.print );
		result["success"] = 1;
		result["reason"] = "";
		res.json(result);
	});
}