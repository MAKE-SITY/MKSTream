angular.module('feat', [
		'utils'
	])

.controller('webRTCController', ['$scope', '$http', 'webRTC', 'fileUpload', function($scope, $http, webRTC, fileUpload){
	/**
	  * user uploaded file
	  * retrieve file & convert it to binary
	  */

	// $scope.peer = webRTC.createPeer();

	// $scope.peer.on('open', function(id) {
	// 	// TODO: create special link to send with post in data
	// 	$http({
	// 		method: 'POST',
	// 		url: '/api/webrtc/users',
	// 		data: {userId: id}
	// 	});
	// });

	// $scope.peer.on('connection', function(conn){
	// 	// TODO: add file inside call to send
	// 	$scope.conn = conn;
	// 	console.log('does this ever happen', conn);
	// 	$scope.conn.on('data', function(data) {
	// 		console.log('data response from bitches', data);
	// 	});
	// });

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