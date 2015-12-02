(function(module) {
  lms.controllers = _.extend(module, {
    ViewLoanProductController: function(scope, routeParams , location , anchorScroll , resourceFactory ) {
        scope.loanproduct = [];
        scope.hasAccounting = undefined;
        resourceFactory.loanProductResource.get({loanProductId: routeParams.id , template: 'true'} , function(data) {
            scope.loanproduct = data;
            for(var i in scope.loanproduct.taxes){
    			if(scope.loanproduct.taxes[i].taxInclusive == 1){
                	scope.loanproduct.taxes[i].taxInclusive = true;
                }else{
                	scope.loanproduct.taxes[i].taxInclusive = false;
                }
            }
           scope.hasAccounting = data.accountingRule.id == 2 ? true : false;
        });

        scope.scrollto = function (link){
                location.hash(link);
                anchorScroll();

        };
    }
  });
  lms.ng.application.controller('ViewLoanProductController', ['$scope', '$routeParams', '$location', '$anchorScroll' , 'ResourceFactory', lms.controllers.ViewLoanProductController]).run(function($log) {
    $log.info("ViewLoanProductController initialized");
  });
}(lms.controllers || {}));
