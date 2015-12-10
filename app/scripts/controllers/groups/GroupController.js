(function(module) {
    lms.controllers = _.extend(module, {
        GroupController: function(scope, resourceFactory , paginatorService) {

            scope.groups = [];

            var fetchFunction = function(offset, limit, callback) {
                resourceFactory.groupResource.get({offset: offset, limit: limit} , callback);
            };

            scope.groups = paginatorService.paginate(fetchFunction, 14);

        }
    });
    lms.ng.application.controller('GroupController', ['$scope', 'ResourceFactory', 'PaginatorService', lms.controllers.GroupController]).run(function($log) {
        $log.info("GroupController initialized");
    });
}(lms.controllers || {}));

