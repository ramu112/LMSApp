(function(module) {
  lms.controllers = _.extend(module, {
	  FeeMasterController: function(scope,webStorage, resourceFactory, location,$rootScope,$modal,route) {
		  
		  scope.feeMasterDatas = [];
		  resourceFactory.feeMasterResource.query(function(data){
			  scope.feeMasterDatas = data;
		  });
		  
		  scope.deleteFeeMaster = function (id){
	        	 $modal.open({
		                templateUrl: 'approve.html',
		                controller: approveCtrl,
		                resolve: {
		                    id: function () {
		                      return id;
		                    }
		                  }
		            });
	        };
	        
	    	function  approveCtrl($scope, $modalInstance,id) {
	    		$scope.approve = function () {
	            	resourceFactory.feeMasterResource.remove({id: id} , {} , function() {
	            	  $modalInstance.dismiss('delete');
	            	  route.reload();
	            });
	         };
	            $scope.cancel = function () {
	                $modalInstance.dismiss('cancel');
	          };
	        }
	  }
  });
  lms.ng.application.controller('FeeMasterController', ['$scope','webStorage', 'ResourceFactory', '$location','$rootScope','$modal','$route', lms.controllers.FeeMasterController]).run(function($log) {
    $log.info("FeeMasterController initialized");
  });
}(lms.controllers || {}));
