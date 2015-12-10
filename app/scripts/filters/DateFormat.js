(function(module) {
    lms.filters = _.extend(module, {
        DateFormat: function (dateFilter) {
            return function(input) {
                if(input){
                    var tDate = new Date(input);
                    return dateFilter(tDate,'dd MMMM yyyy');
                }

            }
        }
    });
    lms.ng.application.filter('DateFormat', ['dateFilter',lms.filters.DateFormat]).run(function($log) {
        $log.info("DateFormat filter initialized");
    });
}(lms.filters || {}));
