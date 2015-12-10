(function(module) {
  lms.controllers = _.extend(module, {
    ClientClosedSavingsAccountController: function(scope, resourceFactory, routeParams) {
        resourceFactory.clientAccountResource.get({clientId: routeParams.clientId} , function(data) {
            scope.clientAccounts = data;
        });

        scope.isSavingClosed = function(savingaccount) {
          if (savingaccount.status.code === "savingsAccountStatusType.withdrawn.by.applicant" || 
            savingaccount.status.code === "savingsAccountStatusType.closed" ||
            savingaccount.status.code === "savingsAccountStatusType.rejected") {
            return true;
          } else{
             return false;
          }
        };
    }
  });
  lms.ng.application.controller('ClientClosedSavingsAccountController', ['$scope', 'ResourceFactory', '$routeParams', lms.controllers.ClientClosedSavingsAccountController]).run(function($log) {
    $log.info("ClientClosedSavingsAccountController initialized");
  });
}(lms.controllers || {}));
