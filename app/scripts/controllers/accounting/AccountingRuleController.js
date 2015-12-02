(function(module) {
  lms.controllers = _.extend(module, {
    AccountingRuleController: function(scope, resourceFactory) {

		resourceFactory.accountingRulesResource.get(function(data){
			scope.rules = data;
		});

    }
  });
  lms.ng.application.controller('AccountingRuleController', ['$scope', 'ResourceFactory', lms.controllers.AccountingRuleController]).run(function($log) {
    $log.info("AccountingRuleController initialized");
  });
}(lms.controllers || {}));