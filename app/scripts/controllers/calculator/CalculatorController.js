(function(module) {
  mifosX.controllers = _.extend(module, {
	  CalculatorController: function(scope, resourceFactory, location,$http,$rootScope,API_VERSION,webStorage,$timeout) {
		  
		  scope.formData = {};
		  scope.leaseproducts = [];
		  scope.leaseCalculator = false;
        resourceFactory.loanProductResource.getAllLoanProducts(function(data) {
            scope.leaseproducts = data;
        });
        
        scope.leaseProductChange = function(id){
        	delete scope.formData.vehicleCost;
        	
        	resourceFactory.loanProductResource.get({loanProductId : id, template:'true'}, function(data) {
        		scope.formData.principal = data.principal;
        		scope.formData.interestRatePerPeriod = data.interestRatePerPeriod;
        		if(data.feeMasterData){
        			scope.formData.deposit = data.feeMasterData[0].amount;
        		}else scope.formData.deposit = 0;
        		scope.formData.mileage = 2500;
        		scope.formData.excess = 0.39;
        		scope.formData.FLPForYear = 500;
        		scope.terms = data.numberOfRepayments;
        		scope.charges = data.charges;
        		for(var i in scope.charges){
        			if(scope.charges[i].name == 'COF'){
        				scope.formData.costOfFund = (scope.charges[i].amount*12).toFixed(2); 
        			}
        			if(scope.charges[i].name == 'Maintenance charge'){
        				scope.formData.maintenance = (scope.charges[i].amount*12).toFixed(2); 
        			}
        		}
        	});
        }
        
        scope.isProspect  = false;var prospectFormData = {};
        if($rootScope.prospectFormData && $rootScope.prospectFormData.loanProductId){
        	scope.formData.productId = $rootScope.prospectFormData.loanProductId;
        	prospectFormData = $rootScope.prospectFormData;
        	scope.isProspect  = true;
        	delete $rootScope.prospectFormData;
        	scope.leaseProductChange(scope.formData.productId);
        }
        
        scope.submit = function() {  
        	
            scope.formData.locale='en'; 
            scope.formData.payTerms = [];
            
        	if(scope.terms % 12 == 0){
        		var num = scope.terms / 12;
        		for(var i=1;i<=num;i++){
        			scope.formData.payTerms.push(i*12);
        		}
        	}else{
        		var remainder = scope.terms % 12;
        		var val = scope.terms - remainder;
        		var num = val / 12;
        		for(var i=1;i<=num;i++){
        			scope.formData.payTerms.push(i*12);
        		}
        		scope.formData.payTerms.push(scope.terms);
        	}
        	
        	delete scope.formData.deprecisationArray;
        	delete scope.formData.residualArray;
        	postRequestSend(scope.formData);

        };
        
        function postRequestSend(formData){
        	
            resourceFactory.calculationResource.save(formData,function(data){
            	scope.leaseCalculator = true;
            	scope.calculationData = data.payTerms || [];
            	scope.keys  = [];
            	scope.retailPrice = [];
            	scope.vatAmount = [];
            	scope.purchasePrice = [];
            	scope.coiForYear = [];
            	scope.cofForYear = [];
            	scope.maintenanceForYear = [];
            	scope.replacementTyresForYear = [];
            	scope.comprehensiveInsuranceForYear = [];
            	scope.deprecisationForYear = [];
            	scope.margin = [];
            	scope.totalForYear = [];
            	scope.coi = [];
            	scope.cof = [];
            	scope.maintenance = [];
            	scope.replacementTyres = [];
            	scope.comprehensiveInsurance = [];
            	scope.deprecisation = [];
            	scope.totalWithOutMaintenance = [];
            	scope.totalMaintenance = [];
            	scope.rateWithOutMaintenance = [];
            	scope.costWithOutMaintenance = [];
            	scope.rateWithMaintenance = [];
            	scope.residualDeprecisation = [];
            	scope.residualCost = [];
            	scope.residualAmountVEP = [];
            	scope.residualAmountVIP = [];
            	scope.quoteWithOutMaintenance = [];
            	scope.quoteWithMaintenance = [];
            	scope.mileage = [];
            	scope.excess = [];
            	scope.payoutAdminChargesForYear = [];
            	scope.payoutAdminCharges = [];
            	scope.accountingWDV = [];
            	scope.taxWDV = [];
            	scope.taxWDV = [];
            	
            	for(var i in scope.calculationData){
            		scope.keys.push(scope.calculationData[i].key); 
            		scope.retailPrice.push({"retailPrice":Math.round(scope.calculationData[i].retailPrice)});
            		scope.vatAmount.push({"vatAmount":(scope.calculationData[i].vatAmount).toFixed(2)});
            		scope.purchasePrice.push({"purchasePrice":(scope.calculationData[i].purchasePrice).toFixed(2)});
            		scope.coiForYear.push({"coiForYear":(scope.calculationData[i].coiForYear).toFixed(2)});
            		scope.cofForYear.push({"cofForYear":(scope.calculationData[i].cofForYear).toFixed(2)});
            		scope.maintenanceForYear.push({"maintenanceForYear":(scope.calculationData[i].maintenanceForYear).toFixed(2)});
            		scope.replacementTyresForYear.push({"replacementTyresForYear":(scope.calculationData[i].replacementTyresForYear).toFixed(2)});
            		scope.comprehensiveInsuranceForYear.push({"comprehensiveInsuranceForYear":(scope.calculationData[i].comprehensiveInsuranceForYear).toFixed(2)});
            		scope.deprecisationForYear.push({"deprecisationForYear":Math.round(scope.calculationData[i].deprecisationForYear)});
            		scope.margin.push({"margin":""});
            		scope.totalForYear.push({"totalForYear":(scope.calculationData[i].totalForYear).toFixed(2)});
            		scope.coi.push({"coi":(scope.calculationData[i].coi).toFixed(2)});
            		scope.cof.push({"cof":(scope.calculationData[i].cof).toFixed(2)});
            		scope.maintenance.push({"maintenance":(scope.calculationData[i].maintenance).toFixed(2)});
            		scope.replacementTyres.push({"replacementTyres":(scope.calculationData[i].replacementTyres).toFixed(2)});
            		scope.comprehensiveInsurance.push({"comprehensiveInsurance":(scope.calculationData[i].comprehensiveInsurance).toFixed(2)});
            		scope.deprecisation.push({"deprecisation":(scope.calculationData[i].deprecisation).toFixed(2)});
            		scope.totalWithOutMaintenance.push({"totalWithOutMaintenance":(scope.calculationData[i].totalWithOutMaintenance).toFixed(2)});
            		scope.totalMaintenance.push({"totalMaintenance":(scope.calculationData[i].totalMaintenance).toFixed(2)});
            		scope.rateWithOutMaintenance.push({"rateWithOutMaintenance":(scope.calculationData[i].rateWithOutMaintenance).toFixed(2)});
            		scope.costWithOutMaintenance.push({"costWithOutMaintenance":(scope.calculationData[i].costWithOutMaintenance).toFixed(2)});
            		scope.rateWithMaintenance.push({"rateWithMaintenance":(scope.calculationData[i].rateWithMaintenance).toFixed(2)});
            		scope.residualDeprecisation.push({"residualDeprecisation":(scope.calculationData[i].residualDeprecisation*100).toFixed(2)});
            		scope.residualCost.push({"residualCost":Math.round(scope.calculationData[i].residualCost*100)});
            		scope.residualAmountVEP.push({"residualAmountVEP":Math.round(scope.calculationData[i].residualAmountVEP)});
            		scope.residualAmountVIP.push({"residualAmountVIP":Math.round(scope.calculationData[i].residualAmountVIP)});
            		scope.quoteWithOutMaintenance.push({"quoteWithOutMaintenance":Math.round(scope.calculationData[i].quoteWithOutMaintenance)});
            		scope.quoteWithMaintenance.push({"quoteWithMaintenance":Math.round(scope.calculationData[i].quoteWithMaintenance)});
            		scope.mileage.push({"mileage":Math.round(scope.calculationData[i].mileage)});
            		scope.excess.push({"excess":scope.calculationData[i].excess});
            		scope.payoutAdminChargesForYear.push({"payoutAdminChargesForYear":scope.calculationData[i].payoutAdminChargesForYear});
            		scope.payoutAdminCharges.push({"payoutAdminCharges":(scope.calculationData[i].payoutAdminCharges).toFixed(2)});
            		scope.accountingWDV.push({"accountingWDV":Math.round(scope.calculationData[i].accountWDV)});
            		scope.taxWDV.push({"taxWDV":Math.round(scope.calculationData[i].taxWDV)});
            		
            	}
            	//if(selectedIndexBox.length > 0){
            		
            		$timeout(function() {
            			for(var k in selectedIndexBox){
            				
            				$("#"+selectedIndexBox[k]).css({'color':'red'});
            			}
            		}, 300);
            	//}
            	
            });
        }
        
        /*scope.residualChange = function(val){
        	if(val && val != ""){
        		var index  = scope.deprecisationForYear.length-1;
        		
        		scope.totalForYear[index].totalForYear -= scope.deprecisationForYear[index].deprecisationForYear;
        		scope.deprecisationForYear[index].deprecisationForYear = Math.round((scope.purchasePrice[0].purchasePrice * val)/100);
        		
        		scope.totalForYear[index].totalForYear = (scope.totalForYear[index].totalForYear + scope.deprecisationForYear[index].deprecisationForYear).toFixed(2);
        		
        		var pos = scope.deprecisation.length-1;var termPos = scope.formData.payTerms.length-1;
        		scope.deprecisation[pos].deprecisation = ((scope.deprecisationForYear[index].deprecisationForYear)*
        														(scope.formData.payTerms[termPos]/12)).toFixed(2);
        	}
        }*/
        
        var forYearChangeJsonData = {};var deprecisationArray = []; forYearChangeJsonData.deprecisationArray=[];
        var residualArray = []; forYearChangeJsonData.residualArray=[];var selectedIndexBox = [];
        scope.forYearChange = function(val,i,name){
        	//appling text color when its modified
        	selectedIndexBox.push(name+i+"");
        	
        	deprecisationArray = forYearChangeJsonData.deprecisationArray;
        	var residualArray = forYearChangeJsonData.residualArray;
        	forYearChangeJsonData = scope.formData;
        	forYearChangeJsonData.deprecisationArray = deprecisationArray || [];
        	forYearChangeJsonData.residualArray = residualArray || [];
        	
        	forYearChangeJsonData.deprecisationArray = _.filter(forYearChangeJsonData.deprecisationArray, function(q){
        		return q.key != scope.keys[i];
        	});
        	forYearChangeJsonData.residualArray = _.filter(forYearChangeJsonData.residualArray, function(q){
        		return q.key != scope.keys[i];
        	});
        	
        	
        	function prepareDeprecisationArrayJson (){
        		
        		forYearChangeJsonData.deprecisationArray.push({	"key" : scope.keys[i],
	          										"costOfFund" : scope.cofForYear[i].cofForYear,
	          										"maintenance" : scope.maintenanceForYear[i].maintenanceForYear,
	          										"replacementTyres" : scope.replacementTyresForYear[i].replacementTyresForYear,
	          										"comprehensiveInsurance" : scope.comprehensiveInsuranceForYear[i].comprehensiveInsuranceForYear,
	          										"deprecisation" : scope.residualDeprecisation[i].residualDeprecisation,
	          										"locale":"en"});
	        	
        		forYearChangeJsonData.residualArray.push({ "key" : scope.keys[i],
												"residualVep" : scope.residualAmountVEP[i].residualAmountVEP,
												"locale":"en"
				});
	        	
	        	
	        	postRequestSend(forYearChangeJsonData);
        	 }prepareDeprecisationArrayJson();
        	
           }
        
        scope.downloadFile = function (){
            
          console.log(forYearChangeJsonData);
          var json = {}; 
           json = (forYearChangeJsonData.deprecisationArray.length > 0 || forYearChangeJsonData.residualArray.length > 0) ? forYearChangeJsonData : scope.formData;
        	resourceFactory.calculationExportResource.save(json,function(data){
        		data = angular.fromJson(angular.toJson(data));
        		var fileName = data.fileName;
        		window.open($rootScope.hostUrl+ API_VERSION +'/loans/calculator/export?tenantIdentifier=default&file='+fileName);
        	});
       };
       
       scope.saveFile = function (){
    	   
    	   var json = {}; 
    	   json = (forYearChangeJsonData.deprecisationArray.length > 0 || forYearChangeJsonData.residualArray.length > 0) ? forYearChangeJsonData : scope.formData; 
        	resourceFactory.calculationExportResource.save({command:"PROSPECT"},json,function(data){
        		data = angular.fromJson(angular.toJson(data));
        		
        		var formData = {};
        		formData = prospectFormData;
        		formData.location = data.fileName;
        		formData.prospectLoanCalculatorId = data.prospectLoanCalculatorId;
        		console.log(formData);
        		
        		resourceFactory.prospectResource.save(formData, function(data) {
					location.path('/prospects');										
				});
        		
        	});
       };
    }
  });
  mifosX.ng.application.controller('CalculatorController', ['$scope', 'ResourceFactory', '$location','$http','$rootScope','API_VERSION','webStorage','$timeout', mifosX.controllers.CalculatorController]).run(function($log) {
    $log.info("CalculatorController initialized");
  });
}(mifosX.controllers || {}));