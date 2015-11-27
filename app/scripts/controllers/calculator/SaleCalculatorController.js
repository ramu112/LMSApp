(function(module) {
  mifosX.controllers = _.extend(module, {
	  SaleCalculatorController: function(scope, resourceFactory, location,$http,$rootScope,API_VERSION,dateFilter) {
		  
		  scope.formData = {};
		  scope.leaseproducts = [];
		  scope.previewRepayment = false;
		  scope.leaseCalculator = false;
		  scope.isProspect  = false;var prospectFormData = {};
        resourceFactory.loanProductResource.getAllLoanProducts(function(data) {
            scope.leaseproducts = data;
            if($rootScope.prospectFormData && $rootScope.prospectFormData.loanProductId){
            	scope.formData.productId = $rootScope.prospectFormData.loanProductId;
            	prospectFormData = $rootScope.prospectFormData;
            	scope.isProspect = true;
            	delete $rootScope.prospectFormData;
            	scope.leaseProductChange(scope.formData.productId);
            }
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
        		var charges = data.charges || [];
        		for(var i in charges){
        			if(charges[i].name == 'COF'){
        				scope.formData.costOfFund = (charges[i].amount*12).toFixed(2); 
        			}
        			if(charges[i].name == 'Maintenance charge'){
        				scope.formData.maintenance = (charges[i].amount*12).toFixed(2); 
        			}
        		}
        		
        		scope.loanaccountinfo = data;
                scope.previewLoanAccInfo();
        	});
        }
        

        var repaymentInfoFormData = {};
        scope.previewLoanAccInfo = function() {
        	scope.previewRepayment = false;
            scope.charges = scope.loanaccountinfo.charges || [];
            scope.taxesArray = scope.loanaccountinfo.taxes || [];
            scope.depositArray = scope.loanaccountinfo.feeMasterData || [];
            scope.collaterals = [];


            repaymentInfoFormData.syncDisbursementWithMeeting = false;
            repaymentInfoFormData.loanTermFrequency = scope.terms;
            repaymentInfoFormData.loanTermFrequencyType = 2;
            repaymentInfoFormData.numberOfRepayments = scope.terms;
            repaymentInfoFormData.repaymentEvery = 1;
            repaymentInfoFormData.repaymentFrequencyType =   scope.loanaccountinfo.repaymentFrequencyType.id;
            repaymentInfoFormData.interestRatePerPeriod = scope.loanaccountinfo.interestRatePerPeriod;
            repaymentInfoFormData.interestRateFrequencyType = scope.loanaccountinfo.interestRateFrequencyType.id;
            repaymentInfoFormData.amortizationType = scope.loanaccountinfo.amortizationType.id;
            repaymentInfoFormData.interestType = scope.loanaccountinfo.interestType.id;
            repaymentInfoFormData.interestCalculationPeriodType = scope.loanaccountinfo.interestCalculationPeriodType.id;
            repaymentInfoFormData.transactionProcessingStrategyId = scope.loanaccountinfo.transactionProcessingStrategyId;
            scope.taxAmountCal(function(returnData){
            });	
           
          }
        
        scope.taxAmountCal = function(handerFun){
        	var taxCalformData = {};
        	if(scope.depositArray && scope.depositArray.length > 0){
        		taxCalformData.principal = scope.subtract(scope.formData.principal,scope.depositArray[0].amount);
        	}else{
        		taxCalformData.principal = scope.formData.principal;
        	}
        	taxCalformData.locale = "en";
        	taxCalformData.taxes = [];
        	for(var i in scope.taxesArray){
        		taxCalformData.taxes.push({"id":scope.taxesArray[i].id,"type":scope.taxesArray[i].taxType,
        										"taxValue":scope.taxesArray[i].rate})
        	}
        	
        	if(scope.taxesArray.length > 0){
            	resourceFactory.taxCalculationResource.save(taxCalformData,function(data){
            		var resultData = {};
            		resultData  = angular.fromJson(data.resourceIdentifier);
            		if(angular.isFunction(handerFun)) handerFun(resultData);
            	});
        	}
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
        	
        	resourceFactory.calculationResource.save(scope.formData,function(data){
            	scope.leaseCalculator = true;
            	scope.previewRepayment = false;
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
            		scope.residualCost.push({"residualCost":(scope.calculationData[i].residualCost*100).toFixed(2)});
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
            });

        };
        
        scope.previewRepayments = function() {
        	
            var reqFirstDate = dateFilter(new Date(),'dd MMMM yyyy');
            var reqSecondDate = dateFilter(new Date(),'dd MMMM yyyy');
            var reqThirdDate = dateFilter(new Date(),'dd MMMM yyyy');
            var reqFourthDate = dateFilter(new Date(),'dd MMMM yyyy');
            if (scope.charges.length > 0) {
            	repaymentInfoFormData.charges = [];
              for (var i in scope.charges) {
            	  repaymentInfoFormData.charges.push({ chargeId:scope.charges[i].id, amount:scope.charges[i].amount, dueDate:dateFilter(scope.charges[i].dueDate,'dd MMMM yyyy') });
              }
            }
            
            if (scope.depositArray.length > 0) {
            	repaymentInfoFormData.depositArray = [];
            	for (var i in scope.depositArray) {
            		repaymentInfoFormData.depositArray.push({depositId:scope.depositArray[i].id, amount:scope.depositArray[i].amount});
            	}
            }
            
            if (scope.collaterals.length > 0) {
            	repaymentInfoFormData.collateral = [];
              for (var i in scope.collaterals) {
            	  repaymentInfoFormData.collateral.push({type:scope.collaterals[i].type,value:scope.collaterals[i].value, description:scope.collaterals[i].description});
              };
            }
            
            repaymentInfoFormData.productId = scope.formData.productId;
            repaymentInfoFormData.principal = scope.formData.principal;
            repaymentInfoFormData.interestChargedFromDate = reqThirdDate ;
            repaymentInfoFormData.repaymentsStartingFromDate = reqFourthDate;
            repaymentInfoFormData.locale = 'en';
            repaymentInfoFormData.dateFormat = 'dd MMMM yyyy';
            repaymentInfoFormData.loanType = 'individual';
            repaymentInfoFormData.expectedDisbursementDate = reqSecondDate;
            repaymentInfoFormData.submittedOnDate = reqFirstDate;
            
            if(scope.taxesArray.length > 0){
                scope.taxAmountCal(function(returnData){
                	
                	repaymentInfoFormData.principal = returnData.finalAmount;
                	resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, repaymentInfoFormData,function(data){
                		scope.previewRepayment = true;
                		scope.repaymentscheduleinfo = data;
                	});
                });
            }else{
            	if(scope.depositArray && scope.depositArray.length > 0){
            		repaymentInfoFormData.principal = scope.subtract(scope.formData.principal,scope.depositArray[0].amount);
            	}
            	resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, repaymentInfoFormData,function(data){
            		scope.previewRepayment = true;
            		scope.repaymentscheduleinfo = data;
            	});
            }

        }
        
       scope.saveFile = function (){
    	   
        	resourceFactory.calculationExportResource.save({command:"PROSPECT"},scope.formData,function(data){
        		data = angular.fromJson(angular.toJson(data));
        		
        		var formData = {};
        		formData = prospectFormData;
        		formData.location = data.fileName;
        		formData.prospectLoanCalculatorId = data.prospectLoanCalculatorId;
        		console.log(formData);
        		
        		if(formData.id){
        			var id = formData.id; delete formData.id;
        			resourceFactory.prospectResource.update({id:id},formData, function(data) {
						location.path('/prospects');										
					},function(errorData){
						formData.id = id;
					});
        		}else{
	        		resourceFactory.prospectResource.save(formData, function(data) {
						location.path('/prospects');										
					});
        		}
        		
        	});
       };
    }
  });
  mifosX.ng.application.controller('SaleCalculatorController', ['$scope', 'ResourceFactory', '$location','$http','$rootScope','API_VERSION','dateFilter', mifosX.controllers.SaleCalculatorController]).run(function($log) {
    $log.info("SaleCalculatorController initialized");
  });
}(mifosX.controllers || {}));