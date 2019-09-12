//  npm install nodejs-websocket
		var app = require('http').createServer()
		var io = require('socket.io')(app)
		
		var PORT = 8001;
		var clientCount = 0;
		
		app.listen(PORT);
		
		io.on('connection', function(socket) {
			clientCount++;
			socket.nickname = 'user' + clientCount + ': ';
			//广播消息
			io.emit('enter', socket.nickname + 'comes in');
			
			socket.on('message', function(str) {
				// 广播消息
				io.emit('message', socket.nickname + 'says: ' + str);
			})
			
			socket.on('disconnect', function() {
				// 广播消息
				io.emit('leave', socket.nickname + 'leave');
			})
		})