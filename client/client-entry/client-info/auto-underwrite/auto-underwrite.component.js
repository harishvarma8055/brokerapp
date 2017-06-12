
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './auto-underwrite.html';

class AutoUnderWriteCtrl {
    constructor($scope, $rootScope,$http,$stateParams, $reactive,$state,Notification) {

      Notification.info('Additional Information Needed');

      $reactive(this).attach($scope);

      let _this = this;

      this.instanceFlag = false;
      
      this.loanData = {};

      this.step3Status = "active";
      this.step4Status = "disabled";

      this.logout = function() {
        Meteor.loginFlag = false;
        $state.go('login');
      };

      this.redirectToHome = function() {
        	$state.go('customerinsight');
      };

      this.confirm = () => {

       let docusignPath  = $state.href('api', {}, {absolute: true});
       $rootScope.basicHeader = "Basic c3BpbGxhaUBwcm9saWZpY3MuY29tOnBhc3N3b3JkMTM1";
       let authenticationHeader = $rootScope.basicHeader;
       let jsonBPMString = '{"policyApplication":{"bankDetails":{"accountName":"","sortCode":"","accountNumber":""},"isEsign": "true","isManualUnderwritingReq":"true","isQuote":"false","manualWriterDetails":{"Decision":"","Remark":"","notes": ""},"brokerConfig":{"name":"Perenial Finance","brokerId":"","userId":"","brokerCategory":"","chaseInterval":"10","merchantId":"","isCommercial":"","email":""},"customerDetails":{"email":"","name":"","premiumRate":""},"policyDetails":{"totalPremium":"","cumulativeTotal":"","isHighPremium": "","policies":[{"policyNumber":"","insurer":"","cover":"","premiumAmount":""}]},"source":""}}';
       let inputBPMJson = JSON.parse(jsonBPMString);

       //customer
       inputBPMJson.policyApplication.customerDetails.name =  $rootScope.inputBPMJson.policyApplication.customerDetails.customerName;
       inputBPMJson.policyApplication.customerDetails.email = $rootScope.inputBPMJson.policyApplication.customerDetails.customerEmail;
       inputBPMJson.policyApplication.customerDetails.premiumRate = $rootScope.inputBPMJson.policyApplication.customerDetails.premiumRate;
       inputBPMJson.policyApplication.customerDetails.address = $rootScope.inputBPMJson.policyApplication.customerDetails.address;

       //bank
       inputBPMJson.policyApplication.bankDetails.accountName = $rootScope.inputBPMJson.policyApplication.bankDetails.accountName;
       inputBPMJson.policyApplication.bankDetails.accountNumber  = $rootScope.inputBPMJson.policyApplication.bankDetails.accountNumber;
       inputBPMJson.policyApplication.bankDetails.sortCode  = $rootScope.inputBPMJson.policyApplication.bankDetails.sortCode;

       //policyDetails
       inputBPMJson.policyApplication.policyDetails  = $rootScope.inputBPMJson.policyApplication.policyDetails;
      // problem with date below as string
       inputBPMJson.policyApplication.policyDetails.policies = null; //$rootScope.inputBPMJson.policyApplication.policyDetails.policies;
       inputBPMJson.policyApplication.policyDetails.financeRate = $rootScope.inputBPMJson.financeRate;   

       inputBPMJson.policyApplication.brokerConfig.isCommercial= $rootScope.isCommercial;

         Meteor.call("getExposedProcesses",authenticationHeader , function(error, results) {
                   //console.log(JSON.stringify(results));
                   let firstMatch = false;
                   let counter=0;
                   angular.forEach(JSON.parse(results.content).data.exposedItemsList, function(value, key) {
                        if(value.processAppName == "CloseBrotherPolicy" && !firstMatch) {
                          _this.startURL = value.startURL;
                          firstMatch = true;
                         }
                         if(counter==5) {
                            _this.startURL = value.startURL;
                            console.log(_this.startURL);
                         }
                         counter++;
                     });
           
            Meteor.call("startProcess",authenticationHeader,_this.startURL,JSON.stringify(inputBPMJson),function(error, results) {         
                      let instanceCreated = JSON.parse(results.content).data.name;
                      Notification.info('Quote Saved' + instanceCreated);
                      $state.go("landingpage"); 
                      TransactionDetails.update({"_id":$rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef},{$set:{"loanRef":instanceCreated}});  
                      _this.loanData.instanceId=instanceCreated;
                      _this.instanceFlag = true;

            }); 
      }); 
    
      }

    }
}
export default angular.module('additionalInfo', [
  angularMeteor
])
  .component('additionalInfo', {
    templateUrl: 'client/client-entry/client-info/auto-underwrite/auto-underwrite.html',
    controller: ['$scope', '$rootScope','$http','$stateParams', '$reactive','$state','Notification', AutoUnderWriteCtrl]
});



