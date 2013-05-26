var sdp = require('sip/sdp');
var util = require('util');

var content = 
"v=0\r\n\
o=mhandley 29739 7272939 IN IP4 192.0.2.3\r\n\
s=-\r\n\
c=IN IP4 192.0.2.4\r\n\
t=0 0\r\n\
m=audio 49217 RTP/AVP 0 12\r\n\
m=video 3227 RTP/AVP 31\r\n\
a=rtpmap:31 LPC\r\n\
m=video 5000 RTP/AVP 156\r\n\
a=rtpmap:156: H264\r\n\
c=IN IP4 192.168.1.1\r\n";

console.log(util.inspect(sdp.parse(content), null, null));

