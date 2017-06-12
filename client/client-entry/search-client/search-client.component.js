
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './search-client.html';

import 'angular-component';

class SearchClientCtrl {
  constructor($scope,$rootScope,$http,$state,$document,$reactive,Notification) {

     $reactive(this).attach($scope);

    $scope.viewModel(this);

    let _this = this;

    this.helpers({

    });
    this.newClient = {};
    this.newClient.searchBy = "Customer Name/Company Name";

    this.navHeader = "Homepage > Search for an existing customer";
    this.isSearchCustomer = true;
    this.logout = function() {
      Meteor.loginFlag = false;
      $state.go('login');
    };

    this.updateFields = function() {
       if(this.newClient.searchBy == "Sort Code/Account Number") {
          this.accountSortCodeCheck = true;
       } else {
          this.accountSortCodeCheck = false;
       }
    };
    this.createQuote = () => {
      $rootScope.isSearchReturned = true;
      $state.go("createquote");
    };
    this.createPayment = () => {
      $rootScope.isSearchReturned = true;
      $state.go("createpayment");
    };

    this.returnToHomePage = () => {
       $rootScope.isNotDirectView = false;
       $rootScope.isSearchReturned = false;
        $rootScope.isBankDetails=false;
       $rootScope.customerDetails = {};
       $state.go("landingpage");
    };

    this.getExpiredDate = (createdDate) => {
      var dateNew = new Date(createdDate);
      dateNew.AddDays(28);
      return dateNew;

    }


    



      this.changeState = function(state) {
        if(state == "dashboard") {
          $state.go('landingpage');
        } 
        if(state == "newloan") {
          $state.go('onboardcustomer');
        } 
        if(state == "newquote") {
          $state.go('createquote');
        }
      };

    $scope.showInfo = (row) => {
         // alert(row.entity._id);
         // alert(row.entity.clientId);
         // alert(row.entity.brokerId);
         Meteor.call("getCustomerDetails",row.entity._id,row.entity.clientId,row.entity.brokerId,function(error,results) {
               console.log("search customer data");
               console.log(JSON.stringify(results.data));
               $rootScope.customerDetails = results.data;
              // alert(JSON.stringify($rootScope.customerDetails));
               //alert(JSON.stringify($rootScope.customerDetails));
               if($rootScope.customerDetails.transactions[0]){
               let expiredDate= $rootScope.customerDetails.transactions["0"].createdTime;
                var expiryDate = new Date(expiredDate).toISOString().split('T')[0];
                 var date=new Date(expiryDate);
                $scope.expiredDate = new Date(date.getFullYear(),date.getMonth(),date.getDate()+28);
              }
                if($rootScope.isNotDirectView) {
                    $rootScope.isSearchReturned = true;
                    //alert(JSON.stringify($rootScope.customerDetails));
                   // _this.quote.newClient.customerName =  $rootScope.customerDetails.companyName;
                   // _this.quote.newClient.dateOfBirth =  $rootScope.customerDetails.dateOfBirth;
                   // _this.quote.newClient.customerEmail =  $rootScope.customerDetails.eMail;
                   // _this.quote.newClient.natureOfBusiness =  $rootScope.customerDetails.natureOfBusiness;
                   // _this.quote.newClient.customerHomeTel =  $rootScope.customerDetails.telephone;
                   // _this.quote.newClient.customerType =  $rootScope.customerDetails.tradeType;
                   // _this.quote.newClient.address1 =  $rootScope.customerDetails.address.addressLine1;
                   // _this.quote.newClient.address2 =  $rootScope.customerDetails.address.addressLine2;
                   // _this.quote.newClient.address3 =  $rootScope.customerDetails.address.addressLine3;
                   // _this.quote.newClient.address4 =  $rootScope.customerDetails.address.addressLine4;
                   // _this.quote.newClient.postCode =  $rootScope.customerDetails.data.address.postcode;
                   
                } else {
                 _this.selectedCustomer = results.data;
                 _this.isCustomerSelected = true;
                 _this.isCustomerDetails = false;
                 _this.isSearchCustomer = false; 
               }
                //$scope.apply();
          });


         // _this.selectedCustomer = row; 
         
    };

    // this.updateSearchType = () => {
    //   alert(_this.newClient.searchBy);
    //   //$scope.$apply();
    // }

    this.searchAgain = () => {
        _this.isCustomerSelected = false;
         _this.isCustomerDetails = false;
         _this.isSearchCustomer = true;
    };

    this.createNewCustomer = () => {
       $rootScope.customerDetails = {};
       $state.go("createcustomer");
    };
    this.editCustomer = () => {
       $rootScope.isSearchReturned = true;
       $state.go("createcustomer");
    };
      this.proceedToBankDetails = () => {
       $rootScope.isSearchReturned = true;
      
       $rootScope.isPolicyDetails = false;
       $rootScope.isBankDetails=true;

      $rootScope.backToCust=false;
      console.log("policydetails", $rootScope.isPolicyDetails);
       $state.go("createquote");
       

    };

    this.newLoan = () => {
	$rootScope.customerDetailsTransfer = _this.customerDetails;
         $state.go("onboardcustomer");
    };
    this.newQuote = () => {
	$rootScope.customerDetailsTransfer = _this.customerDetails;
         $state.go("createquote");
    };

    this.newCustomerLoan = () => {
  $rootScope.customerDetailsTransfer = null;
         $state.go("onboardcustomer");
    };
    this.newCustomerQuote = () => {
  $rootScope.customerDetailsTransfer = null;
         $state.go("createquote");
    };

     this.refund = () => {
          $rootScope.customerDetailsTransfer = null;
         $state.go("refund");
    };
    

   //  this.searchClient = () => {

   //    if(_this.newClient.customerName && _this.newClient.searchBy == "Customer Name/Company Name") {
   //        if(_this.newClient.customerName.includes(" ")) {

   //        } else {
   //          Notification.info("Plase enter first name and last name to search");
   //          return;
   //        }
   //    }

   //    if(($scope.searchClientForm.$valid)) { 
   //          Meteor.call("searchCustomer",_this.newClient.customerName,function(error,results) {
   //              _this.isCustomerDetails = true;
   //              _this.customerDetails = results.data;
   //              $scope.instanceGridOption.data = _this.customerDetails;
   //              $scope.gridApi.grid.refresh();
   //          });
   //      }
   // };

   this.searchClient = () => {
      if(($scope.searchClientForm.$valid)) { 
        _this.customerDetails = [];
            Meteor.call("searchCustomer",_this.newClient,$rootScope.brokerId,function(error,results) {
              if(error){
                console.log("Error in search customer");
                console.log(error);
              }
              else{
              console.log(results.data);
              
              //console.log(results.data);
               // _this.isCustomerDetails = true;
                let gatewayCustomers = results.data["gateway-customers"];
                let iPromptCustomers = results.data["iprompt-customers"];

                //console.log(gatewayCustomers.address1);
                console.log(gatewayCustomers);
                console.log(iPromptCustomers);
                console.log(gatewayCustomers.length);
                this.clientId = [];
                if(gatewayCustomers){
                    for(let i=0;i<gatewayCustomers.length;i++){
                    _this.customerDetails.push(gatewayCustomers[i]);
                      console.log("gateway");
                      if(gatewayCustomers[i].clientId && gatewayCustomers[i].organId) {
                        this.clientId.push(gatewayCustomers[i].clientId + gatewayCustomers[i].organId);
                      }
                    }
                }
   
                if(iPromptCustomers){
                    for(let i=0;i<iPromptCustomers.length;i++){
                    console.log("iprompt");
                     if(this.clientId.indexOf(iPromptCustomers[i].clientId+iPromptCustomers[i].organId) === -1)
                        _this.customerDetails.push(iPromptCustomers[i]);//only if deduplicate
                     }
                }
                if(_this.customerDetails.length == 0){
                  _this.isCustomerDetails = false;
                   if((_this.isCustomerDetails==false && $rootScope.showSearch==false && $rootScope.isNotDirectView==true)){
                    $rootScope.showSearch=true;
                  }
                  else if(_this.isCustomerDetails==false && $rootScope.showSearch==false){
                    $rootScope.showSearch=false;
                  }
                  Notification.error("No results found"); 
                }
                else{
                 _this.isCustomerDetails = true;
                  $rootScope.showSearch=false;
                }
              $scope.instanceGridOption.data = _this.customerDetails;
              $scope.gridApi.grid.refresh();
              }
            });
        }
   };

   $scope.instanceGridOption = {
            showFooter: true,
            enableSorting: true,
            multiSelect: false,
            enableFiltering: true,     
            enableRowSelection: true, 
            enableSelectAll: false,
            enableRowHeaderSelection: false,
            selectionRowHeaderWidth: 35, 
            enableColumnResizing: true,
            rowHeight:50,
            noUnselect: true,
            enableGridMenu: true,
            onRegisterApi: function(gridApi){
             $scope.gridApi = gridApi;
            },
             columnDefs: [
            { field: 'clientId',displayName: 'Cust Ref'},
            { field: 'customerName',displayName: 'Customer Name/Company Name',width: 200 },
            { field: 'addressLine1',displayName: 'Address',width:'30%',
              cellTemplate: '<div class="ngCellText">{{row.entity.address.addressLine1}},{{row.entity.address.addressLine2}}</div><div class="ngCellText">{{row.entity.address.addressLine3}},{{row.entity.address.postcode}}</div>'},
            { field: 'customerEmail',displayName: 'Email' },
            { field: 'customerPhone',displayName: 'Telephone' },
            { field: 'natureOfBusiness.description',displayName: 'Nature Of Business',cellTemplate: '<div class="ngCellText">{{row.entity.natureOfBusiness.description}}</div>' }
              ],
              minRowsToShow:3
              ,
                    appScopeProvider: $scope.myAppScopeProvider,
                    rowTemplate: "<div ng-click=\"grid.appScope.showInfo(row)\" ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>"
    };
 }

}
export default angular.module('searchClient', [
  angularMeteor
  ])
.component('searchClient', {
  templateUrl: 'client/client-entry/search-client/search-client.html',
  controller: ['$scope','$rootScope','$http','$state','$document','$reactive','Notification', SearchClientCtrl]
});

