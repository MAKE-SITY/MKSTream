angular.module('feat', [])

.controller('featController', function($scope, $state) {
	
	$scope.clicker = function() {
    console.log('im executing');
    $state.go('test');
  };
})

.controller('webRTCController', ['$scope', '$http', function($scope, $http){
	/**
	 * user uploaded file
	 * retrieve file & convert it to binary
	 **/ 

	$scope.count = 0;
	$scope.peer = new Peer({
		config: {'iceServers': [
				{url:'stun:stun01.sipphone.com'},
				{url:'stun:stun.ekiga.net'},
				{url:'stun:stun.fwdnet.net'},
				{url:'stun:stun.ideasip.com'},
				{url:'stun:stun.iptel.org'},
				{url:'stun:stun.rixtelecom.se'},
				{url:'stun:stun.schlund.de'},
				{url:'stun:stun.l.google.com:19302'},
				{url:'stun:stun1.l.google.com:19302'},
				{url:'stun:stun2.l.google.com:19302'},
				{url:'stun:stun3.l.google.com:19302'},
				{url:'stun:stun4.l.google.com:19302'},
				{url:'stun:stunserver.org'},
				{url:'stun:stun.softjoys.com'},
				{url:'stun:stun.voiparound.com'},
				{url:'stun:stun.voipbuster.com'},
				{url:'stun:stun.voipstunt.com'},
				{url:'stun:stun.voxgratia.org'},
				{url:'stun:stun.xten.com'} ]
		},
		key: 'slp678osk0oa8aor'});

	$scope.peer.on('open', function(id) {
		$http({
			method: 'POST',
			url: '/api/webrtc/users',
			data: {userId: id}
		});
	});

	// callee arrives at site after caller
	$scope.peer.on('connection', function(conn){
		
		// TODO: add file inside call to send

		$scope.conn = conn;
		console.log('does this ever happen', conn);
		$scope.conn.on('data', function(data) {
			console.log('data response from bitches', data);
		});
	});

	$scope.ping = function(){
		$scope.conn.send('hello world');
	};

	$scope.callRecipient = function(){
		$http({
			method: 'GET',
			url: '/api/webrtc/users'
		})
		.then(function(res){
			// expecting 'res' to contain caller userID
			if(res.data[res.data.length-1]){
				$scope.conn = $scope.peer.connect(res.data[res.data.length-1]);
				$scope.conn.on('data', function(data) {
				});
			}

		});
	};
	//TODO:need an event listener for every time a file is added to send that file

}]);