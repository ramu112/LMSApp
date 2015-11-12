(function(module) {
  mifosX.controllers = _.extend(module, {
	  ViewFeeMasterController: function(scope, routeParams , location,resourceFactory ,$modal) {
        
        scope.feeMasterData = [];
        resourceFactory.feeMasterResource.get({id: routeParams.id} , function(data) {
            scope.feeMasterData = data.feeMasterData;
            
        });

        scope.deleteFeeMaster = function (){
        	 $modal.open({
	                templateUrl: 'delete.html',
	                controller: deleteCtrl,
	                resolve:{}
	            });
        };
        
    	function  deleteCtrl($scope, $modalInstance) {
    		$scope.delete = function () {
            	resourceFactory.feeMasterResource.remove({id: routeParams.id} , {} , function() {
            	  $modalInstance.dismiss('delete');
                  location.path('/feemaster');
            });
         };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
          };
        }
    }
  });
  mifosX.ng.application.controller('ViewFeeMasterController', [
    '$scope', 
    '$routeParams', 
    '$location',
    'ResourceFactory',
    '$modal',
    mifosX.controllers.ViewFeeMasterController]).run(function($log) {
    $log.info("ViewFeeMasterController initialized");
  });
}(mifosX.controllers || {}));
