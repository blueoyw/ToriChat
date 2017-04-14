//describe redis keys
// base key username:1

exports.redisUsername = function ( username ) {
	return "username:"+ username; 
};

exports.redisEmail = function ( username ) {
	return "username:"+ username + ":email"; 
};

exports.redisPassword = function ( username ) {
	return "username:"+ username + ":password"; 
};


