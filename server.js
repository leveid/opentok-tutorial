
/*=================================
=            Server.js            =
=================================*/

var express = require('express');
var app     = express();
var OpenTok = require('opentok');
var port    = process.env.PORT || 8585;

var opentok_API_KEY    = '45381742';
var opentok_API_SECRET = 'f088521bf9b477512917941cc7d8a56a9087a1c5';
var sessionId          = '';

var opentok;

function gen_token (res) {
	var token = opentok.generateToken(sessionId);
	res.end(JSON.stringify({
		'api_key': opentok_API_KEY,

		'sessionID': sessionId,
		'token': token
	}));
}

app.get('/chat', function (req, res) {
	if (!opentok)
		opentok = new OpenTok(opentok_API_KEY, opentok_API_SECRET);

	if (!sessionId) {
		opentok.createSession({
			mediaMode: "routed",
			archiveMode: 'always'
		}, function(error, result) {
			if (error) {
				console.log("Error creating session:", error)
			} else {
				sessionId = result.sessionId;
				console.log("Session ID: " + sessionId);
				gen_token(res);
			}
		});

		return;
	}

	gen_token(res);
}).get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.listen(port);
console.log('server started on port ' + port);
