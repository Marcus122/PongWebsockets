var KEY = {
    'BACKSPACE': 8, 'TAB': 9, 'NUM_PAD_CLEAR': 12, 'ENTER': 13, 'SHIFT': 16,
    'CTRL': 17, 'ALT': 18, 'PAUSE': 19, 'CAPS_LOCK': 20, 'ESCAPE': 27,
    'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36,
    'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40,
    'PRINT_SCREEN': 44, 'INSERT': 45, 'DELETE': 46, 'SEMICOLON': 59,
    'WINDOWS_LEFT': 91, 'WINDOWS_RIGHT': 92, 'SELECT': 93,
    'NUM_PAD_ASTERISK': 106, 'NUM_PAD_PLUS_SIGN': 107,
    'NUM_PAD_HYPHEN-MINUS': 109, 'NUM_PAD_FULL_STOP': 110,
    'NUM_PAD_SOLIDUS': 111, 'NUM_LOCK': 144, 'SCROLL_LOCK': 145,
    'EQUALS_SIGN': 187, 'COMMA': 188, 'HYPHEN-MINUS': 189,
    'FULL_STOP': 190, 'SOLIDUS': 191, 'GRAVE_ACCENT': 192,
    'LEFT_SQUARE_BRACKET': 219, 'REVERSE_SOLIDUS': 220,
    'RIGHT_SQUARE_BRACKET': 221, 'APOSTROPHE': 222
};
(function () {
	/* 0 - 9 */
	for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
	}
	/* A - Z */
	for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
	}
	/* NUM_PAD_0 - NUM_PAD_9 */
	for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
	}
	/* F1 - F12 */
	for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
	}
})();
var config = {
	FPS:50,
	radius:5,
	playerHeight:50,
	playerWidth:2,
	startX:10,
	startY:100,
	playerSpeed :4,
	maxBounceAngle:5*Math.PI/12,
	ballSpeed:5
}
function Ball(x,y){
	this.x = x;
	this.y = y;
	this.vx = 0;
	this.vy = 0;
	this.radius = config.radius;
}
Ball.prototype.draw = function(ctx){
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#fff';
    ctx.fill();
	ctx.stroke();
}
Ball.prototype.update = function(){
	this.x+=this.vx;
	this.y+=this.vy;
}
function Player(x,y){
	this.x = x;
	this.y = y;
	this.width = config.playerWidth;
	this.height = config.playerHeight;
	this.score=0;
}
Player.prototype.draw = function(ctx){
	ctx.fillStyle="#fff";
	ctx.fillRect(this.x, this.y, this.width, this.height);
}
function Game() {
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "#000";
	
	this.player1 = new Player(config.startX,this.height/2 - config.playerHeight/2);
	this.player2 = new Player(this.width - config.startX,this.height/2 - config.playerHeight/2);
	this.ball = new Ball(this.width/2,this.height/2);
	this.ball.vx = config.ballSpeed;
	this.ball.vy = 0;
	this.keys = new KeyListener();
}
Game.prototype.draw = function(){
    this.context.clearRect(0, 0, this.width, this.height);
	this.context.fillStyle="#000";
    this.context.fillRect(0, 0, this.width, this.height);
	this.context.fillStyle="#fff";
	this.context.fillRect(this.width/2, 0, 2, this.height);
	
	this.player1.draw(this.context);
	this.player2.draw(this.context);
	this.ball.draw(this.context);
	
	this.context.font = 'italic 20pt Calibri';
	this.context.fillText(this.player1.score,this.width/4,50);
	this.context.fillText(this.player2.score,this.width*3/4,50);
};
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
	this.ball = new Ball(this.width/2,this.height/2);
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
	
	if(this.ball.x <= 0 || this.ball.x >= this.width ){
		this.ball.vx = -this.ball.vx;
	}
	if(this.ball.y <= 0 || this.ball.y >= this.height ){
		this.ball.vy = -this.ball.vy;
	}
	if(this.keys.isPressed(KEY.ARROW_UP)){
		if(this.player1.y > 0 ){
			this.player1.y-=config.playerSpeed;
		}
	}
	if(this.keys.isPressed(KEY.ARROW_DOWN)){
		if(this.player1.y < this.height - this.player1.height ){
			this.player1.y+=config.playerSpeed;
		}
	}
	if(this.keys.isPressed(KEY.W)){
		if(this.player2.y > 0 ){
			this.player2.y-=config.playerSpeed;
		}
	}
	if(this.keys.isPressed(KEY.S)){
		if(this.player2.y < this.height - this.player2.height ){
			this.player2.y+=config.playerSpeed;
		}
	}
	this.checkCollisions();
	this.checkForLoss();
};
function KeyListener() {
    this.pressedKeys = [];
 
    this.keydown = function(e) {
        this.pressedKeys[e.keyCode] = true;
    };
 
    this.keyup = function(e) {
        this.pressedKeys[e.keyCode] = false;
    };
 
    document.addEventListener("keydown", this.keydown.bind(this));
    document.addEventListener("keyup", this.keyup.bind(this));
}
 
KeyListener.prototype.isPressed = function(key){
    return this.pressedKeys[key] ? true : false;
};
 
KeyListener.prototype.addKeyPressListener = function(keyCode, callback){
    document.addEventListener("keypress", function(e) {
        if (e.keyCode == keyCode)
            callback(e);
    });
};
(function(){
	var game;
	var timer;
	
	function newGame() {
		game = new Game();
		timer = window.setInterval(mainLoop, 1000/config.FPS);
    }
	function mainLoop() {
		game.update();
		game.draw();
	}
	
	newGame();
})();