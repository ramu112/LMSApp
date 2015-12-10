(function(module) {
  lms.controllers = _.extend(module, {
    OfficesController: function(scope, resourceFactory) {

      scope.offices = [];
      scope.isTreeView = false;
      var idToNodeMap = {};

      scope.deepCopy = function (obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
          var out = [], i = 0, len = obj.length;
          for ( ; i < len; i++ ) {
            out[i] = arguments.callee(obj[i]);
          }
          return out;
        }
        if (typeof obj === 'object') {
          var out = {}, i;
          for ( i in obj ) {
            out[i] = arguments.callee(obj[i]);
          }
          return out;
        }
        return obj;
      }

      resourceFactory.officeResource.getAllOffices(function(data){
        scope.offices = scope.deepCopy(data);
        for(var i in data){
          data[i].children = [];
          idToNodeMap[data[i].id] = data[i];
        }
        function sortByParentId(a, b){
          return a.parentId - b.parentId;
        }
        data.sort(sortByParentId);

        var root = [];
        for(var i = 0; i < data.length; i++) {
          var currentObj = data[i];
          if(currentObj.children){
              currentObj.collapsed = "true";
          }
          if(typeof currentObj.parentId === "undefined") {
                root.push(currentObj);        
          } else {
                parentNode = idToNodeMap[currentObj.parentId];
                parentNode.children.push(currentObj);
          }
        }
        scope.treedata = root;
      });

     }
  });
  lms.ng.application.controller('OfficesController', ['$scope', 'ResourceFactory', lms.controllers.OfficesController]).run(function($log) {
    $log.info("OfficesController initialized");
  });
}(lms.controllers || {}));
