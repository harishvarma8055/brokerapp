
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import template from './precontract-info.html';

import 'angular-component';

class preContractInfoCtrl {
  constructor($scope,$rootScope,$http,$stateParams,$document,$state,$window,$reactive) {
            $reactive(this).attach($scope);

             let _this = this;
               $rootScope.isLoggedIn = true;
               this.transactionData = {};
               this.transactionData.loanReference = "8002909558-03";
               this.transactionData.brokerName = "Jelf Insurance Services";

               this.transactionData.policyDetails = [{"startDate":"09/06/2016","policyNumber":"CB-2345-42221","insurer":"Best Insurer ever","coverType":"Full - comprehensive","premium":"15000"},
               {"startDate":"09/06/2016","policyNumber":"CB-2345-11345","insurer":"Best Insurer ever","coverType":"Full - comprehensive","premium":"24000"},
               {"startDate":"09/06/2016","policyNumber":"CB-2345-98001","insurer":"Best Insurer ever","coverType":"Full - comprehensive","premium":"8000"}];

               this.totalPremium = "£47,000.00";
               this.lessDeposit = "£0.00";
               this.interestCharged = "£1,034.00";
               this.facilityFee = "£0.00";
               this.totalAmountPayable = "£48,034.00";

               this.additionalRate = "2.20%";
               this.representativeAPR = "26.520%";
               this.monthlyRepaymentAmount = "£4,803.40";
               this.paymentTerm = "10";

               this.state = $state.current.name; 
  

         
          this.continue = () => {
                  $state.go("directdebit");
              }

          this.back = () => {
                  $state.go("consentdigital");
          }     
    }
}
export default angular.module('precontractInfo', [
  angularMeteor
])
  .component('precontractInfo', {
    templateUrl: 'client/client-entry/client-info/precontract-info/precontract-info.html',
    controller: ['$scope','$rootScope','$http','$stateParams','$document','$state','$window','$reactive',
    preContractInfoCtrl]
  });



