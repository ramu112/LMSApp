(function(module) {
  lms.controllers = _.extend(module, {
    LoanDocumentController: function(scope, location, http, routeParams, API_VERSION,$upload) {
      scope.loanId = routeParams.loanId;
      scope.onFileSelect = function($files) {
        scope.file = $files[0];
      };

      scope.submit = function () {
          $upload.upload({
          url: API_VERSION + '/loans/'+scope.loanId+'/documents',
          data: scope.formData,
          file: scope.file
        }).then(function(data) {
          // to fix IE not refreshing the model
          if (!scope.$$phase) {
            scope.$apply();
          }
          location.path('/viewloanaccount/'+scope.loanId);
        });
      };
    }
  });
  lms.ng.application.controller('LoanDocumentController', ['$scope', '$location', '$http', '$routeParams', 'API_VERSION','$upload', lms.controllers.LoanDocumentController]).run(function($log) {
    $log.info("LoanDocumentController initialized"); 
  });
}(lms.controllers || {}));