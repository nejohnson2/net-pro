var sip = require('sip');

process.on('uncaughtException', function(e) { console.log(e.stack); });

var transport = sip.makeTransport({
//  logger: { recv: console.log, send: console.log}
}, function(m, remote) {
  if(m.method) {
    if(remote.protocol === 'UDP' && !m.headers.via[0].params.hasOwnProperty('rport'))
        remote = {protocol: 'UDP', port: m.headers.via[0].port || 5060, address: remote.address};

    transport.send(remote, sip.makeResponse(m, 486, 'Busy here'));
  }
});

