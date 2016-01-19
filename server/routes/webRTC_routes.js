module.exports = function(app){
	//temporary.storage for testing:
	var tempArray = [];

	app.post('/users', function(req, res){
		tempArray.push(req.body.userId);
		res.status(200);
		res.send(tempArray);

		// TODO: store caller userID, somehow
			// tie to random link generated
	});

	app.get('/users', function(req, res){
		res.status(200);
		res.send(tempArray);
	});

	// When someone accesses one of the created links,
	// make a request here for callee to recieve the caller userID
};