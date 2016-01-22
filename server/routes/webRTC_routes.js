var dbHelpers = require('../database_queries/database_queries.js');

module.exports = function(app){
	app.post('/users', function(req, res){
		var packet = req.body;
		if(packet.userId){
			console.log('SENDER post event');
			dbHelpers.addLink(packet.hash, packet.userId)
			.then(function(result){
				res.status(201);
				res.send('link added');
			});
		} else {
			console.log('RECEIVER post response event');
			dbHelpers.addReceiverToSender(packet.hash, packet.recipientId)
			.then(function(result) {
				console.log('adding receiverToSender');
				dbHelpers.getSenderId(packet.hash)
				.then(function(result) {
					res.status(200);	
					res.send(result);
				});
			});
		}

		// TODO: store caller userID, somehow
			// tie to random link generated
	});

	app.get('/users', function(req, res){
		res.status(200);
		res.send(      );
	});

	// When someone accesses one of the created links,
	// make a request here for callee to recieve the caller userID
};