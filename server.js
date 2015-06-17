var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var Game = require('./app/game');
var config = require('./app/config');
//var game;
var waiting;

app.use(express.static(__dirname));

io.on('connection', function(socket){
	console.log("new connection");
	if(!waiting){
		waiting=socket;
	}
	else{
		newGame(waiting,socket);
		waiting=null;
	}
	socket.on('move', function(data){
		if(!socket.game) return;
		socket.game.move(this.id,data.direction);
	});
});
server.listen(8088, function(){
  console.log('listening on *:8088');
});

function newGame(socket1,socket2){
	var game = new Game(socket1,socket2);
	socket1.game = game;
	socket2.game = game;
	this.timer = setInterval(function(){
		game.update();
		game.player1.socket.emit('update',game.toJSON());
		game.player2.socket.emit('update',game.toJSON());
	}, 10);
}
function loop(){
	game.update();
	game.player1.socket.emit('update',game.toJSON());
	game.player2.socket.emit('update',game.toJSON());
}