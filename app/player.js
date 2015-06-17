var config = require('./config').config;

var Player = function(socket,x,y){
	this.x = x;
	this.y = y;
	this.width = config.playerWidth;
	this.height = config.playerHeight;
	this.socket = socket;
	this.score=0;
}

module.exports = Player;