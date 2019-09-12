var Local = function(socket) {
	// 游戏对象
	var game;
	// 时间间隔
	var INTERVAL = 2000;
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
					socket.emit('rotate');
					break;
				case 32: //space
					game.fall();
					socket.emit('fall');
					break;
				case 37: // left
					game.left();
					socket.emit('left');
					break;
				case 39: // rihgt
					game.right();
					socket.emit('right');
					break;
				case 40: //down
					game.down();
					socket.emit('down');
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
			socket.emit('fixed');
			var line = game.checkClear();
			if(line) {
				game.addScore(line);
				socket.emit('line', line);
				if(line > 1) {
					var bottomLines = generataBottomLine(line);
					socket.emit('bottomLines', bottomLines);
				}
			}
			var gameOver = game.checkGameOver();
			if(gameOver) {
				game.gameover(false);
				document.getElementById('remote_gameOver').innerHTML = '你赢了';
				socket.emit('lose');
				stop();
			}else{
				var t = generateType();
				var d = generateDir();
				game.perforNext(t, d);
				socket.emit('next', {type: t, dir: d});
			}
		} else {
			socket.emit('down');
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
			socket.emit('time', time);
			game.setTime(time);
			
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
		var type =  generateType();
		var dir  = generateDir();
		game.init(doms, type, dir);
		socket.emit('init', {type: type, dir: dir});
		bindKeyEvent();
		var t = generateType();
		var d = generateDir();
		game.perforNext(t, d);
		socket.emit('next', {type: t, dir: d});
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
	
	socket.on('start', function() {
		document.getElementById('waiting').innerHTML = '';
		start();
	});
	socket.on('lose', function() {
		game.gameover(true);
		stop();
	})
	socket.on('leave', function() {
		document.getElementById('square_gameOver').innerHTML = '对方掉线';
		document.getElementById('remote_gameOver').innerHTML = '已掉线';
		stop();
	})
	socket.on('bottomLines', function(data) {
		game.addTailLines(data);
		socket.emit('addTailLines', data)
	})
}