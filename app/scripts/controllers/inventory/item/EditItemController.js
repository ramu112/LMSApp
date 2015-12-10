(function(module) {
  lms.controllers = _.extend(module, {
    EditItemController: function(scope, routeParams, resourceFactory, location,$rootScope,webStorage, $filter,dateFilter) {
        scope.itemClassDatas = [];
        scope.unitDatas = [];
        //scope.chargesDatas = [];
        scope.formData = {};
        scope.removeItemPrices = [];
        scope.totalItem=routeParams.totalItem;
        scope.first = {};
        scope.first.date = new Date();
        scope.manufacturerDatas=[];
        scope.itemmanufacturerData=[];
        scope.chargeCodeDatas=[];
         resourceFactory.itemResource.get({itemId: routeParams.id} , function(data) {
        	var reqDate = dateFilter(new Date(data.warrantyExpiryDate),'dd MMMM yyyy');
        	scope.formData.dateFormat = 'dd MMMM yyyy';
        	scope.first.date = reqDate;
        	scope.chargeCodeDatas=data.chargeCodeData;
        	scope.manufacturerDatas=data.manufacturerDatas;
        	scope.itemClassDatas = data.itemClassData;
            scope.unitDatas = data.unitData;
            //scope.chargesDatas = data.chargesData;
            scope.formData=data;
            scope.regionDatas = data.regionDatas;
            scope.itemPrices = data.itemPricesDatas;
            scope.formData.chargeCodeData = data.chargeCode;
            for(var i in scope.itemPrices){
            	scope.itemPrices[i].price = $filter("number")(scope.itemPrices[i].price,2);
           }
           

        });
         
         scope.reset123 = function(){
        	  webStorage.add("callingTab", {someString: "items" });
         };
        
         scope.addItemPrice = function () {
	           if (scope.itemPricesFormData.regionId && scope.itemPricesFormData.price) {
	        	   
	                scope.itemPrices.push({regionId:scope.itemPricesFormData.regionId, 
	                	price:scope.itemPricesFormData.price
	                });
	              
	                scope.itemPricesFormData.regionId = undefined;
	                scope.itemPricesFormData.price = undefined;
	                
	          	}
	     };
	     scope.removeItemPrice = function (index) {
	    	 console.log(index);
	    	 
	    	 scope.removeItemPrices.push({regionId:scope.itemPrices[index].regionId, 
          	   price:scope.itemPrices[index].price,locale:"en",id:scope.itemPrices[index].id});
           
	    	 scope.itemPrices.splice(index,1);
	     };
	     
        scope.submit = function() {	
        	 delete this.formData.id;
        	 delete this.formData.itemClassData;
        	 delete this.formData.unitData;
        	 delete this.formData.chargeCodeDatas;
        	 delete this.formData.auditDetails;
        	 delete this.formData.regionDatas;
        	 delete this.formData.itemPricesDatas;
        	 delete this.formData.manufacturerDatas;
        	 scope.formData.itemPrice;
        	 //this.formData.unitPrice = "0";
        	 /*scope.formData.itemPrices =new Array();
        	 scope.formData.removeItemPrices = new Array();
        	 if(scope.removeItemPrices.length > 0){
        		 scope.formData.removeItemPrices = scope.removeItemPrices;
        	 }
        	 
        	 if (scope.itemPrices.length > 0) {
                 
                 for (var i in scope.itemPrices) {
                	
                   scope.formData.itemPrices.push({regionId:scope.itemPrices[i].regionId, 
                	   price:scope.itemPrices[i].price,locale:"en",id:scope.itemPrices[i].id});
                 };
              }*/
        	 //this.formData.locale = $rootScope.locale.code;
        	 this.formData.locale = "en";
        	 var reqDate = dateFilter(scope.first.date,'dd MMMM yyyy');
             this.formData.dateFormat = 'dd MMMM yyyy';
             this.formData.warrantyExpiryDate = reqDate;
               resourceFactory.itemResource.update({'itemId': routeParams.id},this.formData,function(data){
             location.path('/viewitem/' + data.resourceId +'/item/'+ scope.totalItem);

          });
        };
    }
  });
  lms.ng.application.controller('EditItemController', ['$scope', '$routeParams', 'ResourceFactory', '$location','$rootScope','webStorage', '$filter','dateFilter', lms.controllers.EditItemController]).run(function($log) {
    $log.info("EditItemController initialized");
  });
}(lms.controllers || {}));
