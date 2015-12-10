(function(module) {
  lms.controllers = _.extend(module, {
      ViewLoanDetailsController: function(scope, routeParams, resourceFactory, location, route, http,$modal,dateFilter,API_VERSION,rootScope) {
      scope.loandocuments = [];
      scope.date = {};
      scope.date.payDate = new Date();
      scope.clickEvent = function(eventName, accountId) {
        eventName = eventName || "";
        switch (eventName) {
          case "addloancharge":
            location.path('/addloancharge/' + accountId);
          break;
          case "addcollateral":
            location.path('/addcollateral/' + accountId);
          break;
          case "assignloanofficer":
            location.path('/assignloanofficer/' + accountId);
          break;
          case "modifyapplication":
            location.path('/editloanaccount/' + accountId);
          break;
          case "approve":
            location.path('/loanaccount/' + accountId + '/approve');
          break;
          case "reject":
            location.path('/loanaccount/' + accountId + '/reject');
          break;
          case "withdrawnbyclient":
            location.path('/loanaccount/' + accountId + '/withdrawnByApplicant');
          break;
          case "delete":
            resourceFactory.LoanAccountResource.delete({loanId:accountId}, {}, function(data){
              var destination = '/viewgroup/' + data.groupId;
              if (data.clientId) destination = '/viewclient/' + data.clientId;
              location.path(destination);
            });
          break;
          case "undoapproval":
            location.path('/loanaccount/' + accountId + '/undoapproval');
          break;
          case "disburse":
            location.path('/loanaccount/' + accountId + '/disburse');
          break;
          case "undodisbursal":
            location.path('/loanaccount/' + accountId + '/undodisbursal');
          break;
          case "makerepayment":
            location.path('/loanaccount/' + accountId + '/repayment');
          break;
          case "waiveinterest":
            location.path('/loanaccount/' + accountId + '/waiveinterest');
          break;
          case "writeoff":
            location.path('/loanaccount/' + accountId + '/writeoff');
          break;
          case "close-rescheduled":
            location.path('/loanaccount/' + accountId + '/close-rescheduled');
          break;
          case "transferFunds":
            if (scope.loandetails.clientId) {
              location.path('/accounttransfers/fromloans/'+accountId);
            }
          break;
          case "close":
            location.path('/loanaccount/' + accountId + '/close');
          break;
          case "guarantor":
            location.path('/guarantor/' + accountId);
          break;
          case "insurar":
             location.path('/insurar/' + accountId);
             break;
          case "unassignloanofficer":
            location.path('/loanaccount/' + accountId + '/unassignloanofficer');
          break;
          case "loanscreenreport":
            location.path('/loanscreenreport/' + accountId);
          break;
        }
      };

        scope.delCharge = function (id) {
            $modal.open({
                templateUrl: 'delcharge.html',
                controller: DelChargeCtrl,
                resolve:{
                    ids: function () {
                        return id;
                    }
                }
            });
        };

        var DelChargeCtrl = function ($scope, $modalInstance,ids) {
            $scope.delete = function () {
                resourceFactory.LoanAccountResource.delete({loanId : routeParams.id, resourceType : 'charges', chargeId : ids}, {}, function(data) {
                    route.reload();
                });
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };
        
        var CREATE_LOANCHARGE = rootScope.hasPermission("CREATE_LOANCHARGE");
        var CREATE_COLLATERAL = rootScope.hasPermission("CREATE_COLLATERAL");
        var APPROVE_LOAN = rootScope.hasPermission("APPROVE_LOAN");
        var UPDATE_LOAN = rootScope.hasPermission("UPDATE_LOAN");
        var REJECT_LOAN = rootScope.hasPermission("REJECT_LOAN");
        var UPDATELOANOFFICER_LOAN = rootScope.hasPermission("UPDATELOANOFFICER_LOAN");
        var WITHDRAW_LOAN = rootScope.hasPermission("WITHDRAW_LOAN");
        var DELETE_LOAN = rootScope.hasPermission("DELETE_LOAN");
        var CREATE_GUARANTOR = rootScope.hasPermission("CREATE_GUARANTOR");
        var CREATE_INSURAR = rootScope.hasPermission("CREATE_INSURAR");
        var READ_LOAN = rootScope.hasPermission("READ_LOAN");
        var UPDATELOANOFFICER_LOAN = rootScope.hasPermission("UPDATELOANOFFICER_LOAN");
        var DISBURSE_LOAN = rootScope.hasPermission("DISBURSE_LOAN");
        var APPROVALUNDO_LOAN = rootScope.hasPermission("APPROVALUNDO_LOAN");
        var REPAYMENT_LOAN = rootScope.hasPermission("REPAYMENT_LOAN");
        var DISBURSALUNDO_LOAN = rootScope.hasPermission("DISBURSALUNDO_LOAN");
        var WAIVEINTERESTPORTION_LOAN = rootScope.hasPermission("WAIVEINTERESTPORTION_LOAN");
        var WRITEOFF_LOAN = rootScope.hasPermission("WRITEOFF_LOAN");
        var CLOSEASRESCHEDULED_LOAN = rootScope.hasPermission("CLOSEASRESCHEDULED_LOAN");
        var CLOSE_LOAN = rootScope.hasPermission("CLOSE_LOAN");
        var DISBURSETOSAVINGS_LOAN = rootScope.hasPermission("DISBURSETOSAVINGS_LOAN");

      resourceFactory.LoanAccountResource.getLoanAccountDetails({loanId: routeParams.id, associations: 'all'}, function(data) {
          scope.loandetails = data;
          scope.guarantorDetails = data.guarantors;
          scope.insuranceDetails=data.insurences;
          scope.status = data.status.value;
          scope.chargeAction = data.status.value == "Submitted and pending approval" ? true : false;
          
          if(scope.loandetails.repaymentSchedule.periods && scope.loandetails.repaymentSchedule.periods[0].residualAmount){
        	  scope.loandetails.repaymentSchedule.periods[0].residualAmount = Math.round(scope.loandetails.repaymentSchedule.periods[0].residualAmount);
          }

          if(scope.loandetails.charges) {
            scope.charges = scope.loandetails.charges;
              for(var i in scope.charges){
                 if(scope.charges[i].paid || scope.charges[i].waived ||scope.charges[i].chargeTimeType.value=='Disbursement' || scope.loandetails.status.value!='Active')
                 {
                     var actionFlag = true;
                 }
                 else
                 {
                     var actionFlag = false;
                 }
                 scope.charges[i].actionFlag = actionFlag;
              }

            scope.chargeTableShow = true;
          }
          else {
            scope.chargeTableShow = false;
          }
          if(scope.loandetails.feeMasterData) {
        	  scope.deposits = scope.loandetails.feeMasterData;
        	  
        	  scope.depositTableShow = true;
          }
          else {
        	  scope.depositTableShow = false;
          }
          
          if(scope.status=="Submitted and pending approval" || scope.status=="Active" || scope.status=="Approved" ){
              scope.choice = true;
          }
              if (data.status.value == "Submitted and pending approval") {
            scope.buttons = { singlebuttons : [
                              {
                                name:"button.addloancharge",
                                icon :"icon-plus-sign",
                                taskPermissionName: CREATE_LOANCHARGE
                              },
                              {
                                name:"button.addcollateral",
                                icon :"icon-link",
                                taskPermissionName: CREATE_COLLATERAL
                              },
                              {
                                name:"button.approve",
                                icon :"icon-ok",
                                taskPermissionName: APPROVE_LOAN
                              },
                              {
                                name:"button.modifyapplication",
                                icon :"icon-edit",
                                taskPermissionName: UPDATE_LOAN
                              },
                              {
                                name:"button.reject",
                                icon :"icon-remove",
                                taskPermissionName: REJECT_LOAN
                              }
                            ],
                              options: [
                              {
                                name:"button.assignloanofficer",
                                taskPermissionName: UPDATELOANOFFICER_LOAN
                              },
                              {
                                name:"button.withdrawnbyclient",
                                taskPermissionName: WITHDRAW_LOAN
                              },
                              {
                                name:"button.delete",
                                taskPermissionName: DELETE_LOAN
                              },
                              {
                                name:"button.guarantor",
                                taskPermissionName: CREATE_GUARANTOR
                              },
                               {
                                name:"button.insurar",
                            	taskPermissionName: CREATE_INSURAR
                              },
                               {
                                name:"button.loanscreenreport",
                                taskPermissionName: READ_LOAN
                              }]
                              
                            };
        }

        if (data.status.value == "Approved") {
            scope.buttons = { singlebuttons : [
                              {
                                name:"button.assignloanofficer",
                                icon :"icon-user",
                                taskPermissionName: UPDATELOANOFFICER_LOAN
                              },
                              {
                                name:"button.disburse",
                                icon :"icon-flag",
                                taskPermissionName: DISBURSE_LOAN
                              },
                              {
                                name:"button.undoapproval",
                                icon :"icon-undo",
                                taskPermissionName: APPROVALUNDO_LOAN
                              }
                            ],
                              options: [{
                                name:"button.addloancharge",
                                taskPermissionName: CREATE_LOANCHARGE
                              },
                              {
                               name:"button.guarantor",
                               taskPermissionName: CREATE_GUARANTOR
                              },
                             {
                                name:"button.insurar",
                            	taskPermissionName: CREATE_INSURAR
                              },
                              {
                                name:"button.loanscreenreport",
                                taskPermissionName: READ_LOAN
                              }]
                              
                            };
        }

        if (data.status.value == "Active") {
            scope.buttons = { singlebuttons : [{
                                name:"button.addloancharge",
                                icon :"icon-plus-sign",
                                taskPermissionName: CREATE_LOANCHARGE
                              },
                              {
                                name:"button.makerepayment",
                                icon:"icon-dollar",
                                taskPermissionName: REPAYMENT_LOAN
                              },
                              {
                                name:"button.undodisbursal",
                                icon :"icon-undo",
                                taskPermissionName: DISBURSALUNDO_LOAN
                              } 
                            ],
                              options: [
                              {
                                name:"button.waiveinterest",
                                taskPermissionName: WAIVEINTERESTPORTION_LOAN
                              },
                              {
                                name:"button.writeoff",
                                taskPermissionName: WRITEOFF_LOAN
                              },
                              {
                                name:"button.close-rescheduled",
                                taskPermissionName: CLOSEASRESCHEDULED_LOAN
                              },
                              {
                                 name:"button.close",
                                 taskPermissionName: CLOSE_LOAN
                              },
                              {
                                name:"button.loanscreenreport",
                                taskPermissionName: READ_LOAN
                              }]
                              
                            };
              //loan officer not assigned to loan, below logic 
              //helps to display otherwise not                
              if (!data.loanOfficerName) {
                  scope.buttons.singlebuttons.splice(1,0,{
                                name:"button.assignloanofficer",
                                icon :"icon-user",
                                taskPermissionName: DISBURSE_LOAN
                              });
              }
        }
        if (data.status.value == "Overpaid") {
            scope.buttons = { singlebuttons : [{
                                name:"button.transferFunds",
                                icon :"icon-exchange",
                                taskPermissionName: DISBURSETOSAVINGS_LOAN
                              } 
                            ]                              
                            };
        }
      });
      scope.showDetails = function(id){
          resourceFactory.guarantorResource.get({loanId: routeParams.id,templateResource:id}, {}, function(data) {
              scope.guarantorData = data;
          });
  };
          scope.showDetailsIn = function(id){
          resourceFactory.insurarResource.get({loanId: routeParams.id}, {}, function(data) {
              scope.insurarData = data;
          });

      };
        scope.showDetails1 = function(id){
          resourceFactory.insurarResource.get({loanId: routeParams.id}, {}, function(data) {
              scope.insurarData = data;
          });

      };

      scope.deleteGroup = function (id) {
          scope.guarantorId = id;
        $modal.open({
            templateUrl: 'deleteguarantor.html',
            controller: GuarantorDeleteCtrl,
            resolve: {
                id: function(){
                    return scope.guarantorId;
                }
            }
        });
      };
       scope.deleteinsurar = function (){
            $modal.open({
                templateUrl: 'deleteinsurar.html',
                controller: InsuranceDeleteCtrl
            });
        };
      
        var InsuranceDeleteCtrl = function ($scope, $modalInstance) {
            $scope.delete = function () {
                resourceFactory.insurarResource.delete({loanId: routeParams.id} , {} , function(data) {
              route.reload();
                    // added dummy request param because Content-Type header gets removed
                    // if the request does not contain any data (a request body)
                });
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

      var GuarantorDeleteCtrl = function ($scope, $modalInstance,id) {
        $scope.delete = function () {
            resourceFactory.guarantorResource.delete({loanId: routeParams.id,templateResource:id}, {}, function(data) {
                route.reload();
            });
            $modalInstance.close('delete');
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
      };

      scope.getLoanDocuments = function (){
        resourceFactory.LoanDocumentResource.getLoanDocuments({loanId: routeParams.id}, function(data) {
            for(var i in data){
                var loandocs = {};
                loandocs = API_VERSION + '/loans/' + data[i].parentEntityId + '/documents/' + data[i].id + '/attachment?tenantIdentifier=default';
                data[i].docUrl = loandocs;
            }
            scope.loandocuments = data;
        });

      };

      resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_loan'} , function(data) {
        scope.loandatatables = data;
      });

      scope.dataTableChange = function(datatable) {
        resourceFactory.DataTablesResource.getTableDetails({datatablename: datatable.registeredTableName,
        entityId: routeParams.id, genericResultSet: 'true'} , function(data) {
          scope.datatabledetails = data;
          scope.datatabledetails.isData = data.data.length > 0 ? true : false;
          scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;

          for(var i in data.columnHeaders) {
            if (scope.datatabledetails.columnHeaders[i].columnCode) {
              for (var j in scope.datatabledetails.columnHeaders[i].columnValues){
                for(var k in data.data) {
                  if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                    data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                  }
                }
              }
            } 
          }

        });
      };

      scope.deleteAll = function (apptableName, entityId) {
        resourceFactory.DataTablesResource.delete({datatablename:apptableName, entityId:entityId, genericResultSet:'true'}, {}, function(data){
          route.reload();
        });
      };

      scope.deleteDocument = function (documentId, index) {
        resourceFactory.LoanDocumentResource.delete({loanId: scope.loandetails.id, documentId: documentId}, '', function(data) {
          scope.loandocuments.splice(index,1);
        });
      };

      scope.downloadDocument = function(documentId) {

      };

    }
  });
 lms.ng.application.controller('ViewLoanDetailsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$route', '$http','$modal','dateFilter','API_VERSION','$rootScope', lms.controllers.ViewLoanDetailsController]).run(function($log) {
    $log.info("ViewLoanDetailsController initialized");
  });
}(lms.controllers || {}));
