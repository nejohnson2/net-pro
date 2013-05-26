var sip = require('sip');
var util = require('sys');

sip.start({
  logger: {
//    send: function(m) { util.debug(util.inspect(arguments, null, null)); },
//    recv: function(m) { util.debug("recv " + util.inspect(m, null, null)); }
      error: function() { util.debug(util.inspect(arguments, null, null)); }
  }
}, function(rq) {
  util.debug("rq\n" + util.inspect(rq, null, null));  
});

/*
sip.send({
    method: 'INVITE',
    uri: 'sip:123@127.0.0.1:5060;transport=tcp',
    headers: { 
      cseq: { method: 'INVITE', seq: 1},
      to: { uri: 'sip:test'},
      from: { uri: 'sip:test', params: { branch: 123 } },
      'call-id': 'xxxxx',
      'content-length': 0
    }
  },
  function(rs) {
    util.debug(util.inspect(rs, null, null));
  }
);
*/

