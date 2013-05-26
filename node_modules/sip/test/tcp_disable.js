var sip = require('sip');
var util = require('sys');

sip.start({
  logger: {
    send: function(m) { util.debug("send " + util.inspect(arguments, null, null)); },
    recv: function(m) { util.debug("recv " + util.inspect(m, null, null)); },
    error: function() { util.debug('error ' + util.inspect(arguments, null, null)); }
  },
  tcp: false
}, 
function(rq) {
  util.debug("rq\n" + util.inspect(rq, null, null));  
});

sip.send({
    method: 'INVITE',
    uri: 'sip:123@cnn.com',
    headers: { 
      cseq: { method: 'INVITE', seq: 1},
      to: { uri: 'sip:test'},
      from: { uri: 'sip:test', params: { branch: 123 } },
      'call-id': 'xxxxx',
      'content-length': 0
    }
  },
  function(rs) {
    util.debug('response ' + util.inspect(rs, null, null));
  }
);

