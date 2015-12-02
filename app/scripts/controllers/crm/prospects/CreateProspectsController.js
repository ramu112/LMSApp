(function(module) {
	lms.controllers = _.extend(module, {				
		CreateProspectsController : function(scope,resourceFactory,location, dateFilter,$rootScope) {
			
			scope.first = {};
			var datetime = new Date();
			scope.first.date = datetime;
			scope.first.time = datetime.getHours() + ":" + datetime.getMinutes();
	
			scope.formData = {};
			scope.minDate = datetime;
			
			scope.sourceOfPublicityDatas = [];scope.productDatas = [];
			resourceFactory.prospectTemplateResource.getTemplate(function(data) {
				scope.sourceOfPublicityDatas = data.sourceOfPublicityData;
				scope.productDatas = data.productData;
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
	lms.ng.application.controller('CreateProspectsController', [ 
	'$scope', 
	'ResourceFactory', 
	'$location', 
	'dateFilter',
	'$rootScope',
	lms.controllers.CreateProspectsController 
	]).run(function($log) {
		$log.info("CreateProspectsController initialized");	
	});
}(lms.controllers || {}));
