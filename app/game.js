var config = require('./config').config;
var Player = require('./player');
var Ball = require('./ball');

var Game = function(player1Id,player2Id){
	this.player1 = new Player(player1Id,config.startX,config.height/2 - config.playerHeight/2);
	this.player2 = new Player(player2Id,config.width - config.startX,config.height/2 - config.playerHeight/2);
	this.ball = new Ball(config.width/2,config.height/2);
	this.ball.vx = config.ballSpeed;
	this.ball.vy = 0;
}
Game.prototype.checkForLoss = function(){
	if(this.ball.x < this.player1.x){
		this.player2.score++;
		this.reset();
	}
	if(this.ball.x > this.player2.x + this.player2.width){
		this.player1.score++;
		this.reset();
	}
}
Game.prototype.reset = function(){
	this.ball = new Ball(config.width/2,config.height/2);
	this.ball.vx = config.ballSpeed;
	this.ball.vy = 0;
}
Game.prototype.checkCollisions = function(){
	if(this.ball.vx < 0){
		if(this.ball.x <= this.player1.x + this.player1.width){
			var collisionDiff = this.player1.x + this.player1.width - this.ball.x;
            var k = collisionDiff/-this.ball.vx;
            var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
            if (y >= this.player1.y && y + this.ball.radius*2 <= this.player1.y + this.player1.height) {
                // collides with the left paddle
                this.ball.x = this.player1.x + this.player1.width;
                this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
                this.ball.vx = -this.ball.vx;
				var relY = (this.player1.y + (this.player1.height/2) - this.ball.y)/ (this.player1.height/2 );
				this.ball.vy = config.ballSpeed * config.maxBounceAngle * Math.asin(relY*-1);
			}
		}
	}else{
		if(this.ball.x >= this.player2.x){
			var collisionDiff = this.ball.x - this.player2.x;
            var k = collisionDiff/this.ball.vx;
            var y = this.ball.vy*k + (this.ball.y - this.ball.vy);
            if (y >= this.player2.y && y + this.ball.radius*2 <= this.player2.y + this.player2.height) {
                // collides with the right paddle
                this.ball.x = this.player2.x;
                this.ball.y = Math.floor(this.ball.y - this.ball.vy + this.ball.vy*k);
                this.ball.vx = -this.ball.vx;
				var relY = (this.player2.y + (this.player2.height/2) - this.ball.y)/ (this.player2.height/2 );
				this.ball.vy = config.ballSpeed * config.maxBounceAngle * Math.asin(relY*-1);
			}
		}
	}
}
Game.prototype.update = function(){
    if(this.paused) return;
	this.ball.update();
	
	if(this.ball.x <= 0 || this.ball.x >= config.width ){
		this.ball.vx = -this.ball.vx;
	}
	if(this.ball.y <= 0 || this.ball.y >= config.height ){
		this.ball.vy = -this.ball.vy;
	}
	this.checkCollisions();
	this.checkForLoss();
};
Game.prototype.move = function(id,direction){
	var player;
	if(this.player1.socket.id===id){
		player=this.player1;
	}
	if(this.player2.socket.id===id){
		player=this.player2;
	}
	switch(direction){
		case "up":
			if(player.y > 0 ){
				player.y-=config.playerSpeed;
			}
			break;
		case "down":
			if(player.y < config.height - player.height ){
				player.y+=config.playerSpeed;
			}
			break;
	}
}
Game.prototype.toJSON = function(){
	var json = {};
	json.player1={};
	json.player1.x=this.player1.x;
	json.player1.y=this.player1.y;
	json.player1.score=this.player1.score;
	
	json.player2={};
	json.player2.x=this.player2.x;
	json.player2.y=this.player2.y;
	json.player2.score=this.player2.score;
	
	json.ball={};
	json.ball.x=this.ball.x;
	json.ball.y=this.ball.y;
	json.ball.vx=this.ball.vx;
	json.ball.vy=this.ball.vy;
	return json;
}

module.exports = Game;