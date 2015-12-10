(function(module) {
  lms.controllers = _.extend(module, {
	  ViewItemController: function(scope, routeParams , resourceFactory ,location,$modal,$filter) {
        scope.item = [];
        scope.audit = [];
        scope.showType="";
        //scope.PermissionService = PermissionService;
        scope.totalItem=routeParams.totalItem;
        var showtype = routeParams.showtype;
        scope.totalItem=routeParams.totalItem;
        resourceFactory.itemResource.get({itemId: routeParams.id} , function(data) {
        	scope.item = data;
        	scope.audit = data.auditDetails;
        	scope.itemPricesDatas = data.itemPricesDatas;
        	for(var i in scope.itemPricesDatas){
            	scope.itemPricesDatas[i].price = $filter("number")(scope.itemPricesDatas[i].price,2);
           }
        });
        
        scope.deleteItem = function(){
            $modal.open({
                templateUrl: 'approve.html',
                controller: Approve,
                resolve:{}
            });
        
    		
    	};
    	
    	scope.showAudit = function(){
    		scope.showType = "audit";
    	};
    	scope.showItems =function(){
    		scope.showType = "item";
    	};
    	if(showtype == 'audit'){
    		scope.showAudit();
    	}
    	var Approve = function ($scope, $modalInstance) {
            $scope.approve = function (act) {
                scope.approveData = {};
            resourceFactory.itemResource.delete({itemId: routeParams.id},{},function(data){
                    location.path('/inventory');

            });
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
    }
  });
  lms.ng.application.controller('ViewItemController', ['$scope', '$routeParams','ResourceFactory', '$location','$modal','$filter',lms.controllers.ViewItemController]).run(function($log) {
    $log.info("ViewItemController initialized");
  });
}(lms.controllers || {}));
