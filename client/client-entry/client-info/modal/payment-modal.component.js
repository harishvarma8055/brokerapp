
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
//import { Tasks } from '../../api/tasks.js';

import template from './payment-modal.html';

import 'angular-component';


class paymentModalControl {
  constructor($scope,$state,$rootScope,Notification) {


      this.navHeader = "Homepage > Search for an existing customer";

      this.amountFormatfilter = function($event){
      let keyCode = $event.keyCode|| $event.charCode;
        console.log(keyCode);
      //console.log(String.fromCharCode(keyCode));
        if(isNaN(String.fromCharCode(keyCode)) && keyCode != 8 && keyCode != 46 && keyCode != 37 && keyCode != 39 ){
                    $event.preventDefault();
                }
        };
     
     
     this.amountFormat = function(){
           let n = this.refundAmount.replace(/[^\d.-]/g, '');
          n = parseFloat(n);
          console.log(n);
          let results = n.toFixed(2).replace(/./g, function(c, i, a) {
          return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
          });
          this.refundAmount = results;
       };


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

      this.refund = function() {
         if(this.refundAmount.replace(",","") > 1458.36) {
            Notification.info("Please enter a lesser refund amount than your payment")
         } else {
             $rootScope.isRefundSent = true;
            $state.go("refundconfirmation");
         }
      }

    }


}
export default angular.module('paymentModal', [
  angularMeteor
])
  .component('paymentModal', {
    templateUrl: 'client/client-entry/client-info/modal/payment-modal.html',
    controller: ['$scope','$state','$rootScope','Notification', paymentModalControl]
  });