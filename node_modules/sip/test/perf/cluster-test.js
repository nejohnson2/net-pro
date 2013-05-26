var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var sip = require('sip');

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i != 2; i++) {
      worker = cluster.fork();
  }

  cluster.on('online', function (worker, code, signal) {
      console.log('worker ' + worker.process.pid + ' online');
  });
} 
else {
  var tcpTransport = sip.makeTransport({
      //logger: { recv: console.log, send: console.log} 
  }, onReceive);

  function onReceive(message, remote) {
      if (message.method && message.method !== 'ACK') {
          console.log(cluster.worker.id);
          tcpTransport.send(remote, sip.makeResponse(message, 486, 'Busy Here'));
      }
  }
}

