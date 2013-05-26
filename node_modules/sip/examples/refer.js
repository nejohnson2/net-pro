var sip = require('sip');

var uri = 'sip:100@172.16.2.2';

var subscriptions = {};

sip.start({port: 6060}, function(rq) {});

sip.send({
  method: 'REFER',
  uri: uri,
  headers: {
    to: {uri: uri, params: {}},
    from: {uri: 'sip:test@172.16.2.2', params: {tag: '12345'}},
    'call-id': Math.floor(Math.random() * 1e6),
    cseq: {method: 'REFER', seq: 1},
    'refer-to': {uri: 'sip:101@172.16.2.2'},
    'content-length': 0,
    contact: [{uri: 'sip:172.16.2.2:6060'}],
    event: 'refer',
    'allow-events': 'refer',
    accept: 'message/sipfrag'
  }
},
function(rs) {
  console.log(rs);
});

