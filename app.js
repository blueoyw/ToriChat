
/**
 * Module dependencies.
 */

var express = require('express')
	, bodyParser = require('body-parser')
	, PropertiesReader = require('properties-reader')
	, cookieparser = require('cookie-parser')
	, session = require('express-session')
	, redis = require('redis')
	, RedisStore = require('connect-redis')(session) //session store in redis
	, redisKey = require('./redisKey')
	, pbkdf2 = require('pbkdf2-password')		// password encryption.
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
  //, routes = require('./routes')
  //, user = require('./routes/user')
  , http = require('http')
  , path = require('path')    
  ;

var app = express();

var properties = PropertiesReader('./config.ini');

var hasher = pbkdf2();

//redis
var client = redis.createClient(6379, "119.194.139.163", {
	password : "redis!"
});

client.on("error", function(err){
	console.log('Error '+err);
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
//app.use(express.logger('dev'));

//app.use( cookieparser() );
app.use( cookieparser('12390891237ASDFASDF!@#') ); //for security key
app.use( session({
	secret: 'key',
	resave: false,
	saveUninitialized: true,
	//cookie: {secure: true}
	store: new RedisStore({
		//host: "119.194.139.163",
		//port: 6379,
		client: client		
	})
}) );

app.use(passport.initialize());
app.use( passport.session() );

app.use( bodyParser.urlencoded({
	extended: true
}));
app.use( bodyParser.json() );
app.use(express.static('public'));

/*
 * express version 4 에서는 middleware 들이 많이 삭제되었다.
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
*/

//users
//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

require('./routes/index')(app, redis, client);
require('./routes/auth')(app, passport, LocalStrategy, redis, client, redisKey, hasher );
//require('./routes/session')(app, redis, client);
require('./routes/chat')(app, redis, client, redisKey, properties);

// publish socket server manage channel
var count = properties.get('server.count');
for( var i=0; i<count; i++) {
	var ip = properties.get('server_'+i+'.ip');
	console.log(ip+" publish");
	client.publish( ip, 'start channel' );
}

/*
app.get('/chat',function(req, res){
	if ( !req.user ) {		//passport 인증 완료 확인
		res.redirect("/login");
		return;
	}
	res.sendFile(__dirname+'/views/chat.html');
});
*/

//client.end(true);