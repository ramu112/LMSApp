(function(module) {
  lms.controllers = _.extend(module, {
    ClientClosedLoansAccountController: function(scope, resourceFactory, routeParams) {
        resourceFactory.clientAccountResource.get({clientId: routeParams.clientId} , function(data) {
            scope.clientAccounts = data;
        });

        scope.isClosed = function(loanaccount) {
          if(loanaccount.status.code === "loanStatusType.closed.written.off" ||
            loanaccount.status.code === "loanStatusType.closed.obligations.met" || 
            loanaccount.status.code === "loanStatusType.closed.reschedule.outstanding.amount" || 
            loanaccount.status.code === "loanStatusType.withdrawn.by.client" || 
            loanaccount.status.code === "loanStatusType.rejected") {
            return true;
          } else{
             return false;
          }
        };
    }
  });
  lms.ng.application.controller('ClientClosedLoansAccountController', ['$scope', 'ResourceFactory', '$routeParams', lms.controllers.ClientClosedLoansAccountController]).run(function($log) {
    $log.info("ClientClosedLoansAccountController initialized");
  });
}(lms.controllers || {}));
