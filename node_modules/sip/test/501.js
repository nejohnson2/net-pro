var sip = require('sip');

sip.start({address: '172.16.2.2', port: 35060}, function(rq) {
  sip.send(sip.makeResponse(rq, 501, 'Not Implemented'));
});

