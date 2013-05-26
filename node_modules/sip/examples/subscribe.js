var sip = require('sip');

var uri = 'sip:100@172.16.1.39';

var subscriptions = {};

sip.start({
  port: 6060,
  logger: {
    recv: console.log,
    send: console.log
  }
},
function(rq) {
  if(rq.method === 'NOTIFY') {
    var rs = sip.makeResponse(rq, 200, 'OK');
    rs.headers['subscription-state'] = 'active';
    rs.headers.accept = 'application/dialog-info+xml';
    rs.headers.event = 'dialog';
    rs.headers['content-length'] = 0;
    rs.headers.expire = 3600;
    sip.send(rs);
  }
  else
    sip.send(sip.makeResponse(rq, 405, 'Method Not Allowed'));
});

sip.send({
  method: 'SUBSCRIBE',
  uri: uri,
  headers: {
    to: {uri: uri},
    from: {uri: uri, params: {tag: '12345678'}},
    'call-id': Math.floor(Math.random() * 1e6),
    cseq: {method: 'SUBSCRIBE', seq: 1},
    event: 'dialog',
    accept: 'application/dialog-info+xml',
    expires: 3600,
    contact: [{uri: 'sip:172.16.2.2:6060'}]
  }
},
function(rs) {
});

