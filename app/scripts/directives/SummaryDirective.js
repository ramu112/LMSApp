(function(module) {
    lms.directives = _.extend(module, {
        SummaryDirective: function() {
            return {
                restrict: "E",
                transclude: true,
                scope: {
                    title: "@"
                },

                template:
                    "<div class='summary'>" +
                        "<div class='summary-header'>" +
                        "<div class='summary-header-text'>{{title}}</div></div>" +
                        "<div ng-transclude></div></div>"
            };

        }
    });
}(lms.directives || {}));

lms.ng.application.directive("ngSummary", [lms.directives.SummaryDirective]).run(function($log) {
    $log.info("SummaryDirective initialized");
});