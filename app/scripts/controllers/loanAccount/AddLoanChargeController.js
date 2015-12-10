(function(module) {
  lms.controllers = _.extend(module, {
    AddLoanChargeController: function(scope, resourceFactory, routeParams, location, dateFilter) {

        scope.charges = [];
        scope.formData = {};
        scope.isCollapsed = true;
        scope.loanId =routeParams.id;
        resourceFactory.loanChargeTemplateResource.get({loanId:scope.loanId}, function(data) {
          scope.charges = data.chargeOptions;
        });

        scope.selectCharge = function() {
          resourceFactory.chargeResource.get({chargeId:scope.formData.chargeId, template:true}, function(data) {
            scope.isCollapsed = false;
            scope.chargeData = data;
            scope.formData.amount = data.amount;
          });
        };

        scope.cancel = function() {
          location.path('/viewloanaccount/' + scope.loanId);
        };

        scope.submit = function() {
          this.formData.locale = 'en';
          this.formData.dateFormat = 'dd MMMM yyyy';
          if (this.formData.dueDate) {
            this.formData.dueDate = dateFilter(this.formData.dueDate,'dd MMMM yyyy'); 
          };
          resourceFactory.loanResource.save({resourceType:'charges', loanId:scope.loanId}, this.formData, function(data){
            location.path('/viewloanaccount/' + data.loanId);
          });
        };

    }
  });
  lms.ng.application.controller('AddLoanChargeController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', lms.controllers.AddLoanChargeController]).run(function($log) {
    $log.info("AddLoanChargeController initialized");
  });
}(lms.controllers || {}));
