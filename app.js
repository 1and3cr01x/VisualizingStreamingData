var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var kafka = require('kafka-node');

server.listen(3000);

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Kafka Consumer Config
var zkserver = 'localhost:2181';
var kafka_client_id = 'socket.io-kafka';
var kafkaClient = new kafka.Client(zkserver,kafka_client_id);
var consumer = new kafka.Consumer(kafkaClient,[{topic: 'test'}],{autoCommit: true});
// var topics = ['test'];

// Sending data to client
io.on('connection', function (socket) {
	console.log("A client just connected.");
});

consumer.on('message', function (message) {
  io.emit('kafka-handshake', message);
});