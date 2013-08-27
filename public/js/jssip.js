var configuration = {
  'ws_servers': 'ws://sip-ws.example.com',
  'uri': 'sip:17654307001@50.56.219.107',
};

var coolPhone = new JsSIP.UA(configuration);

console.log("Making Call");
coolPhone.start();

// Make an audio/video call:

// HTML5 <video> elements in which local and remote video will be shown
var selfView =   document.getElementById('my-video');
var remoteView =  document.getElementById('peer-video');

// Register callbacks to desired call events
var eventHandlers = {
  'progress': function(e){
    console.log('call is in progress');
  },
  'failed': function(e){
    console.log('call failed with cause: '+ e.data.cause);
  },
  'ended': function(e){
    console.log('call ended with cause: '+ e.data.cause);
  },
  'started': function(e){
    var rtcSession = e.sender;

    console.log('call started');

    // Attach local stream to selfView
    if (rtcSession.getLocalStreams().length > 0) {
      selfView.src = window.URL.createObjectURL(rtcSession.getLocalStreams()[0]);
    }

    // Attach remote stream to remoteView
    if (rtcSession.getRemoteStreams().length > 0) {
      remoteView.src = window.URL.createObjectURL(rtcSession.getRemoteStreams()[0]);
    }
  }
};

var options = {
  'eventHandlers': eventHandlers,
  'mediaConstraints': {'audio': true, 'video': true}
};


coolPhone.call('sip:bob@example.com', options);