var config = require('./config').config;

var Ball = function(x,y){
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.radius = config.radius;
}
Ball.prototype.update = function(){
	this.x+=this.vx;
	this.y+=this.vy;
}

module.exports = Ball;