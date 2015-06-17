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
function Game(socket) {
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "#000";
	this.socket = socket;
}
Game.prototype.update = function(data){
	if(!this.player1) this.player1 = new Player(data.player1.x,data.player1.y)
	if(!this.player2) this.player2 = new Player(data.player2.x,data.player2.y)
	if(!this.ball) this.ball = new Ball(data.ball.x,data.ball.y)
	this.player1.x = data.player1.x;
	this.player1.y = data.player1.y;
	this.player1.score = data.player1.score;
	
	this.player2.x = data.player2.x;
	this.player2.y = data.player2.y;
	this.player2.score = data.player2.score;
	
	this.ball.x = data.ball.x;
	this.ball.y = data.ball.y;
	this.ball.vx = data.ball.vx;
	this.ball.vy = data.ball.vy;
};
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
	var socket = io();
	var keys;
	var timer;
	
	function newGame() {
		game = new Game();
    }
	function mainLoop() {
		game.update();
		game.draw();
	}
	socket.on("update",function(data){
		if(!game){
			game=new Game();
			keys = new KeyListener();
			timer = window.setInterval(mainLoop, 1000/config.FPS);
		}
		game.update(data);
		game.draw();
	});
	function mainLoop(){
		if(keys.isPressed(KEY.ARROW_UP)){
			socket.emit("move",{direction:"up"});
		}
		if(keys.isPressed(KEY.ARROW_DOWN)){
			socket.emit("move",{direction:"down"});
		}
	}
	function waitingScreen(){
		var canvas = document.getElementById("game");
		var context = canvas.getContext("2d");
		context.fillStyle="#000";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle="#fff";
		context.font = 'italic 20pt Calibri';
		context.fillText("Waiting for opponent",canvas.width/4,100);
	}
	waitingScreen();
})();