var ejs = require('ejs');
var express = require('express');
var app = express.createServer();
var webRTC = require('webrtc.io').listen(app);
var sip = require('sip');
/* var sip = require('sip'); */
var util = require('util');
var os = require('os');

var sys = require('sys')
var exec = require('child_process').exec;

var io = require('socket.io').listen(app);

var usb = require('usb');

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
	res.render('info.html');
});

app.get('/emerg', function(req, res) {
	res.render('emerg.html');
});

app.get('/usb', function(req, res) {
	
	//console.log(usb.getDeviceList());
	
	if(usb.findByIds("0x046d", "0x0825")){
		console.log("FOUND DEVICE");
	}
	
	//console.log(usb.findByIds("0x046d", "0x0825"));

	//Logitec USB Camera: VID: 0x046d  PID: 0x0825
/*
	var device =  usb.findByIds("0x046d", "0x0825");
	
	console.log(device.busNumber);
	
	var inter = device.interfaces;
	
	console.log(inter);
	
	console.log(device.endpoints);	
	device.open();
*/

	var command = "sudo service motion start";
	console.log(command);
	
 	var child = exec(command, function(error, stdout, stderr){
		res.send(stdout);
	});
	
	res.render('usb.html');
});

app.get('/socket', function(req, res) {
	res.render('socket.html');
});

app.get('/sip', function(req, res) {

	var dialogs = {};
	
/* 	var uri_destination = 'sip:17653474729@50.56.219.107'; */
	var uri_destination = 'sip:17653474729@10.0.1.13';
	
	function rstring() { return Math.floor(Math.random()*1e6).toString(); }
	
	
	//starting stack
	sip.start({}, function(rq) {
	  if(rq.headers.to.params.tag) { // check if it's an in dialog request
	    var id = [rq.headers['call-id'], rq.headers.to.params.tag, rq.headers.from.params.tag].join(':');
	    
	    if(dialogs[id])
	      dialogs[id](rq);
	    else
	      sip.send(sip.makeResponse(rq, 481, "Call doesn't exists"));
	  }
	  else
	    sip.send(sip.makeResponse(rq, 405, 'Method not allowed'));
	});
	
	
	// Making the call
	
	sip.send({
	  method: 'INVITE',
	  uri: uri_destination, //sip:<extension>@<ip address>
	  headers: {
	    to: {uri: uri_destination},
	    from: {uri: 'sip:test@test', params: {tag: rstring()}},
	    'call-id': rstring(),
	    cseq: {method: 'INVITE', seq: Math.floor(Math.random() * 1e5)},
	    'content-type': 'application/sdp',
	    contact: [{uri: 'sip:101@' + os.hostname()}]  // if your call doesnt get in-dialog request, maybe os.hostname() isn't resolving in your ip address
	  },
	  content:
	    'v=0\r\n'+
	    'o=- 13374 13374 IN IP4 172.16.2.2\r\n'+
	    's=-\r\n'+
	    'c=IN IP4 172.16.2.2\r\n'+
	    't=0 0\r\n'+
	    'm=audio 16424 RTP/AVP 0 8 101\r\n'+
	    'a=rtpmap:0 PCMU/8000\r\n'+
	    'a=rtpmap:8 PCMA/8000\r\n'+
	    'a=rtpmap:101 telephone-event/8000\r\n'+
	    'a=fmtp:101 0-15\r\n'+
	    'a=ptime:30\r\n'+
	    'a=sendrecv\r\n'
	},
	function(rs) {
	  if(rs.status >= 300) {
	    console.log('call failed with status ' + rs.status);  
	  }
	  else if(rs.status < 200) {
	    console.log('call progress status ' + rs.status);
	  }
	  else {
	    // yes we can get multiple 2xx response with different tags
	    console.log('call answered with tag ' + rs.headers.to.params.tag);
	    
	    // sending ACK
	    sip.send({
	      method: 'ACK',
	      uri: rs.headers.contact[0].uri,
	      headers: {
	        to: rs.headers.to,
	        from: rs.headers.from,
	        'call-id': rs.headers['call-id'],
	        cseq: {method: 'ACK', seq: rs.headers.cseq.seq},
	        via: []
	      }
	    });
	
	    var id = [rs.headers['call-id'], rs.headers.from.params.tag, rs.headers.to.params.tag].join(':');
	
	    // registring our 'dialog' which is just function to process in-dialog requests
	    if(!dialogs[id]) {
	      dialogs[id] = function(rq) {
	        if(rq.method === 'BYE') {
	          console.log('call received bye');
	
	          delete dialogs[id];
	
	          sip.send(sip.makeResponse(rq, 200, 'Ok'));
	        }
	        else {
	          sip.send(sip.makeRespinse(rq, 405, 'Method not allowed'));
	        }
	      }
	    }
	  }
	});

//	res.render('sip.html');
});

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

/*
io.sockets.on('connection', function (socket) {
	console.log('we have connection'+socket);
  socket.emit( );

  socket.on('nick socket', function (data) {
	  console.log('nicks socket on');
    console.log(data);
  });

});
*/
io.sockets.on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('Message Received: ', msg);
        socket.broadcast.emit('message', msg);
    });
});


var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("Listening for new clients on port 5000");	
});

/*
sip.start({ websocket : server }, function(request) {
	console.log("started websocket");
});
*/