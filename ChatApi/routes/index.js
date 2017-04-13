
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
		//console.log("cookie");
		
		var result = {};
		result.success = 1;
		result.reason = "";
		res.json(result);
	});
	
	var products = {
		1:{ title: "Web 1"},
		2:{ title: "Web 2"}
	};
	
	app.get("/products", function(req, res) {
		var content;
		for( var name in products ) {
			console.log( products[name] );
			content += "<li><a href='/cart/"+name+"'>"+products[name].title +"</a></li>";
		}
		
		res.send( "<h1>Products</h1><ul>"+content+"</ul> <a href='/carts'>carts</a> " );
	});
	
	/*
	 * cart = {
	 *    id: 수량,
	 *    id: 수량
	 * }
	 * */
	app.get( "/cart/:id", function(req, res) {
		var id = req.params.id;
		var cart = {};
		if( req.signedCookies.cart ) {
			cart = req.signedCookies.cart;
		}
		
		if( !cart[id] ) {
			cart[id] = 1;
		} else {
			cart[id] = parseInt( cart[id] ) + 1;	
		}
				
		res.cookie("cart", cart, {signed:true});		
		res.redirect("/cart");
	});
	
	app.get("/cart", function(req, res) {
		var cart = req.signedCookies.cart;
		if( !cart ) {
			res.send("empty");		
		}
		res.send( req.signedCookies );
		
	});
	
	app.post("/signin", function(req, res) {
		var result = {};
		var id = req.body.id;
		var pw = req.body.password;
		var nick_name = req.body.nick_name;
		var value = pw + "|" + nick_name;
		
		client.set( id, value, redis.print );
		result.success = 1;
		result.reason = "";
		res.json(result);
	});
	
	app.get("/count", function(req, res) {		
		var count = 0; 
		if( req.signedCookies.count ) {
			count = parseInt( req.signedCookies.count ); //암호화
		}
		count = count + 1;
		res.cookie("count", count, {signed:true}); //암호화
		
		console.log("cookie: ", req.signedCookies);		//쿠키 설정.									
		res.send('count : ' + count );
	});
}