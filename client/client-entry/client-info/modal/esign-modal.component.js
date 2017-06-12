
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
//import { Tasks } from '../../api/tasks.js';

import template from './esign-modal.html';

import 'angular-component';


class eSignModalControl {
  constructor($scope,$state,$rootScope) {

    if( $rootScope.isEsignLinkSent) {
      this.breadCrumb = "Policy Details > Finance Details > Customer Details > Payment Details > Documentation";
      this.navHeader = "Homepage >  Create a new finance quote for customer";
    } else {
      this.breadCrumb = "Customer Details > Payment Details";
      this.navHeader = "Homepage > Create a full payment request for a customer";
    }

  	   this.logout = function() {
          $rootScope.isNotDirectView = false;
           $rootScope.isSearchReturned = false;
            $rootScope.isEsignLinkSent = false;
             $rootScope.isPaymentSent = false;
             $rootScope.isRefundSent = false;
           $rootScope.customerDetails = {};
          Meteor.loginFlag = false;
          $state.go('login');
        };

       this.returnToHomePage = function() {
         $rootScope.isNotDirectView = false;
         $rootScope.isSearchReturned = false;
          $rootScope.isEsignLinkSent = false;
           $rootScope.isPaymentSent = false;
           $rootScope.isRefundSent = false;
         $rootScope.customerDetails = {};
         $state.go("landingpage");
      };

    }


}
export default angular.module('esignModal', [
  angularMeteor
])
  .component('esignModal', {
    templateUrl: 'client/client-entry/client-info/modal/esign-modal.html',
    controller: ['$scope','$state','$rootScope', eSignModalControl]
  });