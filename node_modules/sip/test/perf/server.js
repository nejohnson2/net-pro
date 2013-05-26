var sip = require('sip');

sip.start({
//  logger: { recv: console.log, send: console.log }
}, function(rq) {
  sip.send(sip.makeResponse(rq, 486, 'Busy Here'));
});

