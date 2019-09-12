var Local = function() {
	// 游戏对象
	var game;
	// 时间间隔
	var INTERVAL = 200;
	// 时间计数器
	var timeCount = 0;
	// 定时器
	var timer = null;
	// 时间
	var time = 0;
	// 绑定键盘事件
	var bindKeyEvent = function() {
		document.onkeydown = function({keyCode}) {
			switch(keyCode){
				case 38: // up
					game.rotate();
					break;
				case 32: //space
					game.fall();
					break;
				case 37: // left
					game.left();
					break;
				case 39: // rihgt
					game.right();
					break;
				case 40: //down
					game.down();
					break;
				default : 
					break;
			}
		}
	}
	
	// 移动
	var move = function() {
		timeFunc();
		if(!game.down()){
			game.fixed();
			var line = game.checkClear();
			if(line) {
				game.addScore(line);
			}
			var gameOver = game.checkGameOver();
			if(gameOver) {
				game.gameover(false);
				stop();
			}else{
				game.perforNext(generateType(), generateDir());
			}
		}
	}
	
	// 随机生成干扰行
	var generataBottomLine = function(lineNum) {
		var lines = [];
		for(var i = 0; i < lineNum; i++) {
			var line = [];
			for(var j = 0; j < 10; j++){
				line.push(Math.ceil(Math.random() * 2) - 1);
			}
			lines.push(line);
		}
		return lines;
	}
	
	// 计时函数
	var timeFunc = function() {
		timeCount = timeCount + 1;
		if(timeCount == 5){
			timeCount = 0;
			time = time + 1;
			game.setTime(time);
			if(time % 10 == 0) {
				game.addTailLines(generataBottomLine(1))
			}
		}
	}
	// 随机生成一个方块种类
	var generateType = function() {
		return Math.ceil(Math.random() * 7) - 1;
	}
	// 随机生成一个旋转次数
	var generateDir = function() {
		return Math.ceil(Math.random() * 7) - 1;
	}
	// 开始
	var start = function() {
		var doms = {
			gameDiv: document.getElementById('square_game'),
			nextDiv: document.getElementById('square_next'),
			timeDiv: document.getElementById("square_time"),
			scoreDiv: document.getElementById('square_score'),
			resultDiv: document.getElementById('square_gameOver'),
		};
		
		game = new Game();
		game.init(doms, generateType(), generateDir());
		bindKeyEvent();
		game.perforNext(generateType(), generateDir());
		timer = setInterval(move, INTERVAL);
	}
	// 结束
	var stop = function() {
		if(timer) {
			clearInterval(timer);
			timer = null;
		}
		document.onkeydown = null;
	}
	// 导出API
	this.start = start;
}