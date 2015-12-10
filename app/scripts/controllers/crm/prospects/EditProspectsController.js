(function(module) {
	lms.controllers = _.extend(module, {
		EditProspectsController : function(scope, routeParams, route,location, resourceFactory, http, dateFilter, $rootScope) {
			
			scope.first = {};
			var datetime = new Date();
			scope.first.date = datetime;
			scope.first.time = datetime.getHours() + ":" + datetime.getMinutes();
	
			scope.formData = {};
			scope.minDate = datetime;
			
			scope.sourceOfPublicityDatas = [];scope.productDatas = [];
			resourceFactory.prospectResource.get({ id : routeParams.id },function(data) {
				scope.sourceOfPublicityDatas = data.sourceOfPublicityData;
				scope.productDatas = data.productData;
					scope.formData = data;
					for(var k in scope.productDatas){
						if(scope.productDatas[k].productName ==  data.preferredLoanProduct){
							scope.formData.loanProductId = scope.productDatas[k].id;
							break;
						}
					}
					delete scope.formData.location;
					delete scope.formData.status;
					delete scope.formData.isDeleted;
					delete scope.formData.sourceOfPublicityData;
					delete scope.formData.productData;
					
			});
			
			scope.productChange = function(id) {
				
				for(var i in scope.productDatas) {
					if(id == scope.productDatas[i].id) {
						scope.formData.preferredLoanProduct = scope.productDatas[i].productName;
						break;
					}
				}
			}
			
			scope.submit = function() {			
				scope.formData.locale = 'en';
				scope.formData.preferredCallingTime = dateFilter(scope.first.date,'yyyy-MM-dd HH:mm:ss');
				$rootScope.prospectFormData = {};
				$rootScope.prospectFormData = scope.formData;
				if($rootScope.hasPermission("CREATE_LOANCALCULATOR")){
					location.path("/calculator");
				}else{
					location.path("/salecalculator");
				}
				
			};
			
		}				
	});
	lms.ng.application.controller('EditProspectsController', [ 
	'$scope', 
	'$routeParams', 
	'$route', 
	'$location',
	'ResourceFactory', 
	'$http', 
	'dateFilter', 
	'$rootScope',
	lms.controllers.EditProspectsController 
	]).run(function($log) {		
		$log.info("EditProspectsController initialized");
	});
}(lms.controllers || {}));
