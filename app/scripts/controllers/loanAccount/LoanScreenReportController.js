(function(module) {
  lms.controllers = _.extend(module, {
    LoanScreenReportController: function(scope, resourceFactory, location, http, API_VERSION, routeParams,$rootScope) {
        /*resourceFactory.templateResource.get({entityId : 1, typeId : 0}, function(data) {
            scope.loanTemplateData = data;
        });
        
        scope.getLoanTemplate = function(templateId) {
          scope.selectedTemplate = templateId;
          http({
            method:'POST',
            url: API_VERSION + '/templates/'+templateId+'?loanId='+routeParams.loanId,
            data: {}
          }).then(function(data) {
            scope.template = data.data;
          });
        };*/
    	
    	scope.downloadFile = function (){
             
             window.open($rootScope.hostUrl+ API_VERSION +'/loans/printlsrdoc/'+routeParams.loanId+'?tenantIdentifier=default');
        };scope.downloadFile();
    	
    }
  });
  lms.ng.application.controller('LoanScreenReportController', ['$scope', 'ResourceFactory', '$location','$http', 'API_VERSION', '$routeParams','$rootScope', lms.controllers.LoanScreenReportController]).run(function($log) {
    $log.info("LoanScreenReportController initialized");
  });
}(lms.controllers || {}));
