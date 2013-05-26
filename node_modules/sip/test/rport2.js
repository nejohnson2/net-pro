(function() {
  var assert, message, runTests, sip, socket, test1, test2, test3, udp, util;
  sip = require('sip');
  udp = require('dgram');
  assert = require('assert');
  util = require('util');
  sip.start({
    rport: true
  }, function(rq) {
    return sip.send(sip.makeResponse(rq, 500));
  });
  socket = udp.createSocket('udp4');
  socket.bind(6060);
  message = {
    method: 'OPTIONS',
    uri: 'sip:127.0.0.1:6060;transport=udp',
    headers: {
      cseq: {
        method: 'OPTIONS',
        seq: 1
      },
      'call-id': 'hrbtch',
      to: {
        uri: 'sip:test@127.0.0.1'
      },
      from: {
        uri: 'sip:test@127.0.0.1'
      }
    }
  };
  test1 = function(success) {
    socket.on('message', function(msg, rinfo) {
      var parsed, rs;
      parsed = sip.parse(msg);
      assert.ok(parsed.headers.via[0].params.hasOwnProperty('rport'));
      rs = sip.stringify(sip.makeResponse(sip.parse(msg), 200));
      return socket.send(new Buffer(rs), 0, rs.length, rinfo.port, rinfo.address);
    });
    return sip.send(sip.copyMessage(message), function(rs) {
      assert.equal(200, rs.status);
      return success();
    });
  };
  test2 = function(success) {
    socket.on('message', function(msg, rinfo) {
      var parsed, rs;
      parsed = sip.parse(msg);
      rs = sip.stringify(sip.makeResponse(parsed, 200));
      return socket.send(new Buffer(rs), 0, rs.length, parsed.headers.via[0].port, rinfo.address);
    });
    return sip.send(message, function(rs) {
      assert.equal(200, rs.status);
      return success();
    });
  };
  test3 = function(success) {
    sip.stop();
    sip.start({
      rport: false
    }, function(rq) {
      return sip.send(sip.makeResponse(rq, 500));
    });
    socket.on('message', function(msg, rinfo) {
      var parsed, rs;
      parsed = sip.parse(msg);
      assert.ok(!parsed.headers.via[0].params.hasOwnProperty('rport'));
      rs = sip.stringify(sip.makeResponse(sip.parse(msg), 200));
      return socket.send(new Buffer(rs), 0, rs.length, rinfo.port, rinfo.address);
    });
    return sip.send(sip.copyMessage(message), function() {
      return success();
    });
  };
  runTests = function(tests) {
    if (tests.length === 0) {
      return process.exit();
    } else {
      return tests[0](function() {
        console.log('ok');
        return runTests(tests.slice(1, tests.length));
      });
    }
  };
  runTests([test1, test2, test3]);
}).call(this);
