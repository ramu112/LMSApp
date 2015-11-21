(function(module) {
	mifosX.controllers = _.extend(module, {				
		CreateProspectsController : function(scope,resourceFactory, 
				location, dateFilter,$rootScope,webStorage,API_VERSION) {
			
			scope.sourceOfPublicityDatas = [];
			scope.productDatas = [];
			
			scope.first = {};
			var datetime = new Date();
			scope.first.date = datetime;
			scope.first.time = datetime.getHours() + ":" + datetime.getMinutes();
	
			scope.formData = {};
			scope.minDate = new Date();
			
			var prospectData = webStorage.get("prospectData");
			webStorage.remove("prospectData");
			if(prospectData){
				scope.formData = prospectData.formData;
				scope.formData.location = prospectData.file;
				scope.formData.prospectLoanCalculatorId = prospectData.prospectLoanCalculatorId;
				
				scope.isFileShow  = true;
				
			}
			
			scope.downloadFile = function(){
				
				//window.open($rootScope.hostUrl+ API_VERSION +'/loans/calculator/export?tenantIdentifier=default&file='+scope.formData.fileName);
				window.open($rootScope.hostUrl+ API_VERSION +'/loans/calculator/export?tenantIdentifier=default&file='+scope.formData.location);
			}

			/*$('#timepicker1').timepicker({
				showInputs : false,
				showMeridian : false,
				
			});*/
						
			resourceFactory.prospectTemplateResource.getTemplate(function(data) {
				scope.sourceOfPublicityDatas = data.sourceOfPublicityData;
				scope.productDatas = data.productData;
				console.log(scope.productDatas);
				
										
				/*for ( var i in scope.sourceOfPublicityDatas) {					
					if (scope.sourceOfPublicityDatas[i].mCodeValue == "Phone") {												
						scope.formData.sourceOfPublicity = scope.sourceOfPublicityDatas[i].mCodeValue;					
					}									
				}	*/						
			});
			
			scope.assignData = function(val) {
				this.formData.locale = 'en';
				
				for(var i in scope.productDatas) {
					if(val === scope.productDatas[i].productName) {
						this.formData.loanProductId = scope.productDatas[i].id;
						webStorage.add("prospectData",{formData : scope.formData,file:""});
						break;
					}
				}
			}
			
			scope.calculateBtn = function(){
				if(scope.formData.loanProductId)
					scope.calculateURL = "#/calculator?id="+scope.formData.loanProductId;
				else{
					alert("Please select product..!");
				}
			}
				
			scope.submit = function() {			
				this.formData.locale = 'en';
				var reqDate = dateFilter(scope.first.date,'yyyy-MM-dd HH:mm:ss');
				this.formData.preferredCallingTime = reqDate;
				
				resourceFactory.prospectResource.save(this.formData, function(data) {
					location.path('/prospects');										
				});							
			};						
		}			
	});
	mifosX.ng.application.controller('CreateProspectsController', [ 
	'$scope', 
	'ResourceFactory', 
	'$location', 
	'dateFilter',
	'$rootScope',
	'webStorage',
	'API_VERSION',
	mifosX.controllers.CreateProspectsController 
	]).run(function($log) {
		$log.info("CreateProspectsController initialized");	
	});
}(mifosX.controllers || {}));
