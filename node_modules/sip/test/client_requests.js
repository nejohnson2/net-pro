var sip = require('sip');

sip.start({
  logger: {
    send: console.log.bind('send'),
    recv: console.log.bind('recv')
  },
  address: '172.16.2.2',
  port: 6060
},
function(rq) {
  sip.send(sip.makeResponse(rq, 500));
});


sip.send({
  method: 'REGISTER',
  uri: 'sip:100@172.16.2.2',
  headers: {
    to: {uri: 'sip:100@172.16.2.2' },
    from: {uri: 'sip:100@172.16.2.2', params: {tag: '12345678'}},
    'call-id': Math.floor(Math.random()*1e6),
    cseq: {seq: 1, method: 'REGISTER'},
    contact: [{uri:'sip:100@172.16.2.2'}]
  }
});

