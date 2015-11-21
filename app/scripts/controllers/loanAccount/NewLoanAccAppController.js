(function(module) {
    mifosX.controllers = _.extend(module, {
        NewLoanAccAppController: function(scope, routeParams, resourceFactory, location,dateFilter,rootScope) {

            scope.previewRepayment = false;
            scope.clientId = routeParams.clientId;
            scope.groupId = routeParams.groupId;
            scope.restrictDate = new Date();
            scope.formData = {};
            scope.chargeFormData = {}; //For charges
            scope.taxFormData = {}; //For taxes
            scope.depositFormData = {}; //For deposit
            scope.collateralFormData = {}; //For collaterals
            scope.inparams = {resourceType : 'template'};
            scope.date = {};
             if (scope.clientId) {
              scope.inparams.clientId = scope.clientId;
              scope.formData.clientId = scope.clientId;
            }

            if (scope.groupId) {
              scope.inparams.groupId = scope.groupId;
              scope.formData.groupId = scope.groupId;
            }

            if (scope.clientId && scope.groupId) { scope.inparams.templateType = 'jlg'; }
            else if (scope.groupId) { scope.inparams.templateType = 'group'; }
            else if (scope.clientId) { scope.inparams.templateType = 'individual'; }

            resourceFactory.loanResource.get(scope.inparams, function(data) {
              scope.products = data.productOptions;
              if (data.clientName) {scope.clientName = data.clientName;}
              if (data.group) {scope.groupName = data.group.name;} 
            });

            scope.loanProductChange = function(loanProductId) {
              scope.inparams.productId = loanProductId;
              resourceFactory.loanResource.get(scope.inparams, function(data) {
                scope.loanaccountinfo = data;
                scope.previewClientLoanAccInfo();
              });

              resourceFactory.loanResource.get({resourceType : 'template', templateType:'collateral', productId:loanProductId, fields:'id,loanCollateralOptions'}, function(data) {
                scope.collateralOptions = data.loanCollateralOptions || [];
              });
            }

            scope.previewClientLoanAccInfo = function() {
              scope.previewRepayment = false;
              scope.charges = scope.loanaccountinfo.charges || [];
              for(var i in scope.loanaccountinfo.taxes){
            	  scope.loanaccountinfo.taxes[i].taxInclusive = (scope.loanaccountinfo.taxes[i].taxInclusive == 1) ? true:false;
              }
              scope.taxesArray = scope.loanaccountinfo.taxes || [];
              scope.depositArray = scope.loanaccountinfo.feeMasterData || [];
              scope.collaterals = [];

              if (scope.loanaccountinfo.calendarOptions) {
                scope.formData.syncRepaymentsWithMeeting = true;
                scope.formData.syncDisbursementWithMeeting = true;
              }

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
              scope.taxAmountCal(0);
             
            }
            
            scope.addCharge = function() {
              if (scope.chargeFormData.chargeId) {
                resourceFactory.chargeResource.get({chargeId: this.chargeFormData.chargeId, template: 'true'}, function(data){
                    data.chargeId = data.id;
                    scope.charges.push(data);
                    scope.chargeFormData.chargeId = undefined;
                });
              }
            }
            scope.taxesArray = [];
            scope.addTax = function() {
            	if (scope.taxFormData.taxId) {
            		resourceFactory.taxmappingResource.get({taxId: scope.taxFormData.taxId},function(data){
            			data.taxId = data.id;
            			data.taxInclusive = data.taxInclusive == 1 ? true :false;
            			scope.taxesArray.push(data);
            			scope.taxFormData.taxId = undefined;
            			scope.taxAmountCal(0);
            		});
            	}
            }
            scope.depositArray = [];
            scope.addDeposit = function() {
            	if (scope.depositFormData.depositId) {
            		resourceFactory.feeMasterResource.get({id: scope.depositFormData.depositId} , function(data) {
                        var feeMasterData = data.feeMasterData;
                        
                        feeMasterData.feeMasterId = feeMasterData.id;
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
            	scope.taxAmountCal(0);
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
            
            scope.taxAmountCal = function(flagVal){
            	var taxCalformData = {};
            	if(scope.depositArray && scope.depositArray.length > 0){
            		taxCalformData.principal = scope.subtract(scope.formData.principal,scope.depositArray[0].amount);
            	}else{
            		taxCalformData.principal = scope.formData.principal;
            	}
            	taxCalformData.locale = "en";
            	taxCalformData.taxes = [];
            	for(var i in scope.taxesArray){
            		taxCalformData.taxes.push({"id":scope.taxesArray[i].taxId,"type":scope.taxesArray[i].taxType,
            										"taxValue":scope.taxesArray[i].rate})
            	}
            	resourceFactory.taxCalculationResource.save({"flag" : flagVal},taxCalformData,function(data){
            		var resultData = {};
            		resultData  = angular.fromJson(data.resourceIdentifier);
            		scope.finalPrincipalAmount = resultData.finalAmount;
            		scope.updateTaxArray = resultData.taxArray;
            		if(flagVal == 1){
            			scope.actualPrincipalAmount = scope.formData.principal;
                        scope.formData.principal = scope.finalPrincipalAmount;
            			resourceFactory.loanResource.save(scope.formData,function(data){
                        	
                        	var updateData = {"taxArray":scope.updateTaxArray,"loanId":data.loanId};
                        	resourceFactory.taxCalculationResource.update(updateData,function(data){
                        		
                        		location.path('/viewloanaccount/' + data.resourceId);
                        	},function(errorData){
                            	scope.formData.principal = scope.actualPrincipalAmount; 
                            });
                          
                        },function(errorData){
                        	
                        	scope.errorData = rootScope.errorDetails;
                        	var updateData = {"taxMapArray":scope.updateTaxArray};
                        	
                        	resourceFactory.taxCalculationResource.remove({},updateData,function(data){
                        		rootScope.errorDetails = scope.errorData;
                        		});
                        	
                        	scope.formData.principal = scope.actualPrincipalAmount; 
                        });
            		}
            	});
            }

            scope.previewRepayments = function() {
            	
                // Make sure charges and collaterals are empty before initializing.
                delete scope.formData.charges;
                delete scope.formData.depositArray;
                delete scope.formData.collateral;
                var reqFirstDate = dateFilter(scope.date.first,'dd MMMM yyyy');
                var reqSecondDate = dateFilter(scope.date.second,'dd MMMM yyyy');
                var reqThirdDate = dateFilter(scope.date.third,'dd MMMM yyyy');
                var reqFourthDate = dateFilter(scope.date.fourth,'dd MMMM yyyy');
                if (scope.charges.length > 0) {
                  scope.formData.charges = [];
                  for (var i in scope.charges) {
                    scope.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount, dueDate:dateFilter(scope.charges[i].dueDate,'dd MMMM yyyy') });
                  }
                }
                
                if (scope.depositArray.length > 0) {
                	scope.formData.depositArray = [];
                	for (var i in scope.depositArray) {
                		scope.formData.depositArray.push({depositId:scope.depositArray[i].feeMasterId, amount:scope.depositArray[i].amount});
                	}
                }
                
                /*if (scope.taxesArray.length > 0) {
                	scope.formData.taxesArray = [];
                	for (var i in scope.taxesArray) {
                		scope.formData.taxesArray.push({ taxId:scope.taxesArray[i].taxId });
                	}
                }*/

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

                this.formData.interestChargedFromDate = reqThirdDate ;
                this.formData.repaymentsStartingFromDate = reqFourthDate;
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.loanType = scope.inparams.templateType;
                this.formData.expectedDisbursementDate = reqSecondDate;
                this.formData.submittedOnDate = reqFirstDate;
                
                scope.taxAmountCal(0);
                scope.actualPrincipalAmount = scope.formData.principal;
                this.formData.principal = scope.finalPrincipalAmount;
              resourceFactory.loanResource.save({command:'calculateLoanSchedule'}, this.formData,function(data){
                scope.repaymentscheduleinfo = data;
                scope.previewRepayment = true;
                scope.formData.syncRepaymentsWithMeeting = scope.syncRepaymentsWithMeeting;
                scope.formData.principal = scope.actualPrincipalAmount;
              },function(errorData){
            	  scope.formData.principal = scope.actualPrincipalAmount;
              });

            }

            scope.submit = function() {
                // Make sure charges and collaterals are empty before initializing.
                delete scope.formData.charges;
                delete scope.formData.taxesArray;
                delete scope.formData.depositArray;
                delete scope.formData.collateral;
                var reqFirstDate = dateFilter(scope.date.first,'dd MMMM yyyy');
                var reqSecondDate = dateFilter(scope.date.second,'dd MMMM yyyy');
                var reqThirdDate = dateFilter(scope.date.third,'dd MMMM yyyy');
                var reqFourthDate = dateFilter(scope.date.fourth,'dd MMMM yyyy');
                var reqFifthDate = dateFilter(scope.date.fifth,'dd MMMM yyyy');
                
                if (scope.charges.length > 0) {
                  scope.formData.charges = [];
                  for (var i in scope.charges) {
                    scope.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amount, dueDate: dateFilter(scope.charges[i].dueDate,'dd MMMM yyyy') });
                  }
                }
                
                if (scope.depositArray.length > 0) {
                	scope.formData.depositArray = [];
                	for (var i in scope.depositArray) {
                		scope.formData.depositArray.push({ depositId:scope.depositArray[i].feeMasterId, amount:scope.depositArray[i].amount });
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
                }
                delete this.formData.syncRepaymentsWithMeeting;
                delete this.formData.interestRateFrequencyType;
                this.formData.interestChargedFromDate = reqThirdDate ;
                this.formData.repaymentsStartingFromDate = reqFourthDate;
                this.formData.locale = 'en';
                this.formData.dateFormat = 'dd MMMM yyyy';
                this.formData.loanType = scope.inparams.templateType;
                this.formData.expectedDisbursementDate = reqSecondDate;
                this.formData.submittedOnDate = reqFirstDate;
                
                scope.taxAmountCal(1);

            };

            scope.cancel = function() {
              if (scope.groupId) {
                location.path('/viewgroup/' + scope.groupId);
              } else if (scope.clientId) {
                location.path('/viewclient/' + scope.clientId);
              }
            }
        }
    });
    mifosX.ng.application.controller('NewLoanAccAppController', ['$scope', '$routeParams', 'ResourceFactory', '$location','dateFilter','$rootScope', mifosX.controllers.NewLoanAccAppController]).run(function($log) {
        $log.info("NewLoanAccAppController initialized");
    });
}(mifosX.controllers || {}));