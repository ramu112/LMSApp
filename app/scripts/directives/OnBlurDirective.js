(function(module) {
    lms.directives = _.extend(module, {
        OnBlurDirective: function($parse) {
            return function(scope, elm, attrs){
                var onBlurFunction = $parse(attrs['ngOnBlur']);
                elm.bind("blur", function(event) {
                    scope.$apply(function() {
                        onBlurFunction(scope, { $event: event });
                    })});
            };
        }
    });
}(lms.directives || {}));

lms.ng.application.directive("ngOnBlur", ['$parse',lms.directives.OnBlurDirective]).run(function($log) {
    $log.info("OnBlurDirective initialized");
});