
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './landing-page.html';

import 'angular-component';

class LandingPageCtrl {
  constructor($scope,$rootScope,$http,$state,$document,$reactive,$uibModal,$window) {

    $scope.viewModel(this);
    $rootScope.fromNewQuote = false;
     $rootScope.isPolicyDetails=true;
     $rootScope.isBankDetails=false;
    $rootScope.clientDetailsFromQuote = null;
    $rootScope.customerDetailsTransfer = null;
    this.isSearchNew = false;
    this.isQuoteNew = false;
      $rootScope.showSearch=false;
       $rootScope.backBtn =true;
    //$rootScope.inputBPMJson.policyApplication = null;
    this.helpers({

    });

    this.redirectToMI = function(){
             $window.open('http://closebrothersmi.mybluemix.net/#/home', '_blank');
    };

    this.premiumCalculatorPage =  function() {
      $state.go("premiumcalculator");
    };
    this.createQuoteForCustomer =  function() {
       $rootScope.showSearch=true;
      $state.go("createquote");
    };
    this.searchCustomer =  function() {
      $state.go("searchcustomer");
    };
    this.createCustomer =  function() {
      $state.go("createcustomer");
    };
    this.createPayment =  function() {
      $rootScope.showSearch=true;
      $state.go("createpayment");
    };
    
    

    this.logout = function() {
      Meteor.loginFlag = false;
      $state.go('login');
    };
     var _this = this;
    
     this.counter = 0;
     $scope.agencyIds = ['543215', '717162'];
      this.selectAgency = () => {
           this.counter ++;
          _this.isQuoteNew = !_this.isQuoteNew;
          if(this.isQuoteNew && this.counter==1) {
              var modalScope = $scope.$new();

                             function modalController($scope,$rootScope,agencyIds) {
                                $scope.agencyIds = agencyIds;
                                $scope.selected = {
                                  agencyId: $scope.agencyIds[0]
                                };

                                $scope.$on('$destroy', function() {
                                  console.log('Modal scope should be destroyed.');
                                });
                             }
               modalController.$inject = ["$scope","$rootScope","agencyIds"];              

               var modalInstance = $uibModal.open({
                  animation: 'false',
                  templateUrl: 'client/client-entry/client-info/modal/agency-selection.html',
                  controller:modalController,
                  size: 'md',
                  resolve: {
                    agencyIds: function () {
                      return $scope.agencyIds;
                    }
                  }
                });

                modalScope.closeDialog = function(selectedAgency) {
                    if (selectedAgency) {
                      modalInstance.close(selectedAgency);
                    } else {
                      modalInstance.dismiss('cancel')
                    }
                    $scope.selected = selectedAgency;
                    modalScope.$destroy();
                  }

                modalInstance.result.then(function(selectedAgency) {
                  $scope.selected = selectedAgency;
                  if($scope.selected == '543215') {
                      $rootScope.isCommercial = true;
                      $rootScope.userType = "CL - 543215";
                   }
                   if($scope.selected == '717162') {
                      $rootScope.isCommercial = false;
                      $rootScope.userType = "PL - 717162";
                   }
                     //alert($rootScope.isCommercial);
                }, function() {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
              }
      };
      
      //alert("test" +  JSON.stringify($rootScope.brokerConfig));
    //Initialiaze only one time in landing page
    if(!$rootScope.brokerConfig) {
      Meteor.call("getBrokerConfig",$rootScope.brokerId, function(error, results) {
                if(error) { 
                     console.log(error);
               } 
                else {

                        let brokerRecord = results;
                        console.log(brokerRecord);
                        //let actualbrokerType  = brokerRecord.brokerCategory;
                        $rootScope.brokerConfig = brokerRecord;
                        //alert("test" +  JSON.stringify($rootScope.brokerConfig));
                        //$rootScope.actualbrokerType = actualbrokerType;
                        if(brokerRecord.brokerContactDetails) {
                          $rootScope.brokerPhone = brokerRecord.brokerContactDetails.phoneNumber;
                        }
                        //$rootScope.inputJson.policyApplication.brokerDetails.name = brokerRecord.brokerName;
                        // $rootScope.globalBrokerType = actualbrokerType.charAt(0).toUpperCase() + actualbrokerType.slice(1);
                        //  alert( $rootScope.brokerPhone);
                        //  alert( $rootScope.brokerConfig);
                        // alert( $rootScope.globalBrokerType);
                        $scope.$apply();           
                }
              });
    }
            

 /*  Meteor.call("getBrokerSettings",$rootScope.loggedInUser,function(error,results) {
          // console.log($rootScope.loggedInUser);
          // let brokerRecords = BrokerSettings.find({"username":$rootScope.loggedInUser});
             // console.log(results);
              let brokerRecord = results;
              console.log(brokerRecord);
              let actualbrokerType  = brokerRecord.type;
              $rootScope.actualbrokerType = actualbrokerType;
              $rootScope.inputJson.policyApplication.brokerDetails.name = brokerRecord.addressline1;
              $rootScope.globalBrokerType = actualbrokerType.charAt(0).toUpperCase() + actualbrokerType.slice(1);
              console.log($rootScope.globalBrokerType);
              $scope.$apply();
            
    }); */
    this.navHeader = "Homepage";

    this.searchCustomer = () => {
      $state.go("searchcustomer");
    };

    this.createQuote = () => {
      $state.go("createquote");
    };

    this.changeState = function(state) {
     
        if(state == "newloan") {
          $rootScope.customerDetailsTransfer = null;
          $state.go('onboardcustomer');
        } 
        if(state == "newquote") {
          $rootScope.customerDetailsTransfer = null;
          $state.go('createquote');
        }
        if(state == "uploadwetsign") {
          $state.go('documentupload');
        }
      };
    }

}
export default angular.module('landingPage', [
  angularMeteor
  ])
.component('landingPage', {
  templateUrl: 'client/client-entry/landing-page/landing-page.html',
  controller: ['$scope','$rootScope','$http','$state','$document','$reactive','$uibModal','$window',LandingPageCtrl]
});

