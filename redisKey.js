//describe redis keys
// base key username:1

exports.redisUsername = function ( username ) {
	return "username:"+ username; 
};
