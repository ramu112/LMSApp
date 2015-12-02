(function(module) {
  lms.controllers = _.extend(module, {
	  SaleCalculatorController: function(scope, resourceFactory, location,$http,$rootScope,API_VERSION,dateFilter) {
		  
		  scope.formData = {};
		  scope.leaseproducts = [];
		  scope.previewRepayment = false;
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
            repaymentInfoFormData.loanTermFrequencyType = scope.loanaccountinfo.repaymentFrequencyType.id;
            repaymentInfoFormData.numberOfRepayments = scope.terms;
            repaymentInfoFormData.repaymentEvery = scope.loanaccountinfo.repaymentEvery;
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
        	if(scope.formData.deposit > 0){
        		taxCalformData.principal = scope.subtract(scope.formData.principal,scope.formData.deposit);
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
            repaymentInfoFormData.interestChargedFromDate = reqThirdDate ;
            repaymentInfoFormData.repaymentsStartingFromDate = reqFourthDate;
            repaymentInfoFormData.locale = 'en';
            repaymentInfoFormData.dateFormat = 'dd MMMM yyyy';
            repaymentInfoFormData.loanType = 'individual';
            repaymentInfoFormData.expectedDisbursementDate = reqSecondDate;
            //repaymentInfoFormData.submittedOnDate = reqFirstDate;
            
            if(scope.taxesArray.length > 0){
                scope.taxAmountCal(function(returnData){
                	scope.taxAmounts = [];
                	scope.taxAmounts = returnData.taxArray;
                	for(var i in scope.taxAmounts){
                		scope.taxAmounts[i].taxAmount = scope.taxAmounts[i].taxAmount.toFixed(2);
                	}
                	
                	repaymentInfoFormData.principal = returnData.finalAmount;
                	resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, repaymentInfoFormData,function(data){
                		scope.previewRepayment = true;
                		scope.repaymentscheduleinfo = data;
                	});
                });
            }else{
            	if(scope.formData.deposit > 0){
                	repaymentInfoFormData.principal = scope.subtract(scope.formData.principal,scope.formData.deposit);
                }else{
                	repaymentInfoFormData.principal = scope.formData.principal;
                }
            	if(scope.depositArray && scope.depositArray.length > 0){
            		repaymentInfoFormData.principal = scope.subtract(scope.formData.principal,scope.depositArray[0].amount);
            	}
            	resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, repaymentInfoFormData,function(data){
            		scope.previewRepayment = true;
            		scope.repaymentscheduleinfo = data;
            	});
            }

        }
        
        scope.save = function (){
    	   
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
  lms.ng.application.controller('SaleCalculatorController', ['$scope', 'ResourceFactory', '$location','$http','$rootScope','API_VERSION','dateFilter', lms.controllers.SaleCalculatorController]).run(function($log) {
    $log.info("SaleCalculatorController initialized");
  });
}(lms.controllers || {}));