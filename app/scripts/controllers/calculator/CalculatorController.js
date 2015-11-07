(function(module) {
  mifosX.controllers = _.extend(module, {
	  CalculatorController: function(scope, resourceFactory, location) {
		  
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
        		scope.charges = data.charges;
        		for(var i in scope.charges){
        			if(scope.charges[i].name == 'COF'){
        				scope.formData.costOfFund = scope.charges[i].amount; 
        			}
        			if(scope.charges[i].name == 'Maintenance charge'){
        				scope.formData.maintenance = scope.charges[i].amount; 
        			}
        		}
        	});
        }
        
        scope.submit = function() {  
        	
            scope.formData.locale='en'; 
            scope.formData.payTerms = ["12","24","36","48","60","90"];

            resourceFactory.calculationResource.save(scope.formData,function(data){
            	scope.leaseCalculator = true;
            	scope.calculationData = data.payTerms || [];
            	scope.keys  = [];
            	scope.retailPrice = [];
            	scope.vatAmount = [];
            	scope.purchasePrice = [];
            	scope.coiForMonth = [];
            	scope.cofForMonth = [];
            	scope.maintenanceForMonth = [];
            	scope.deprecisationForMonth = [];
            	scope.margin = [];
            	scope.totalForMonth = [];
            	scope.coiForYear = [];
            	scope.cofForYear = [];
            	scope.maintenanceForYear = [];
            	scope.deprecisationForYear = [];
            	scope.totalWOMaintenance = [];
            	scope.totalMaintenance = [];
            	scope.rateWOMaintenance = [];
            	scope.costWOMaintenance = [];
            	scope.rateWithMaintenance = [];
            	scope.residualDeprecisation = [];
            	scope.residualCost = [];
            	scope.residualAmountVEP = [];
            	scope.residualAmountVIP = [];
            	scope.quoteWOMaintenance = [];
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
            		scope.coiForMonth.push({"coiForMonth":(scope.calculationData[i].coiForMonth).toFixed(2)});
            		scope.cofForMonth.push({"cofForMonth":(scope.calculationData[i].cofForMonth).toFixed(2)});
            		scope.maintenanceForMonth.push({"maintenanceForMonth":(scope.calculationData[i].maintenanceForMonth).toFixed(2)});
            		scope.deprecisationForMonth.push({"deprecisationForMonth":Math.round(scope.calculationData[i].deprecisationForMonth)});
            		scope.margin.push({"margin":""});
            		scope.totalForMonth.push({"totalForMonth":(scope.calculationData[i].totalForMonth).toFixed(2)});
            		scope.coiForYear.push({"coiForYear":(scope.calculationData[i].coiForYear).toFixed(2)});
            		scope.cofForYear.push({"cofForYear":(scope.calculationData[i].cofForYear).toFixed(2)});
            		scope.maintenanceForYear.push({"maintenanceForYear":(scope.calculationData[i].maintenanceForYear).toFixed(2)});
            		scope.deprecisationForYear.push({"deprecisationForYear":(scope.calculationData[i].deprecisationForYear).toFixed(2)});
            		scope.totalWOMaintenance.push({"totalWOMaintenance":(scope.calculationData[i].totalWOMaintenance).toFixed(2)});
            		scope.totalMaintenance.push({"totalMaintenance":(scope.calculationData[i].totalMaintenance).toFixed(2)});
            		scope.rateWOMaintenance.push({"rateWOMaintenance":(scope.calculationData[i].rateWOMaintenance).toFixed(2)});
            		scope.costWOMaintenance.push({"costWOMaintenance":(scope.calculationData[i].costWOMaintenance).toFixed(2)});
            		scope.rateWithMaintenance.push({"rateWithMaintenance":(scope.calculationData[i].rateWithMaintenance).toFixed(2)});
            		scope.residualDeprecisation.push({"residualDeprecisation":Math.round(scope.calculationData[i].residualDeprecisation*100)});
            		scope.residualCost.push({"residualCost":Math.round(scope.calculationData[i].residualCost*100)});
            		scope.residualAmountVEP.push({"residualAmountVEP":Math.round(scope.calculationData[i].residualAmountVEP)});
            		scope.residualAmountVIP.push({"residualAmountVIP":Math.round(scope.calculationData[i].residualAmountVIP)});
            		scope.quoteWOMaintenance.push({"quoteWOMaintenance":Math.round(scope.calculationData[i].quoteWOMaintenance)});
            		scope.quoteWMaintenance.push({"quoteWMaintenance":Math.round(scope.calculationData[i].quoteWMaintenance)});
            		scope.mileage.push({"mileage":""});
            		scope.excess.push({"excess":0.39});
            		scope.financialleasepayout.push({"financialleasepayout":""});
            		scope.accountingWDV.push({"accountingWDV":Math.round(scope.calculationData[i].accountWDV)});
            		scope.taxWDV.push({"taxWDV":Math.round(scope.calculationData[i].taxWDV)});
            	}
            	
            	/*for(i in scope.calculationData){
            		
            		var key = i;
            		var val = scope.calculationData[i];
            		for(j in val){
            			
            			var sub_key = j;
            			var sub_val = val[j];
            			if(i==0){
            				var obj = {};
         				   	obj[sub_key] = [sub_val];
            				scope.leaseCalcutaionsArray.push(obj);
            			}else{
            				for(var k in scope.leaseCalcutaionsArray){
            					if(typeof(scope.leaseCalcutaionsArray[k][sub_key]) == 'object')
            						scope.leaseCalcutaionsArray[k][sub_key].push(sub_val);
            				}
            			}
            			
            		}
            		
            	}*/
            	
            });
        };
    }
  });
  mifosX.ng.application.controller('CalculatorController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.CalculatorController]).run(function($log) {
    $log.info("CalculatorController initialized");
  });
}(mifosX.controllers || {}));