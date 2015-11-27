(function(module) {
	mifosX.controllers = _.extend(module, {
		ProspectsController : function(scope, resourceFactory,paginatorService, location, webStorage,$rootScope,API_VERSION) {
			
			scope.prospects = [];

			/*resourceFactory.prospectResource.getAllProspects(function(data) {
			    scope.prospects = data;
			}); */
			
			/*scope.PermissionService = PermissionService;
			scope.routeTo = function(id) {
				location.path('/viewprospects/' + parseInt(id));
			};*/

			scope.prospectFetchFunction = function(offset, limit, callback) {
				resourceFactory.getAllProspectResource.getAllDetails({ offset : offset, limit : limit }, callback);
			};
			
			scope.prospects = paginatorService.paginate( scope.prospectFetchFunction, 14 );

			scope.search123 = function( offset, limit, callback ) {
				resourceFactory.getAllProspectResource.getAllDetails({ offset : offset, limit : limit,
					sqlSearch : scope.filterText }, callback);
			};

			scope.search = function(filterText) {
				scope.prospects = paginatorService.paginate(scope.search123, 14);
				scope.filterText = "";
			};
			
			scope.getVal = function(flag) {
				if (flag === "Closed" || flag === "Canceled") {
					return false;
				} else {
					return true;
				}
			};
			
			scope.convertProspect = function(id) {
				resourceFactory.prospectConvertResource.save({ prospectId : id }, {}, function(data) {					
					location.path('/viewclient/' + data.resourceId);
				});
			};
			
			scope.download = function(location){
				window.open($rootScope.hostUrl+ API_VERSION +'/loans/calculator/export?tenantIdentifier=default&file='+location);
			}
		}
	});
	
	mifosX.ng.application.controller('ProspectsController', [ 
	'$scope', 
	'ResourceFactory', 
	'PaginatorService', 
	'$location',				 
	'webStorage',				
	'$rootScope',				
	'API_VERSION',				
	mifosX.controllers.ProspectsController 
	]).run(function($log) {			
		$log.info("ProspectsController initialized");		
	});
	
}(mifosX.controllers || {}));
