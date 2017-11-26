var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log(socket.id);
    socket.emit('chat message', { message: socket.id + ' se conectou', from: 'server', to: null });

    socket.on('chat message', function (msg) {
        console.log(msg);
    });

    socket.on('disconnect', function () {
        console.log(socket.id + ' se desconectou');
    });

    socket.on('chat message', function (msg) {
        if (msg.to) {
            io.to(msg.to).emit('chat message', msg);
        } else {
            io.emit('chat message', msg);
        }
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});