(function(module) {
    lms.controllers = _.extend(module, {
        EditLoanAccAppController: function(scope, routeParams, resourceFactory, location, dateFilter,rootScope) {

            scope.previewRepayment = false;
            scope.formData = {};
            scope.chargeFormData = {}; //For charges
            scope.taxFormData = {}; //For taxes
            scope.depositFormData = {}; //For deposit
            scope.collateralFormData = {}; //For collaterals
            scope.collaterals = [];
            scope.restrictDate = new Date();
            scope.loanTaxMapData = [];

            resourceFactory.loanResource.get({loanId : routeParams.id, template:true, associations:'charges,collateral,meeting,taxes,deposits'}, function(data) {
                  scope.loanaccountinfo = data;

                  resourceFactory.loanResource.get({resourceType : 'template', templateType:'collateral', productId:data.loanProductId, fields:'id,loanCollateralOptions'}, function(data) {
                    scope.collateralOptions = data.loanCollateralOptions || [];
                  });
                  
                  if (data.clientId) {
                    scope.clientId = data.clientId;
                    scope.clientName = data.clientName;
                    scope.formData.clientId = scope.clientId;
                  }
                  
                  if (data.group) {
                    scope.groupId = data.group.id;
                    scope.groupName = data.group.name;
                    scope.formData.groupId = scope.groupId;
                  }

                  if (scope.clientId && scope.groupId) { scope.templateType = 'jlg'; }
                  else if (scope.groupId) { scope.templateType = 'group'; }
                  else if (scope.clientId) { scope.templateType = 'individual'; }

                  scope.formData.loanOfficerId = data.loanOfficerId;
                  scope.formData.loanPurposeId = data.loanPurposeId;

                  //update collaterals
                  if (scope.loanaccountinfo.collateral) {
                    for (var i in scope.loanaccountinfo.collateral) {
                      scope.collaterals.push({type:scope.loanaccountinfo.collateral[i].id, name:scope.loanaccountinfo.collateral[i].type.name, value:scope.loanaccountinfo.collateral[i].value, description:scope.loanaccountinfo.collateral[i].description});
                    }
                  }

                  scope.previewClientLoanAccInfo();
                  
            });

            scope.loanProductChange = function(loanProductId,val) {

              var inparams = { resourceType:'template', productId:loanProductId, templateType:scope.templateType };
              if (scope.clientId) { inparams.clientId = scope.clientId; }
              if (scope.groupId) { inparams.groupId = scope.groupId; }

              resourceFactory.loanResource.get(inparams, function(data) {
                scope.loanaccountinfo = data;
                scope.collaterals = [];
                scope.changeVal = val == 'true' ? true : false;
                console.log(scope.changeVal);
                scope.previewClientLoanAccInfo();
              });

              resourceFactory.loanResource.get({resourceType : 'template', templateType:'collateral', productId:loanProductId, fields:'id,loanCollateralOptions'}, function(data) {
                scope.collateralOptions = data.loanCollateralOptions || [];
              });
            }

            scope.previewClientLoanAccInfo = function() {
              scope.previewRepayment = false;
              for (var i in scope.loanaccountinfo.charges) {
                if (scope.loanaccountinfo.charges[i].dueDate) {
                  scope.loanaccountinfo.charges[i].dueDate = new Date(scope.loanaccountinfo.charges[i].dueDate);
                }
              }
              scope.charges = scope.loanaccountinfo.charges || [];
              
              for(var i in scope.loanaccountinfo.taxes){
            	  scope.loanaccountinfo.taxes[i].taxInclusive = (scope.loanaccountinfo.taxes[i].taxInclusive == 1) ? true:false;
              }
              scope.taxesArray = scope.loanaccountinfo.taxes || [];
              
              scope.depositArray = scope.loanaccountinfo.feeMasterData || [];
              
              if (scope.loanaccountinfo.timeline.submittedOnDate) { scope.formData.submittedOnDate = new Date(scope.loanaccountinfo.timeline.submittedOnDate); }
              if (scope.loanaccountinfo.timeline.expectedDisbursementDate) { scope.formData.expectedDisbursementDate = new Date(scope.loanaccountinfo.timeline.expectedDisbursementDate); }
              if (scope.loanaccountinfo.interestChargedFromDate) { scope.formData.interestChargedFromDate = new Date(scope.loanaccountinfo.interestChargedFromDate); }
              if (scope.loanaccountinfo.expectedFirstRepaymentOnDate) { scope.formData.repaymentsStartingFromDate = new Date(scope.loanaccountinfo.expectedFirstRepaymentOnDate); }
              scope.formData.productId = scope.loanaccountinfo.loanProductId;
              scope.formData.fundId = scope.loanaccountinfo.fundId;
              scope.formData.principal = scope.loanaccountinfo.principal;
              scope.formData.loanTermFrequency = scope.loanaccountinfo.termFrequency;
              scope.formData.loanTermFrequencyType = scope.loanaccountinfo.termPeriodFrequencyType.id;
              scope.formData.numberOfRepayments = scope.loanaccountinfo.numberOfRepayments;
              scope.formData.repaymentEvery = scope.loanaccountinfo.repaymentEvery;
              scope.formData.repaymentFrequencyType =   scope.loanaccountinfo.repaymentFrequencyType.id;
              scope.formData.interestRatePerPeriod = scope.loanaccountinfo.interestRatePerPeriod;
              scope.formData.interestRateFrequencyType = scope.loanaccountinfo.interestRateFrequencyType.id;
              scope.formData.amortizationType = scope.loanaccountinfo.amortizationType.id;
              scope.formData.interestType = scope.loanaccountinfo.interestType.id;
              scope.formData.interestCalculationPeriodType = scope.loanaccountinfo.interestCalculationPeriodType.id;
              scope.formData.inArrearsTolerance = scope.loanaccountinfo.inArrearsTolerance;
              scope.formData.graceOnPrincipalPayment = scope.loanaccountinfo.graceOnPrincipalPayment;
              scope.formData.graceOnInterestPayment = scope.loanaccountinfo.graceOnInterestPayment;
              scope.formData.transactionProcessingStrategyId = scope.loanaccountinfo.transactionProcessingStrategyId;
              scope.formData.graceOnInterestCharged = scope.loanaccountinfo.graceOnInterestCharged;
              scope.formData.syncDisbursementWithMeeting = scope.loanaccountinfo.syncDisbursementWithMeeting;

              if (scope.loanaccountinfo.meeting) {
                scope.formData.syncRepaymentsWithMeeting = true;
              }
              
              if(scope.depositArray.length > 0 && !scope.changeVal){
            	  scope.formData.principal = rootScope.addition(scope.formData.principal,scope.depositArray[0].amountOrPercentage);
              }
              
              if(scope.taxesArray.length > 0){
	              resourceFactory.taxCalculationResource.query({loanId : routeParams.id}, function(taxCalculationData) {
	           	   scope.loanTaxMapData = taxCalculationData;
	           	   console.log(scope.formData.principal);
	           	   for(var i in scope.loanTaxMapData){
	           		   if(scope.loanTaxMapData[i].taxInclusive == 1){
	           			   scope.formData.principal += scope.loanTaxMapData[i].taxAmount;
	           			   console.log(scope.formData.principal);
	           		   }else{
	           			   scope.formData.principal -= scope.loanTaxMapData[i].taxAmount; 
	           		   }
	           	   }
	           	   scope.formData.principal = Math.round(scope.formData.principal);
	              });
              }

            }
            
            scope.addCharge = function() {
              if (scope.chargeFormData.chargeId) {
                resourceFactory.chargeResource.get({chargeId: this.chargeFormData.chargeId, template: 'true'}, function(data){
                    data.chargeId = data.id;
                    data.id = null;
                    data.amountOrPercentage = data.amount;
                    scope.charges.push(data);
                    scope.chargeFormData.chargeId = undefined;
                });
              }
            }
            
            scope.addTax = function() {
            	if (scope.taxFormData.taxId) {
            		resourceFactory.taxmappingResource.get({taxId: scope.taxFormData.taxId},function(data){
            			data.taxId = data.id;
            			data.id = null;
            			data.taxInclusive = data.taxInclusive == 1 ? true :false;
            			scope.taxesArray.push(data);
            			scope.taxFormData.taxId = undefined;
            			scope.taxAmountCal(function(returnData){
                        });
            		});
            	}
            }
            
            scope.addDeposit = function() {
            	if (scope.depositFormData.depositId && scope.depositArray.length <=0) {
            		resourceFactory.feeMasterResource.get({id: scope.depositFormData.depositId} , function(data) {
                        var feeMasterData = data.feeMasterData;
                        
                        feeMasterData.feeMasterId = feeMasterData.id;
                        feeMasterData.id = null;
                        feeMasterData.amountOrPercentage = feeMasterData.amount;
            			scope.depositArray.push(feeMasterData);
            			//to deposit select box empty
            			scope.depositFormData.depositId = undefined;
            		});
            	}
            }

            scope.deleteCharge = function(index) {
              scope.charges.splice(index,1);
            }
            
            scope.deleteTax = function(index) {
            	scope.taxesArray.splice(index,1);
            	scope.taxAmountCal(function(returnData){
                });
            }
            
            scope.deleteDeposit = function(index) {
            	scope.depositArray.splice(index,1);
            }

            scope.syncRepaymentsWithMeetingchange = function() {
              if (!scope.formData.syncRepaymentsWithMeeting) {
                scope.formData.syncDisbursementWithMeeting=false;
              }
            };

            scope.syncDisbursementWithMeetingchange = function() {
              if (scope.formData.syncDisbursementWithMeeting) {
                scope.formData.syncRepaymentsWithMeeting=true;
              }
            };

            scope.addCollateral = function () {
              if (scope.collateralFormData.collateralIdTemplate && scope.collateralFormData.collateralValueTemplate) {
                scope.collaterals.push({type:scope.collateralFormData.collateralIdTemplate.id, name:scope.collateralFormData.collateralIdTemplate.name, value:scope.collateralFormData.collateralValueTemplate, description:scope.collateralFormData.collateralDescriptionTemplate});
                scope.collateralFormData.collateralIdTemplate = undefined;
                scope.collateralFormData.collateralValueTemplate = undefined;
                scope.collateralFormData.collateralDescriptionTemplate = undefined;
              }
            };

            scope.deleteCollateral = function (index) {
              scope.collaterals.splice(index,1);
            };
            
            scope.taxAmountCal = function(handerFun,flagVal){
            	var taxCalformData = {};
            	if(scope.depositArray && scope.depositArray.length > 0){
            		taxCalformData.principal = scope.subtract(scope.formData.principal,scope.depositArray[0].amountOrPercentage);
            	}else{
            		taxCalformData.principal = scope.formData.principal;
            	}
            	console.log(taxCalformData.principal);
            	taxCalformData.locale = "en";
            	taxCalformData.taxes = [];
            	for(var i in scope.taxesArray){
            		taxCalformData.taxes.push({"id":scope.taxesArray[i].taxId,"type":scope.taxesArray[i].taxType,
            										"taxValue":scope.taxesArray[i].rate})
            	}
            	
            	if(flagVal == 1){
	              resourceFactory.taxCalculationResource.remove({loanId : routeParams.id},{},function(data){
	            		 
	            	  resourceFactory.taxCalculationResource.save({"flag" : flagVal},taxCalformData,function(data){
	            		  
			        		var resultData = {};
			        		resultData  = angular.fromJson(data.resourceIdentifier);
			        		if(angular.isFunction(handerFun)) handerFun(resultData);
	            	  });
	               });
            	}else{
            		if(scope.taxesArray.length > 0){
	            		resourceFactory.taxCalculationResource.save(taxCalformData,function(data){
	            			var resultData = {};
	                		resultData  = angular.fromJson(data.resourceIdentifier);
	                		if(angular.isFunction(handerFun)) handerFun(resultData);
	            		});
            		}
            	}
            	
            }

            scope.previewRepayments = function() {
              // Make sure charges and collaterals are empty before initializing.
                delete scope.formData.charges;
                delete scope.formData.depositArray;
                delete scope.formData.collateral;

                if (scope.charges.length > 0) {
                  scope.formData.charges = [];
                  for (var i in scope.charges) {
                    scope.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amountOrPercentage, dueDate:dateFilter(scope.charges[i].dueDate,'dd MMMM yyyy') });
                  }
                }
                
                if (scope.depositArray.length > 0) {
                	scope.formData.depositArray = [];
                	for (var i in scope.depositArray) {
                		scope.formData.depositArray.push({depositId:scope.depositArray[i].feeMasterId, amount:scope.depositArray[i].amountOrPercentage});
                	}
                }

                if (scope.collaterals.length > 0) {
                  scope.formData.collateral = [];
                  for (var i in scope.collaterals) {
                    scope.formData.collateral.push({type:scope.collaterals[i].type,value:scope.collaterals[i].value, description:scope.collaterals[i].description});
                  };
                }

                if (this.formData.syncRepaymentsWithMeeting) {
                  this.formData.calendarId = scope.loanaccountinfo.calendarOptions[0].id;
                  scope.syncRepaymentsWithMeeting = this.formData.syncRepaymentsWithMeeting;
                }
                delete this.formData.syncRepaymentsWithMeeting;

                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.loanType = scope.templateType;
                this.formData.expectedDisbursementDate = dateFilter(this.formData.expectedDisbursementDate,'dd MMMM yyyy');
                this.formData.interestChargedFromDate = dateFilter(this.formData.interestChargedFromDate,'dd MMMM yyyy');
                this.formData.repaymentsStartingFromDate = dateFilter(this.formData.repaymentsStartingFromDate,'dd MMMM yyyy');
                if(scope.taxesArray.length > 0){
	                scope.taxAmountCal(function(returnData){
	                	
	                   var actualPrincipalAmount = scope.formData.principal;
	                   scope.formData.principal = returnData.finalAmount;
	
		              resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, scope.formData,function(data){
		                scope.repaymentscheduleinfo = data;
		                scope.previewRepayment = true;
		                scope.formData.syncRepaymentsWithMeeting = scope.syncRepaymentsWithMeeting;
		                scope.formData.principal = actualPrincipalAmount;
		              },function(errorData){
		            	  scope.formData.principal = actualPrincipalAmount;
		              });
	                });
                }else{
                	
                	var actualPrincipalAmount = scope.formData.principal;
                	if(scope.depositArray && scope.depositArray.length > 0){
                		scope.formData.principal = scope.subtract(scope.formData.principal,scope.depositArray[0].amount);
                	}
                	resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, scope.formData,function(data){
		                scope.repaymentscheduleinfo = data;
		                scope.previewRepayment = true;
		                scope.formData.syncRepaymentsWithMeeting = scope.syncRepaymentsWithMeeting;
		                scope.formData.principal = actualPrincipalAmount;
		              },function(errorData){
		            	  scope.formData.principal = actualPrincipalAmount;
		              });
                }

            }

            scope.submit = function() {
                // Make sure charges and collaterals are empty before initializing.
                delete scope.formData.charges;
                delete scope.formData.depositArray;
                delete scope.formData.collateral;
                
                if (scope.charges.length > 0) {
                  scope.formData.charges = [];
                  for (var i in scope.charges) {
                    scope.formData.charges.push({id : scope.charges[i].id, chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amountOrPercentage, dueDate:dateFilter(scope.charges[i].dueDate,'dd MMMM yyyy') });
                  }
                }
                
                scope.formData.depositArray = [];
                if (scope.depositArray.length > 0) {
                	for (var i in scope.depositArray) {
                		scope.formData.depositArray.push({ id : scope.depositArray[i].id,depositId:scope.depositArray[i].feeMasterId, amount:scope.depositArray[i].amountOrPercentage });
                	}
                }

                //if there is no charge selected 
                //for corresponding loan, then empty charge object
                //sent to the server side.
                if (!this.formData.charges) {
                  this.formData.charges = {};
                }

                if (scope.collaterals.length > 0) {
                  scope.formData.collateral = [];
                  for (var i in scope.collaterals) {
                    scope.formData.collateral.push({type:scope.collaterals[i].type,value:scope.collaterals[i].value, description:scope.collaterals[i].description});
                  };
                }

                if (this.formData.syncRepaymentsWithMeeting) {
                  this.formData.calendarId = scope.loanaccountinfo.calendarOptions[0].id;
                }
                delete this.formData.syncRepaymentsWithMeeting;
                delete this.formData.interestRateFrequencyType;

                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.loanType = scope.templateType;
                this.formData.expectedDisbursementDate = dateFilter(this.formData.expectedDisbursementDate,'dd MMMM yyyy');
                this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate,'dd MMMM yyyy');
                this.formData.interestChargedFromDate = dateFilter(this.formData.interestChargedFromDate,'dd MMMM yyyy');
                this.formData.repaymentsStartingFromDate = dateFilter(this.formData.repaymentsStartingFromDate,'dd MMMM yyyy');

                scope.taxAmountCal(function(returnData){
                	
       			   var actualPrincipalAmount = scope.formData.principal;
                   scope.formData.principal = returnData.finalAmount;
                   
       			  resourceFactory.loanResource.put({loanId : routeParams.id},scope.formData,function(data){
                   	
                   	var updateData = {"taxArray":returnData.taxArray,"loanId":data.loanId};
                   	resourceFactory.taxCalculationResource.update(updateData,function(data){
                   		location.path('/viewloanaccount/' + data.resourceId);
                   	},function(errorData){
                    	scope.formData.principal = actualPrincipalAmount; 
                    });
                     
                   },function(errorData){
                   	
                   	scope.errorData = rootScope.errorDetails;
                   	
                   	resourceFactory.taxCalculationResource.remove({},{"taxMapArray":returnData.taxArray},function(data){
                   		rootScope.errorDetails = scope.errorData;
                   	});
                   	scope.formData.principal = actualPrincipalAmount; 
                   });
                },1);
            };

            scope.cancel = function() {
              location.path('/viewloanaccount/' + routeParams.id);
            }
        }
    });
    lms.ng.application.controller('EditLoanAccAppController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter','$rootScope', lms.controllers.EditLoanAccAppController]).run(function($log) {
        $log.info("EditLoanAccAppController initialized");
    });
}(lms.controllers || {}));