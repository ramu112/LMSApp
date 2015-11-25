(function(module) {
	mifosX.controllers = _.extend(module, {				
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
						//webStorage.add("prospectData",{formData : scope.formData,file:""});
						break;
					}
				}
			}
			
			scope.submit = function() {			
				scope.formData.locale = 'en';
				scope.formData.preferredCallingTime = dateFilter(scope.first.date,'yyyy-MM-dd HH:mm:ss');
				$rootScope.prospectFormData = {};
				$rootScope.prospectFormData = scope.formData;
				location.path("/calculator");
				
			};						
		}			
	});
	mifosX.ng.application.controller('CreateProspectsController', [ 
	'$scope', 
	'ResourceFactory', 
	'$location', 
	'dateFilter',
	'$rootScope',
	mifosX.controllers.CreateProspectsController 
	]).run(function($log) {
		$log.info("CreateProspectsController initialized");	
	});
}(mifosX.controllers || {}));
