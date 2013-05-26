var ejs = require('ejs');
var express = require('express');
var app = express.createServer();
var webRTC = require('webrtc.io').listen(app);
/* var sip = require('sip'); */

app.configure(function(){
	app.set('port', process.envPORT || 8080);

    app.set('view engine','ejs');  // use the EJS node module
    app.set('views',__dirname+ '/views'); // use /views as template directory
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    app.register('html',require('ejs')); //use .html files in /views

    app.use(express.static(__dirname + '/public'));
	
	//parse any http form post
	app.use(express.bodyParser());
	
	/**** Turn on some debugging tools ****/
	app.use(express.logger());
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});



app.get('/', function(req, res) {
	res.render('main.html');
});

app.get('/video', function(req, res) {
	res.render('video.html', {layout:false});
});

app.get('/info', function(req, res) {
	res.render('info.html', { layout : true });
});

app.get('/emerg', function(req, res) {
	res.render('emerg.html', { layout : true });
});
/*
app.get('/video', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/style.css', function(req, res) {
  res.sendfile(__dirname + '/style.css');
});

app.get('/fullscrean.png', function(req, res) {
  res.sendfile(__dirname + '/fullscrean.png');
});
app.get('/fullscrean.png', function(req, res) {
  res.sendfile(__dirname + '/mta-logo.png');
});

app.get('/script.js', function(req, res) {
  res.sendfile(__dirname + '/script.js');
});

app.get('/webrtc.io.js', function(req, res) {
  res.sendfile(__dirname + '/webrtc.io.js');
});
*/


webRTC.rtc.on('connect', function(rtc) {
  //Client connected
  console.log("client connected");
});

webRTC.rtc.on('send answer', function(rtc) {
  //answer sent
});

webRTC.rtc.on('disconnect', function(rtc) {
  //Client disconnect 
  console.log("client disconnected");
});

webRTC.rtc.on('chat_msg', function(data, socket) {
  var roomList = webRTC.rtc.rooms[data.room] || [];

  for (var i = 0; i < roomList.length; i++) {
    var socketId = roomList[i];

    if (socketId !== socket.id) {
      var soc = webRTC.rtc.getSocket(socketId);

      if (soc) {
        soc.send(JSON.stringify({
          "eventName": "receive_chat_msg",
          "data": {
            "messages": data.messages,
            "color": data.color
          }
        }), function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    }
  }
});


var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("Listening for new clients on port 8080");	
});