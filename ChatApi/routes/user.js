
/*
 * GET users listing.
 */
/*
exports.list = function(req, res){
  res.send("respond with a resource");
};
*/

module.exports = function(app, client) {
	app.get("/user", function(req, res) {
		console.log("hello user!");
	});
}