(function(module) {
  mifosX.controllers = _.extend(module, {
	  CalculatorController: function(scope, resourceFactory, location,$http,$rootScope,API_VERSION) {
		  
		  scope.formData = {};
		  scope.leaseproducts = [];
		  scope.leaseCalculator = false;
		  scope.termsData = [{value : 12},{value : 24},{value : 36},{value : 48},{value : 60},{value : 90}];
		  scope.terms = 60;
        resourceFactory.loanProductResource.getAllLoanProducts(function(data) {
            scope.leaseproducts = data;
        });
        
        
        scope.leaseProductChange = function(id){
        	delete scope.formData.vehicleCost;
        	
        	resourceFactory.loanProductResource.get({loanProductId : id, template:'true'}, function(data) {
        		scope.formData.principal = data.principal;
        		scope.formData.interestRatePerPeriod = data.interestRatePerPeriod;
        		scope.formData.deposit = 0;
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
        
        scope.submit = function() {  
        	
            scope.formData.locale='en'; 
            scope.formData.payTerms = [];
            
            for(var i in scope.termsData){
            	
              if(scope.termsData[i].value <= scope.terms){
            	scope.formData.payTerms.push(scope.termsData[i].value);
              }
            }
                        
            /*scope.formData.payTerms = ["12","24","36","48","60","90"];*/

            resourceFactory.calculationResource.save(scope.formData,function(data){
            	scope.leaseCalculator = true;
            	scope.calculationData = data.payTerms || [];
            	scope.keys  = [];
            	scope.retailPrice = [];
            	scope.vatAmount = [];
            	scope.purchasePrice = [];
            	scope.coiForYear = [];
            	scope.cofForYear = [];
            	scope.maintenanceForYear = [];
            	scope.deprecisationForYear = [];
            	scope.margin = [];
            	scope.totalForYear = [];
            	scope.coi = [];
            	scope.cof = [];
            	scope.maintenance = [];
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
            	scope.quoteWMaintenance = [];
            	scope.mileage = [];
            	scope.excess = [];
            	scope.financialleasepayout = [];
            	scope.accountingWDV = [];
            	scope.taxWDV = [];
            	
            	for(var i in scope.calculationData){
            		scope.keys.push(scope.calculationData[i].key); 
            		scope.retailPrice.push({"retailPrice":Math.round(scope.calculationData[i].retailPrice)});
            		scope.vatAmount.push({"vatAmount":(scope.calculationData[i].vatAmount).toFixed(2)});
            		scope.purchasePrice.push({"purchasePrice":(scope.calculationData[i].purchasePrice).toFixed(2)});
            		scope.coiForYear.push({"coiForYear":(scope.calculationData[i].coiForYear).toFixed(2)});
            		scope.cofForYear.push({"cofForYear":(scope.calculationData[i].cofForYear).toFixed(2)});
            		scope.maintenanceForYear.push({"maintenanceForYear":(scope.calculationData[i].maintenanceForYear).toFixed(2)});
            		scope.deprecisationForYear.push({"deprecisationForYear":Math.round(scope.calculationData[i].deprecisationForYear)});
            		scope.margin.push({"margin":""});
            		scope.totalForYear.push({"totalForYear":(scope.calculationData[i].totalForYear).toFixed(2)});
            		scope.coi.push({"coi":(scope.calculationData[i].coi).toFixed(2)});
            		scope.cof.push({"cof":(scope.calculationData[i].cof).toFixed(2)});
            		scope.maintenance.push({"maintenance":(scope.calculationData[i].maintenance).toFixed(2)});
            		scope.deprecisation.push({"deprecisation":(scope.calculationData[i].deprecisation).toFixed(2)});
            		scope.totalWithOutMaintenance.push({"totalWithOutMaintenance":(scope.calculationData[i].totalWithOutMaintenance).toFixed(2)});
            		scope.totalMaintenance.push({"totalMaintenance":(scope.calculationData[i].totalMaintenance).toFixed(2)});
            		scope.rateWithOutMaintenance.push({"rateWithOutMaintenance":(scope.calculationData[i].rateWithOutMaintenance).toFixed(2)});
            		scope.costWithOutMaintenance.push({"costWithOutMaintenance":(scope.calculationData[i].costWithOutMaintenance).toFixed(2)});
            		scope.rateWithMaintenance.push({"rateWithMaintenance":(scope.calculationData[i].rateWithMaintenance).toFixed(2)});
            		scope.residualDeprecisation.push({"residualDeprecisation":Math.round(scope.calculationData[i].residualDeprecisation*100)});
            		scope.residualCost.push({"residualCost":Math.round(scope.calculationData[i].residualCost*100)});
            		scope.residualAmountVEP.push({"residualAmountVEP":Math.round(scope.calculationData[i].residualAmountVEP)});
            		scope.residualAmountVIP.push({"residualAmountVIP":Math.round(scope.calculationData[i].residualAmountVIP)});
            		scope.quoteWithOutMaintenance.push({"quoteWithOutMaintenance":Math.round(scope.calculationData[i].quoteWithOutMaintenance)});
            		scope.quoteWMaintenance.push({"quoteWMaintenance":Math.round(scope.calculationData[i].quoteWMaintenance)});
            		scope.mileage.push({"mileage":""});
            		scope.excess.push({"excess":0.39});
            		scope.financialleasepayout.push({"financialleasepayout":""});
            		scope.accountingWDV.push({"accountingWDV":Math.round(scope.calculationData[i].accountWDV)});
            		scope.taxWDV.push({"taxWDV":Math.round(scope.calculationData[i].taxWDV)});
            	}
            	
            });
        };
        
        scope.residualChange = function(val){
        	if(val && val != ""){
        		var index  = scope.deprecisationForYear.length-1;
        		
        		scope.totalForYear[index].totalForYear -= scope.deprecisationForYear[index].deprecisationForYear;
        		scope.deprecisationForYear[index].deprecisationForYear = Math.round((scope.purchasePrice[0].purchasePrice * val)/100);
        		
        		scope.totalForYear[index].totalForYear = (scope.totalForYear[index].totalForYear + scope.deprecisationForYear[index].deprecisationForYear).toFixed(2);
        		
        		var pos = scope.deprecisation.length-1;var termPos = scope.formData.payTerms.length-1;
        		scope.deprecisation[pos].deprecisation = ((scope.deprecisationForYear[index].deprecisationForYear)*
        														(scope.formData.payTerms[termPos]/12)).toFixed(2);
        	}
        }
        
        scope.downloadFile = function (){
            
           // window.open($rootScope.hostUrl+ API_VERSION +'/loans/printlsrdoc/'+routeParams.loanId+'?tenantIdentifier=default');
        	
        	resourceFactory.calculationExportResource.save(scope.formData,function(data){
        		data = angular.fromJson(angular.toJson(data));
        		var fileName = data.fileName;
        		window.open($rootScope.hostUrl+ API_VERSION +'/loans/calculator/export?tenantIdentifier=default&file='+fileName);
        	});
       };
    }
  });
  mifosX.ng.application.controller('CalculatorController', ['$scope', 'ResourceFactory', '$location','$http','$rootScope','API_VERSION', mifosX.controllers.CalculatorController]).run(function($log) {
    $log.info("CalculatorController initialized");
  });
}(mifosX.controllers || {}));