(function(module) {
    mifosX.controllers = _.extend(module, {
        EditLoanAccAppController: function(scope, routeParams, resourceFactory, location, dateFilter,rootScope) {

            scope.previewRepayment = false;
            scope.formData = {};
            scope.chargeFormData = {}; //For charges
            scope.taxFormData = {}; //For taxes
            scope.collateralFormData = {}; //For collaterals
            scope.collaterals = [];
            scope.restrictDate = new Date();
            scope.loanTaxMapData = [];

            resourceFactory.loanResource.get({loanId : routeParams.id, template:true, associations:'charges,collateral,meeting,taxes'}, function(data) {
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

            scope.loanProductChange = function(loanProductId) {

              var inparams = { resourceType:'template', productId:loanProductId, templateType:scope.templateType };
              if (scope.clientId) { inparams.clientId = scope.clientId; }
              if (scope.groupId) { inparams.groupId = scope.groupId; }

              resourceFactory.loanResource.get(inparams, function(data) {
                scope.loanaccountinfo = data;
                scope.collaterals = [];
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
           	   scope.formData.principal = Math.ceil(scope.formData.principal);
              });

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
            			scope.taxAmountCal(0);
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
            	taxCalformData.principal = scope.formData.principal;
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
            		scope.finalPrincipalAmount = resultData.finalAmount;
            		scope.updateTaxArray = resultData.taxArray;
            		
            			scope.actualPrincipalAmount = scope.formData.principal;
                        scope.formData.principal = scope.finalPrincipalAmount;
                        
            			resourceFactory.loanResource.put({loanId : routeParams.id},scope.formData,function(data){
                        	
                        	var updateData = {"taxArray":scope.updateTaxArray,"loanId":data.loanId};
                        	resourceFactory.taxCalculationResource.update(updateData,function(data){
                        		
                        		location.path('/viewloanaccount/' + data.resourceId);
                        	});
                          
                        },function(errorData){
                        	
                        	scope.errorData = rootScope.errorDetails;
                        	var updateData = {"taxMapArray":scope.updateTaxArray};
                        	
                        	resourceFactory.taxCalculationResource.remove({},updateData,function(data){
                        		rootScope.errorDetails = scope.errorData;
                        	});
                        	scope.formData.principal = scope.actualPrincipalAmount; 
                        });
            		},function(errorData){
                    	scope.formData.principal = scope.actualPrincipalAmount; 
                    });
            	  },function(errorData){
                  	scope.formData.principal = scope.actualPrincipalAmount; 
                  });
            	}else{
            		resourceFactory.taxCalculationResource.save({"flag" : flagVal},taxCalformData,function(data){
            			var resultData = {};
                		resultData  = angular.fromJson(data.resourceIdentifier);
                		scope.finalPrincipalAmount = resultData.finalAmount;
                		scope.updateTaxArray = resultData.taxArray;
            		});
            	}
            }

            scope.previewRepayments = function() {
              // Make sure charges and collaterals are empty before initializing.
                delete scope.formData.charges;
                delete scope.formData.collateral;

                if (scope.charges.length > 0) {
                  scope.formData.charges = [];
                  for (var i in scope.charges) {
                    scope.formData.charges.push({ chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amountOrPercentage, dueDate:dateFilter(scope.charges[i].dueDate,'dd MMMM yyyy') });
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
                delete scope.formData.collateral;
                
                if (scope.charges.length > 0) {
                  scope.formData.charges = [];
                  for (var i in scope.charges) {
                    scope.formData.charges.push({id : scope.charges[i].id, chargeId:scope.charges[i].chargeId, amount:scope.charges[i].amountOrPercentage, dueDate:dateFilter(scope.charges[i].dueDate,'dd MMMM yyyy') });
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

                scope.taxAmountCal(1);
                
            };

            scope.cancel = function() {
              location.path('/viewloanaccount/' + routeParams.id);
            }
        }
    });
    mifosX.ng.application.controller('EditLoanAccAppController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter','$rootScope', mifosX.controllers.EditLoanAccAppController]).run(function($log) {
        $log.info("EditLoanAccAppController initialized");
    });
}(mifosX.controllers || {}));