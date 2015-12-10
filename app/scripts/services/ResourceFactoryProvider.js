(function(module) {
  mifosX.services = _.extend(module, {
    ResourceFactoryProvider: function() {
      var baseUrl = "" , apiVer = "/LMS/api/v1";
      this.setBaseUrl = function(url) {
          baseUrl = url;
          console.log(baseUrl);
      };

      this.$get = ['$resource','$rootScope', function(resource,$rootScope) {
        var defineResource = function(url, paramDefaults, actions) {
            var tempUrl = baseUrl;
            $rootScope.hostUrl = tempUrl.replace(":8443","");
          return resource(baseUrl + url, paramDefaults, actions);
        };
        return {
          userResource: defineResource(apiVer + "/users/:userId", {userId:'@userId'}, {
            getAllUsers: {method: 'GET', params: {fields: "id,firstname,lastname,username,officeName"}, isArray: true},
            getUser: {method:'GET',params:{}}
          }),
          roleResource: defineResource(apiVer + "/roles/:roleId", {}, {
            getAllRoles: {method: 'GET', params: {}, isArray: true}
          }),
          rolePermissionResource: defineResource(apiVer + "/roles/:roleId/permissions", {roleId:'@roleId'}, {
            get: {method: 'GET', params: {}},
            update: {method: 'PUT'}
          }),
          permissionResource: defineResource(apiVer + "/permissions", {}, {
            get: {method: 'GET', params: {}, isArray: true},
            update: {method: 'PUT'}
          }),
          officeResource: defineResource(apiVer + "/offices/:officeId", {officeId:"@officeId"}, {
            getAllOffices: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT'}
          }),
          clientResource: defineResource(apiVer + "/clients/:clientId/:anotherresource", {clientId:'@clientId',anotherresource:'@anotherresource'}, {
            getAllClients: {method: 'GET', params: {}},
            getClientClosureReasons: {method: 'GET', params: {}},
            getAllClientDocuments: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT'}
          }),
          clientIdentifierResource: defineResource(apiVer + "/client_identifiers/:clientIdentityId/documents", {clientIdentityId:'@clientIdentityId'}, {
            get: {method: 'GET', params: {}, isArray:true}
          }),
          clientDocumentsResource: defineResource(apiVer + "/clients/:clientId/documents/:documentId", {clientId:'@clientId',documentId:'@documentId'}, {
            getAllClientDocuments: {method: 'GET', params: {}, isArray: true}
          }),
          clientAccountResource: defineResource(apiVer + "/clients/:clientId/accounts", {clientId:'@clientId'}, {
            getAllClients: {method: 'GET', params: {}}
          }),
          clientNotesResource: defineResource(apiVer + "/clients/:clientId/notes", {clientId:'@clientId'}, {
            getAllNotes: {method: 'GET', params: {}, isArray:true}
          }),
          clientTemplateResource: defineResource(apiVer + "/clients/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          clientIdenfierTemplateResource: defineResource(apiVer + "/clients/:clientId/identifiers/template", {clientId:'@clientId'}, {
            get: {method: 'GET', params: {}}
          }),
          clientIdenfierResource: defineResource(apiVer + "/clients/:clientId/identifiers/:id", {clientId:'@clientId', id: '@id'}, {
            get: {method: 'GET', params: {}}
          }),
          groupResource: defineResource(apiVer + "/groups/:groupId/:anotherresource", {groupId:'@groupId',anotherresource:'@anotherresource'}, {
              get: {method: 'GET', params: {}},
              update: { method: 'PUT'}
          }),
          groupSummaryResource: defineResource(apiVer + "/runreports/:reportSource",{reportSource: '@reportSource'}, {
              getSummary: {method: 'GET', params: {}}
          }),
          groupAccountResource: defineResource(apiVer + "/groups/:groupId/accounts", {groupId:'@groupId'}, {
              getAll: {method: 'GET', params: {}}
          }),
          groupNotesResource: defineResource(apiVer + "/groups/:groupId/notes/:noteId", {groupId:'@groupId',noteId:'@noteId'}, {
              getAllNotes: {method: 'GET', params: {}, isArray:true}
          }),
          groupTemplateResource: defineResource(apiVer + "/groups/template", {}, {
              get: {method: 'GET', params: {}}
          }),
          groupMeetingResource:defineResource(apiVer + "/groups/:groupId/meetings/:templateSource", {groupId:'@groupId',templateSource:'@templateSource'}, {
              getMeetingInfo: {method:'GET', params: {}}
          }),
          attachMeetingResource:defineResource(apiVer + "/:groupOrCenter/:groupOrCenterId/calendars/:templateSource", {groupOrCenter:'@groupOrCenter', groupOrCenterId:'@groupOrCenterId',
          templateSource:'@templateSource'}, {
              update: {method: 'PUT'}
          }),
          runReportsResource: defineResource(apiVer + "/runreports/:reportSource", {reportSource : '@reportSource'}, {
            get: {method: 'GET', params: {}, isArray:true},
            getReport: {method: 'GET', params: {}}
          }),
          reportsResource: defineResource(apiVer + "/reports/:id/:resourceType", {id:'@id', resourceType:'@resourceType'}, {
            get: {method: 'GET', params: {id:'@id'}},
            getReport: {method: 'GET', params: {id:'@id'}, isArray:true},
            getReportDetails: {method: 'GET', params: {id:'@id'}},
            update: {method: 'PUT', params: {}}
          }),
          DataTablesResource: defineResource(apiVer + "/datatables/:datatablename/:entityId/:resourceId", {datatablename:'@datatablename',entityId:'@entityId', resourceId:'@resourceId'}, {
            getAllDataTables: {method: 'GET', params: {}, isArray:true},
            getTableDetails: {method: 'GET', params: {}},
            update: {method: 'PUT'}
          }),
          loanProductResource: defineResource(apiVer + "/loanproducts/:loanProductId/:resourceType", {resourceType:'@resourceType', loanProductId:'@loanProductId'}, {
            getAllLoanProducts: {method: 'GET', params: {}, isArray:true},
            getProductmix: {method: 'GET', params: {}},
            put: {method: 'PUT', params: {}}
          }),
          chargeResource: defineResource(apiVer + "/charges/:chargeId", {chargeId:'@chargeId'}, {
            getAllCharges: {method: 'GET', params: {}, isArray:true},
            getCharge: {method: 'GET', params: {}},
            update: {method: 'PUT', params: {}}
          }),
          chargeTemplateResource: defineResource(apiVer + "/charges/template", {
            get: {method: 'GET', params: {}, isArray:true},
            getChargeTemplates: {method: 'GET', params: {}},
          }),
          savingProductResource: defineResource(apiVer + "/savingsproducts/:savingProductId/:resourceType", {savingProductId:'@savingProductId', resourceType:'@resourceType'}, {
            getAllSavingProducts: {method: 'GET', params: {}, isArray:true},
            update: {method: 'PUT', params: {}}
          }),
          loanResource: defineResource(apiVer + "/loans/:loanId/:resourceType/:resourceId", {resourceType:'@resourceType', loanId:'@loanId', resourceId:'@resourceId'}, {
            getAllLoans: {method: 'GET', params: {}},
            put: {method: 'PUT', params: {}}
          }),
          loanChargeTemplateResource: defineResource(apiVer + "/loans/:loanId/charges/template", {loanId:'@loanId'}, {
            get: {method: 'GET', params: {}}
          }),
          loanChargesResource: defineResource(apiVer + "/loans/:loanId/charges/:chargeId", {loanId:'@loanId',chargeId:'@chargeId'}, {
          }),
          loanCollateralTemplateResource: defineResource(apiVer + "/loans/:loanId/collaterals/template", {loanId:'@loanId'}, {
            get: {method: 'GET', params: {}}
          }),
          loanTrxnsTemplateResource: defineResource(apiVer + "/loans/:loanId/transactions/template", {loanId:'@loanId'}, {
              get: {method: 'GET', params: {}}
          }),
          loanTrxnsResource: defineResource(apiVer + "/loans/:loanId/transactions/:transactionId", {loanId:'@loanId', transactionId:'@transactionId'}, {
              get: {method: 'GET', params: {}}
          }),
          LoanAccountResource: defineResource(apiVer + "/loans/:loanId/:resourceType/:chargeId", {loanId:'@loanId', resourceType:'@resourceType', chargeId:'@chargeId'}, {
            getLoanAccountDetails: {method: 'GET', params: {}},
            update: {method: 'PUT'}
          }),
          LoanDocumentResource: defineResource(apiVer + "/loans/:loanId/documents/:documentId", {loanId:'@loanId',documentId:'@documentId'}, {
            getLoanDocuments: {method: 'GET', params: {} , isArray: true}
          }),
          currencyConfigResource: defineResource(apiVer + "/currencies", {}, {
            get: {method: 'GET', params: {}},
            update: { method: 'PUT'},
            upd: { method: 'PUT', params:{}, isArray:true}
          }),
          userListResource: defineResource(apiVer + "/users/:userId", {userId:'@userId'}, {
            getAllUsers: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT' }
          }),
          userTemplateResource: defineResource(apiVer + "/users/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          employeeResource: defineResource(apiVer + "/staff/:staffId", {staffId:'@staffId'}, {
            getAllEmployees: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT' }
          }),
         assetResource: defineResource(apiVer + "/assets/:assetId", {assetId:'@assetId'}, {
            getAllAssets: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT' }
          }),
               assetTemplateResource: defineResource(apiVer + "/assets/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          globalSearch: defineResource(apiVer + "/search", {query:'@query'}, {
            search: { method: 'GET',
                      params: { query: '@query'} ,
                      isArray:true
                    }
          }),
          fundsResource: defineResource(apiVer + "/funds/:fundId", {fundId:'@fundId'}, {
            getAllFunds: {method: 'GET', params: {}, isArray: true},
            getFund: {method:'GET', params: {}},
            update: {method: 'PUT', params: {}}
          }),
          accountingRulesResource: defineResource(apiVer + "/accountingrules/:accountingRuleId", {accountingRuleId:'@accountingRuleId'}, {
            getAllRules: {method: 'GET', params: {associations : 'all'}, isArray: true},
            getById: {method: 'GET', params: {accountingRuleId:'@accountingRuleId'}},
            get: {method: 'GET', params: {}, isArray: true},
            update: {method: 'PUT'}
          }),
          accountingRulesTemplateResource: defineResource(apiVer + "/accountingrules/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          accountCoaResource: defineResource(apiVer + "/glaccounts/:glAccountId", {glAccountId:'@glAccountId'}, {
            getAllAccountCoas: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT' }
          }),
          accountCoaTemplateResource: defineResource(apiVer + "/glaccounts/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          journalEntriesResource: defineResource(apiVer + "/journalentries/:trxid", {trxid:'@transactionId'}, {
            get: {method: 'GET', params: {transactionId:'@transactionId'}},
            reverse: {method: 'POST', params:{command:'reverse'}},
            search:{method: 'GET', params: {}}
          }),
          accountingClosureResource: defineResource(apiVer + "/glclosures/:accId", {accId:"@accId"}, {
            get: {method: 'GET', params: {}, isArray:true},
            getView: {method: 'GET', params: {}}
          }) ,
          codeResources: defineResource(apiVer + "/codes/:codeId", {codeId:"@codeId"}, {
              getAllCodes: {method: 'GET', params: {}, isArray: true},
              update: { method: 'PUT', params: {}, isArray:true }
          }),
          codeValueResource: defineResource(apiVer + "/codes/:codeId/codevalues/:codevalueId", {codeId:'@codeId',codevalueId:'@codevalueId'}, {
            getAllCodeValues: {method: 'GET', params: {}, isArray:true},
            update: { method: 'PUT', params: {}, isArray:true }
          }),
          holResource: defineResource(apiVer + "/holidays", {}, {
              getAllHols: {method: 'GET', params: {}, isArray: true}
          }),
          holValueResource: defineResource(apiVer + "/holidays/:holId", {holId:'@holId'}, {
              getholvalues: {method: 'GET', params: {}}
          }),
          savingsTemplateResource: defineResource(apiVer + "/savingsaccounts/template", {}, {
              get: {method: 'GET', params: {}}
          }),
          savingsResource: defineResource(apiVer + "/savingsaccounts/:accountId/:resourceType/:chargeId",
            {accountId:'@accountId', resourceType:'@resourceType', chargeId:'@chargeId'}, {
              get: {method: 'GET', params: {}},
              update: {method: 'PUT'}
          }),
          savingsChargeResource: defineResource(apiVer + "/savingsaccounts/:accountId/charges/:resourceType",{accountId:'@accountId', resourceType:'@resourceType'}, {
              get: {method: 'GET', params: {}},
              update: {method: 'PUT'}
          }),
          savingsTrxnsTemplateResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/template", {savingsId:'@savingsId'}, {
              get: {method: 'GET', params: {savingsId:'@savingsId'}}
          }),
          savingsTrxnsResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/:transactionId", {savingsId:'@savingsId', transactionId:'@transactionId'}, {
              get: {method: 'GET', params: {savingsId:'@savingsId', transactionId:'@transactionId'}}
          }),
          accountTransferResource: defineResource(apiVer + "/accounttransfers/:transferId", {transferId:'@transferId'}, {
              get: {method: 'GET', params: {transferId:'@transferId'}}
          }),
          accountTransfersTemplateResource: defineResource(apiVer + "/accounttransfers/template", {}, {
              get: {method: 'GET', params: {}}
          }),
          centerAccountResource: defineResource(apiVer + "/centers/:centerId/accounts", {centerId:'@centerId'}, {
              getAll: {method: 'GET', params: {}, isArray: true}
          }),
          centerResource: defineResource(apiVer + "/centers/:centerId/:anotherresource", {centerId:'@centerId',anotherresource:'@anotherresource'}, {
            get: {method: 'GET', params: {}},
            update: { method: 'PUT'}
          }),
          centerMeetingResource:defineResource(apiVer + "/centers/:centerId/meetings/:templateSource", {centerId:'@centerId',templateSource:'@templateSource'}, {
            getMeetingInfo: {method:'GET', params: {}}
          }),
          centerTemplateResource: defineResource(apiVer + "/centers/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          jobsResource: defineResource(apiVer + "/jobs/:jobId/:resourceType", {jobId : '@jobId',resourceType : '@resourceType'}, {
            get: {method: 'GET', params: {}, isArray: true},
            getJobDetails: {method: 'GET', params: {}},
            getJobHistory: {method: 'GET', params: {}},
            update: {method: 'PUT', params: {}},
          }),
          schedulerResource: defineResource(apiVer + "/scheduler", {}, {
            get: {method: 'GET', params: {}}
          }),
          assignStaffResource:defineResource(apiVer + "/:groupOrCenter/:groupOrCenterId", {groupOrCenter:'@groupOrCenter', groupOrCenterId:'@groupOrCenterId'}, {
            get: {method: 'GET', params: {}}
          }),
          configurationResource:defineResource(apiVer + "/configurations",{}, {
            get: {method: 'GET', params: {}},
            update: {method: 'PUT', params: {}}
          }),
          cacheResource:defineResource(apiVer + "/caches",{}, {
            get: {method: 'GET', params: {}, isArray:true},
            update: {method: 'PUT', params: {}}
          }),
          templateResource:defineResource(apiVer + "/templates/:templateId/:resourceType",{templateId: '@templateId', resourceType:'@resourceType'}, {
            get: {method: 'GET', params: {}, isArray:true},
            getTemplateDetails: {method: 'GET', params: {}},
            update: {method: 'PUT', params: {}},
          }),
          loanProductTemplateResource: defineResource(apiVer + "/loanproducts/template", {}, {
           get: {method: 'GET', params: {}}
          }),
          loanReassignmentResource: defineResource(apiVer + "/loans/loanreassignment/:templateSource", {templateSource:'@templateSource'}, {
           get: {method: 'GET', params: {}}
          }),
          auditResource: defineResource(apiVer + "/audits/:templateResource", {templateResource:'@templateResource'}, {
            get: {method: 'GET', params: {}},
            search: {method: 'GET', params: {},isArray:true}
          }),
          guarantorResource: defineResource(apiVer + "/loans/:loanId/guarantors/:templateResource", {loanId:'@loanId',templateResource:'@templateResource'}, {
            get: {method: 'GET', params: {}},
            update: {method: 'PUT', params: {}}
          }),
           insurarTemplateResource: defineResource(apiVer + "/insurances/template", {}, {
            get: {method: 'GET', params: {}}
          }),
            insurarResource: defineResource(apiVer + "/insurances/:loanId", {loanId:'@loanId'}, {
            get: {method: 'GET', params: {}},
            update: {method: 'PUT', params: {}}
          }),

          checkerInboxResource: defineResource(apiVer + "/makercheckers/:templateResource", {templateResource:'@templateResource'}, {
            get: {method: 'GET', params: {}},
            search: {method: 'GET', params: {},isArray:true}
          }),
          
          taxmappingResource: defineResource(apiVer + "/taxmap/:taxId", {taxId:'@taxId'}, {
        	  	update: { method: 'PUT' }
          }),
          
          taxmappingtemplateResource: defineResource(apiVer + "/taxmap/template", {}, {
        	  getAlltaxmapping: {method: 'GET', params: {}}
          }),
          
          taxCalculationResource: defineResource(apiVer + "/loans/tax/:loanId", {}, {update: {method: 'PUT', params: {}}}),
          
          calculationResource: defineResource(apiVer + "/loans/calculator", {}, {update: {method: 'PUT', params: {}}}),
          
          calculationExportResource: defineResource(apiVer + "/loans/calculator/export", {}, {update: {method: 'PUT', params: {}}}),
          
          feeMasterResource: defineResource(apiVer + "/feemaster/:id", {id:'@id'},{update: { method: 'PUT' }}),
          
          feeMasterTemplateResource: defineResource(apiVer + "/feemaster/template", {},{}),
          
          getAllProspectResource : defineResource(apiVer + "/prospects/allprospects", {},{
        	  getAllDetails: {method: 'GET', params: {}}
          }),
          
          prospectTemplateResource : defineResource(apiVer + "/prospects/template", {},{  
        	  getTemplate: {method: 'GET', params: {}}
          }),
          
          prospectResource: defineResource(apiVer + "/prospects/:id", {id:'@id'},{update: { method: 'PUT' }}),
          
          prospectConvertResource: defineResource(apiVer + "/prospects/converttoclient/:prospectId", {prospectId:'@prospectId'},{}),
          itemDetailTemplateResource: defineResource(apiVer + "/itemdetails/template", {grnId: '@grnId'}, {
              get: {method: 'GET', params: {}}	
          }),
          itemSaleResource: defineResource(apiVer + "/itemsales", {}, {
          	 get: {method: 'GET', params: {}}
         }) ,
          itemDetailsResource: defineResource(apiVer + "/itemdetails/:itemId/:anotherresource", {itemId:'@itemId',anotherresource:'@anotherresource'}, {
           	  getAlldetails: {method: 'GET', params: {}},
                 get: {method: 'GET', params: {}},
	             update: {method: 'PUT', params: {}}
             }),
          supplierResource: defineResource(apiVer + "/suppliers/:id", {id: '@id'}, {
          	  getAlldetails: {method: 'GET', params: {}},
                get: {method: 'GET', params: {},isArray: true},

                update: {method: 'PUT', params: {}}
            }),
            itemResource: defineResource(apiVer + "/items/:itemId", {itemId:'@itemId'}, {
          	   getAllItems: {method: 'GET', params: {}},
                get: {method: 'GET', params: {}},
                update: {method: 'PUT', params: {}}
           }),
           singleItemDetailResource: defineResource(apiVer + "/itemdetails/singleitem/:itemId", {}, {
               get: {method: 'GET', params: {}}	
           }),
           grnTemplateResource: defineResource(apiVer + "/grn/template", {},{
               get: {method: 'GET', params: {}}
           }),
           grnResource: defineResource(apiVer + "/grn/:grnId", {grnId: '@grnId'},{
               get: {method: 'GET', params: {}},
              update: {method: 'PUT', params: {}}
           }),
           itemDetailsTempDropdownResource: defineResource(apiVer + "/itemdetails/template/dropdown", {}, {
           }),
           itemhistoryResource: defineResource(apiVer + "/mrn/history/", {},{
           	  getAlldetails: {method: 'GET', params: {}},
           	  get: {method: 'GET', params: {}}
              }),
           itemSaleTemplateResource: defineResource(apiVer + "/itemsales/template", {}, {
               get: {method: 'GET', params: {}}
           }) ,
          viewMrnResource: defineResource(apiVer + "/mrn/view/", {},{
              getAlldetails: {method: 'GET', params: {}},
              get: {method: 'GET', params: {}}
                 }),
           itemTemplateResource: defineResource(apiVer + "/items/template", {}, {
              getAllItems: {method: 'GET', params: {}, isArray: true},
              get: {method: 'GET', params: {}}
               }),
           mrnTemplateResource: defineResource(apiVer + "/mrn/template", {}, {
               getAlldetails: {method: 'GET', params: {}, isArray: true},
               get: {method: 'GET', params: {}}
               }),
           mrnResource: defineResource(apiVer + "/mrn/:mrnId", {}, {
                 getAlldetails: {method: 'GET', params: {}, isArray: true},
                 get: {method: 'GET', params: {}}
               }),
          moveMrnResource: defineResource(apiVer + "/mrn/template/ids", {}, {
                 getAlldetails: {method: 'GET', params: {}, isArray: true},
                 get: {method: 'GET', params: {}}
               }),
               
          moveMrnSaveResource: defineResource(apiVer + "/mrn/movemrn/:mrnId", {}, {
                 get: {method: 'GET', params: {}},
               	 getMovedMrnResource: {method: 'GET', params: {mrnId:'@mrnId'}}
               }),
          moveItemSaleSaveResource: defineResource(apiVer + "/mrn/moveitemsale", {}, {
                   get: {method: 'GET', params: {}},
               }),
          itemDetailsforDeleteResource: defineResource(apiVer + "/itemdetails/:itemId", {itemId:'@itemId'}, {
           	  getAlldetails: {method: 'GET', params: {}},
                  get: {method: 'GET', params: {}},
		          update: {method: 'PUT', params: {}}
                 }),
         oneTimeSaleTemplateResourceData: defineResource(apiVer + "/onetimesales/:itemId/item", {itemId:'@itemId'}, {
             get: {method: 'GET', params: {}}
                   }),
         oneTimeSaleQuantityResource: defineResource(apiVer + "/onetimesales/:itemId/totalprice", {itemId:'@itemId'}, {
             get: {method: 'POST', params: {}}
                // get: {method: 'GET', params: {}}
               }),
         /*propertydeviceMappingResource: defineResource(apiVer + "/property/allocatedevice/:clientId", {clientId:'@clientId'}, {
             update: { method: 'PUT' }
               })*/
          oneTimeSaleTemplateResource: defineResource(apiVer + "/onetimesales/template", {}, {
             getOnetimes: {method: 'GET', params: {}}
               }),
          itemMasterDetailTemplateResource: defineResource(apiVer + "/itemdetails/serialnum", {}, {}),
              clientConfigurationResource:defineResource(apiVer + "/configurations/config",{}, {
                update: {method: 'PUT', params: {}}
               }),
          oneTimeSaleResource: defineResource(apiVer + "/onetimesales/:clientId", {clientId:'@clientId'}, {
              	getOneTimeSale: {method: 'GET', params: {clientId:'@clientId'}}
               }),
          
        };
      }];
    }
  });
  mifosX.ng.services.config(function($provide) {
    $provide.provider('ResourceFactory', mifosX.services.ResourceFactoryProvider);
  }).run(function($log) { $log.info("ResourceFactory initialized"); });
}(mifosX.services || {}));
