var sip = require('sip');

var m = [ 
    'INVITE sip:bob@biloxi.com SIP/2.0',
    'Via: SIP/2.0/UDP pc33.atlanta.com;branch=z9hG4bK776asdhds',
    'Max-Forwards: 70',
    'To: Bob <sip:bob@biloxi.com>',
    'From: Alice <sip:alice@atlanta.com>;tag=1928301774',
    'Call-ID: a84b4c76e66710@pc33.atlanta.com',
    'CSeq: 314159 INVITE',
    'Contact: <sip:alice@pc33.atlanta.com>',
    'Content-Type: application/sdp',
    'Content-Length: 142',
    'Authorization: Digest username="Alice", realm="atlanta.com", nonce="84a4cc6f3082121f32b42a2187831a9e", response="7587245234b3434cc3412213e5f113a5432"',
    'Proxy-Authorization: Digest username="Alice", realm="atlanta.com", nonce="84a4cc6f3082121f32b42a2187831a9e", response="7587245234b3434cc3412213e5f113a5432"',
    'WWW-Authenticate: Digest realm="atlanta.com", nonce="84a4cc6f3082121f32b42a2187831a9e"',
    'Authentication-Info: nextnonce="1234"',
    'Refer-To: sip:100@somewhere.net',
    '\r\n'].join('\r\n');

for(var i = 0; i != 1e6; ++i) {
  console.log(sip.stringify(sip.parse(m)));
}

