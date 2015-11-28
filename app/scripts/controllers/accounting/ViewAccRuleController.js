(function(module) {
  lms.controllers = _.extend(module, {
    ViewAccRuleController: function(scope, resourceFactory, routeParams, location,$modal) {

    resourceFactory.accountingRulesResource.getById({accountingRuleId:routeParams.id}, function(data){
      scope.rule = data;
    });
        scope.deleteRule = function (){
            $modal.open({
                templateUrl: 'deleteaccrule.html',
                controller: AccRuleDeleteCtrl
            });
        };
        var AccRuleDeleteCtrl = function ($scope, $modalInstance) {
            $scope.delete = function () {
                resourceFactory.accountingRulesResource.delete({accountingRuleId:routeParams.id}, {}, function(data){
                    location.path('/accounting_rules');
                });
                $modalInstance.close('delete');
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

    }
  });
  lms.ng.application.controller('ViewAccRuleController', ['$scope', 'ResourceFactory', '$routeParams', '$location','$modal', lms.controllers.ViewAccRuleController]).run(function($log) {
    $log.info("ViewAccRuleController initialized");
  });
}(lms.controllers || {}));