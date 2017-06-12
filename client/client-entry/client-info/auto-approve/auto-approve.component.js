
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './auto-approve.html';

class AutoApproveCtrl {
    constructor($scope,$rootScope,$http, $state,$stateParams,$reactive,Notification) {
           $reactive(this).attach($scope);
           this.logout = function() {
         		 Meteor.loginFlag = false;
          	$state.go('login');
        	 };

        	 this.redirectToHome = function() {
          	$state.go('landingpage');
       	 };
            this.loanData = {};
  	        this.instanceFlag = false;

            this.loanData.brokerName=$rootScope.loggedInUser;

 
             let _this = this;
             $rootScope.basicHeader = "Basic c3BpbGxhaUBwcm9saWZpY3MuY29tOnBhc3N3b3JkMTM1";
             let authenticationHeader = $rootScope.basicHeader;
           //let jsonBPMString = '{"policyApplication":{"bankDetails":{"accountName":"","sortCode":"","accountNumber":""},"isEsign": "true","isManualUnderwritingReq":"false","isQuote":"false","manualWriterDetails":{"Decision":"","Remark":"","notes": ""},"brokerConfig":{"name":"Perenial Finance","brokerId":"","userId":"","brokerCategory":"","chaseInterval":"10","merchantId":"","isCommercial":"","email":""},"customerDetails":{"email":"","name":"","premiumRate":""},"policyDetails":{"totalPremium":"","cumulativeTotal":"","isHighPremium": "","policies":[{"policyNumber":"","insurer":"","cover":"","premiumAmount":""}]},"source":""}}';
             let jsonBPMString = '{"policyApplication":{"bankDetails":{"accountName":"","sortCode":"","accountNumber":""},"isEsign": "true","isManualUnderwritingReq":"false","isQuote":"false","manualWriterDetails":{"Decision":"","Remark":"","notes": ""},"brokerConfig":{"name":"Perenial Finance","brokerId":"","userId":"","brokerCategory":"","chaseInterval":"10","merchantId":"","isCommercial":"","email":"rahul.agarwala@prolifics.com","mobile":"7799801142"},"customerDetails":{"email":"","mobileNumber":"","name":"","premiumRate":"","address":{"addressLine1":"","addressLine2":"","addressLine3":"","addressLine4":"","postcode":""}},"policyDetails":{"totalPremium":"","cumulativeTotal":"","isHighPremium": "","policies":[{"policyNumber":"","insurer":"","cover":"","premiumAmount":""}]},"source":"","token":"3t3672gdg","isCommercial":"true","financeRate":{"premiumAmount":"","amountPayable":"","costOfCredit":"1","brokerArrangementFee":"23","interestRate":"","aprVariable":"","durationOfAgreement":"2","numberOfMonthlyInstalments":""}}}';
             //let jsonBPMString1 = '{"policyApplication":{"bankDetails":{"accountName":"sarath","sortCode":"123-2323-23","accountNumber":"3244"},"isEsign":"true","isManualUnderwritingReq":"false","isQuote":"false","manualWriterDetails":{"Decision":"","Remark":"","notes":""},"brokerConfig":{"name":"Perenial Finance","brokerId":"","userId":"","brokerCategory":"","chaseInterval":"10","merchantId":"","isCommercial":"","email":"rahul.agarwala@prolifics.com","mobile":"7703186192"},"customerDetails":{"email":"rahul.agarwala@prolifics.com","mobileNumber":"7703186192","name":"Rashmi Srivastava","premiumRate":"3334","address":{"addressLine1":"32443","addressLine2":"32434","addressLine3":"3244","addressLine4":"234234","postcode":"RG16QX`"}},"policyDetails":{"totalPremium":null,"cumulativeTotal":"","isHighPremium":"false","policies":null},"source":"","token":"3t3672gdg","financeRate":{"premiumAmount":"3400","amountPayable":"12333","costOfCredit":"1","brokerArrangementFee":"23","interestRate":"11","aprVariable":"12","durationOfAgreement":"2","numberOfMonthlyInstalments":"3"}}}';
             let inputBPMJson = JSON.parse(jsonBPMString);
            // let inputBPMJson1 = JSON.parse(jsonBPMString1);

             //customer
             inputBPMJson.policyApplication.customerDetails.name =  $rootScope.inputBPMJson.policyApplication.customerDetails.customerName;
             
             inputBPMJson.policyApplication.customerDetails.email = $rootScope.inputBPMJson.policyApplication.customerDetails.customerEmail;
              inputBPMJson.policyApplication.customerDetails.email = "";
             inputBPMJson.policyApplication.customerDetails.premiumRate = $rootScope.inputBPMJson.policyApplication.customerDetails.premiumRate;
             inputBPMJson.policyApplication.customerDetails.address.addressLine1 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine1;
             inputBPMJson.policyApplication.customerDetails.address.addressLine2 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine2;
             inputBPMJson.policyApplication.customerDetails.address.addressLine3 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine3;
             inputBPMJson.policyApplication.customerDetails.address.addressLine4 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine4;
             console.log(inputBPMJson.policyApplication.customerDetails);

             //bank
             inputBPMJson.policyApplication.bankDetails.accountName = $rootScope.inputBPMJson.policyApplication.bankDetails.accountName;
             inputBPMJson.policyApplication.bankDetails.accountNumber  = $rootScope.inputBPMJson.policyApplication.bankDetails.accountNumber;
             inputBPMJson.policyApplication.bankDetails.sortCode  = $rootScope.inputBPMJson.policyApplication.bankDetails.sortCode;

             console.log(inputBPMJson.policyApplication.bankDetails);

             //policyDetails
             inputBPMJson.policyApplication.policyDetails  = $rootScope.inputBPMJson.policyApplication.policyDetails;
             // problem with date below as string
             let policyDetailsJson = angular.toJson($rootScope.inputBPMJson.policyApplication.policyDetails);
            let policyDetailsJsonObj = JSON.parse(policyDetailsJson);
             inputBPMJson.policyApplication.policyDetails.policies = policyDetailsJsonObj;
             console.log(inputBPMJson.policyApplication.policyDetails);

             inputBPMJson.policyApplication.financeRate.premiumAmount = ""+ $rootScope.inputBPMJson.policyApplication.financeRate.premiumAmount;
             inputBPMJson.policyApplication.financeRate.amountPayable = $rootScope.inputBPMJson.policyApplication.financeRate.amountPayable;
             inputBPMJson.policyApplication.financeRate.interestRate = $rootScope.inputBPMJson.policyApplication.financeRate.interestRate;
             inputBPMJson.policyApplication.financeRate.aprVariable = $rootScope.inputBPMJson.policyApplication.financeRate.aprVariable;
             inputBPMJson.policyApplication.financeRate.durationOfAgreement = $rootScope.inputBPMJson.policyApplication.financeRate.durationOfAgreement;
             inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments = $rootScope.inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments;
  
             console.log(inputBPMJson.policyApplication.financeRate);

             inputBPMJson.policyApplication.isCommercial= $rootScope.isCommercial;

              $rootScope.inputBPMJson.policyApplication.policyDetails.policies = [];

             if($rootScope.isCommercial == "true") {
                 inputBPMJson.policyApplication.token= '/verifydetails?token=' + $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef;
             } else {
                 inputBPMJson.policyApplication.token= '/verifydetails_p?token=' + $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef;
             }

            // alert(JSON.stringify(inputBPMJson.policyApplication));


              /* Meteor.call("getExposedProcesses",authenticationHeader , function(error, results) {
                         //console.log(JSON.stringify(results));
                         let firstMatch = false;
                         let counter=0;
                         angular.forEach(JSON.parse(results.content).data.exposedItemsList, function(value, key) {
                              if(value.processAppName == "CloseBrotherPolicy" && !firstMatch) {
                                _this.startURL = value.startURL;
                                console.log(_this.startURL);
                                firstMatch = true;
                               }
                               if(counter==5) {
                                  _this.startURL = value.startURL;
                                  console.log("End"+_this.startURL);
                               }
                               counter++;
                           });
                 console.log("Out of Loop");
                  Meteor.call("startProcess",authenticationHeader,_this.startURL,JSON.stringify(inputBPMJson),function(error, results) { 
                    console.log("startProcess");
                    console.log("Selected URL "+_this.startURL);
                  console.log(inputBPMJson);    
                            let instanceCreated = JSON.parse(results.content).data.name;
                            Notification.info('Loan Initiated : ' + instanceCreated);
                            $state.go("landingpage"); 
                            TransactionDetails.update({"_id":$rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef},{$set:{"loanRef":instanceCreated}});  
                            _this.loanData.instanceId=instanceCreated;
                            _this.instanceFlag = true;

                  }); 
            });  
            */  
              //console.log(Meteor.settings.startBPMProcessURL);
               Meteor.call("startProcess",authenticationHeader,JSON.stringify(inputBPMJson),function(error, results) { 
                    console.log("startProcess");
                  //  console.log(Meteor.settings.startBPMProcessURL);
                    //console.log("Selected URL "+_this.startURL);
                   if (results != 1) {
                            let arr = JSON.parse(results.content).data.data.responseText.split(".");
                            let instanceCreated = arr[1];
                            Notification.info('Finance Agreement Reference : ' + instanceCreated);
                            //$state.go("landingpage"); 
                            TransactionDetails.update({"_id":$rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef},{$set:{"transactionRef":instanceCreated}});  
                            _this.loanData.instanceId=instanceCreated;
                            _this.instanceFlag = true;
                    } else {

                            let instanceCreated = "CBPF - " + Math.floor(Math.random() * 1000000) + 1 ;
                            Notification.info('Finance Agreement Reference : ' + instanceCreated);
                            //$state.go("landingpage"); 
                            TransactionDetails.update({"_id":$rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef},{$set:{"transactionRef":instanceCreated}});  
                            _this.loanData.instanceId=instanceCreated;
                            _this.instanceFlag = true;
                    }

                  }); 

          
    }

}
export default angular.module('autoApprove', [
    angularMeteor
    ])
  .component('autoApprove', {
    templateUrl: 'client/client-entry/client-info/auto-approve/auto-approve.html',
    controller: ['$scope','$rootScope','$http','$state','$stateParams','$reactive','Notification', AutoApproveCtrl]
  });


