var sip = require('sip');

sip.start({
  port: process.argv[3] || 6060,
//  logger: { recv: console.log, send: console.log } 
}, function(rq) {});

function generator(n, callback) {
  if(n == 0) {
    callback();
    return;
  } 

  var m = {
    method: 'INVITE',
    uri: 'sip:test@127.0.0.1:5060;transport=udp',
    headers : {
      from: { uri: 'sip:test@test' },
      to: { uri: 'sip:test@test' },
      'call-id': Math.floor(Math.random() * 1e6),
      cseq: {method:'INVITE', seq: 1}
    },
  };

  sip.send(m, function(rs) {
    generator(n-1, callback);
  });
}

var t1 = Date.now();
generator(parseInt(process.argv[2]), function() { console.log('Done in', Date.now() - t1, 'ms'); });
