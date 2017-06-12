
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './create-payment.html';

import 'angular-component';

class CreatePaymentCtrl {
  constructor($scope,$rootScope,$http,$state,$document,$reactive,$window,$uibModal,Notification,baseEncode) {
  

  
    $rootScope.fromNewQuote = false;

    
    $scope.businessTypes = [];
    $scope.traderTypes = [];  
    $scope.insurerNamesList = [];
    $scope.insurerNamesList = $rootScope.insurerNames;
    $scope.coverTypesList = [];
    $scope.coverTypesList = $rootScope.coverTypes;

    this.newClient = {};
    this.isBankTransfer = true;
    this.isCard = true;

    Meteor.call("getReferenceData",function(error, results) {
                          if(error) {
                          console.log(error);
                          } 
                          else {
                             console.log(results.data);
                              //if(results.data.length>0){
                                //console.log("Inside data");
                                if(results.data.businessTypes.status.code == 200){
                                  //console.log("Inside businessTypes");
                                  for(let i= 0; i< results.data.businessTypes.body.length ; i++ ){
                                   // console.log("Inside businessTypes Loop");
                                  let keyVal = {};
                                 // console.log(results.data.businessTypes.body[i].IBTD_BUSINESS_TYPE_CODE);                            
                                  keyVal.type = results.data.businessTypes.body[i].IBTD_BUSINESS_TYPE_CODE;
                                  keyVal.description = results.data.businessTypes.body[i].IBTD_BUSINESS_TYPE_DESCRIPTION;
                                 // console.log(keyVal); 
                                  $scope.businessTypes.push(keyVal);
                                  //console.log(businessTypes); 
                                  }
                                // console.log($scope.businessTypes); 
                                }
                                if(results.data.traderTypes.status.code == 200){
                                 // console.log("Inside traderTypes");
                                  for(let i= 0; i< results.data.traderTypes.body.length ; i++ ){
                                   // console.log("Inside traderTypes Loop");
                                  let keyVal = {};
                                  //console.log(results.data.traderTypes.body[i].ITTD_TRADER_TYPE_CODE);                            
                                  keyVal.type = results.data.traderTypes.body[i].ITTD_TRADER_TYPE_CODE;
                                  keyVal.description = results.data.traderTypes.body[i].ITTD_TRADER_TYPE_DESCRIPTION;
                                 // console.log(keyVal); 
                                  $scope.traderTypes.push(keyVal);
                                  //console.log(businessTypes); 
                                  }
                                // console.log($scope.traderTypes); 
                                }


                              //}

                          }
            });

     let _this = this;

    $scope.viewModel(this);

    $scope.agencyIds = ['543215', '717162'];
      this.selectAgency = () => {
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
      };
      //this.selectAgency();

    this.createPaymentRequest = () => {
          $rootScope.isPaymentSent = true;
          $state.go('paymentconfirmation');

    }; 

    this.Base64 = baseEncode;

    this.helpers({

    });
    this.navHeader = "Homepage > Create a full payment request for a customer";

    this.navHeader1 = "Customer Details";
    this.navHeader2 = "Payment Details";

    this.isClientDetailsNew = true;

    this.isCustomerDetails = true;

    $rootScope.isNotDirectView = true;

    $rootScope.isPaymentOptions = true;


     if($rootScope.customerDetailsTransfer != null){
        this.isQuoteCalculator = true;
        this.isClientDetailsNew = false;
      } else {
        this.isClientDetailsNew = true;
        this.isQuoteCalculator = false;
      }


    this.logout = function() {
          $rootScope.isNotDirectView = false;
          $rootScope.isSearchReturned = false;
          $rootScope.customerDetails = {};
          Meteor.loginFlag = false;
          $state.go('login');
    };

    this.proceedToPaymentDetails = function() {
       initialiazeJson();
       this.isPaymentDetails = true;
       this.isCustomerDetails = false;

    };

    this.returnToCustomerDetails = () => {
        this.isPaymentDetails = false;
        this.isCustomerDetails = true;
        this.isCustomerDetails = true;
    };
   

    this.saveQuoteForLater = () => {
      _this.saveCustomerDetails();
    };

    this.back = () => {
      this.isPaymentDetails = false;
      this.isCustomerDetails = true;
    };

    this.returnToHomePage = () => {
        $rootScope.customerDetails = {};
       $rootScope.isNotDirectView = false;
       $rootScope.isSearchReturned = false;

    $rootScope.isPaymentOptions = false;
       $state.go("landingpage");
    };

    this.saveCustomerDetails = () => {
          CustomerDetails.insert(_this.quote.newClient, 
            function(err,docsInserted){
                _this.quoteDetails.custRef = docsInserted;
                _this.saveComplianceDetails();
              });
    };

    function initialiazeJson() {
      //alert(JSON.stringify($rootScope.customerDetails));
      if($rootScope.customerDetails) {
        $rootScope.inputBPMJson.policyApplication.customerDetails.customerName = $rootScope.customerDetails.customerName;
         $rootScope.inputBPMJson.policyApplication.customerDetails.customerMobile = $rootScope.customerDetails.customerMobile;
         $rootScope.inputBPMJson.policyApplication.customerDetails.customerEmail = $rootScope.customerDetails.customerEmail;
         $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine1= $rootScope.customerDetails.address.addressLine1;
         $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine2= $rootScope.customerDetails.address.addressLine2;
         $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine3= $rootScope.customerDetails.address.addressLine3;
         $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine4= $rootScope.customerDetails.address.addressLine4;
         $rootScope.inputBPMJson.policyApplication.customerDetails.address.postcode= $rootScope.customerDetails.address.postcode;
         $rootScope.inputBPMJson.policyApplication.customerDetails.address.selectedAddress= _this.newClient.customerAddress;
         $rootScope.inputBPMJson.policyApplication.customerDetails.premiumRate= _this.newClient.premiumRate;        
         $rootScope.inputBPMJson.policyApplication.customerDetails.companyRegNo = $rootScope.customerDetails.companyRegNo;
         $rootScope.inputBPMJson.policyApplication.customerDetails.traderType = $rootScope.selectedTraderType;
         $rootScope.inputBPMJson.policyApplication.customerDetails.natureOfBusiness = $rootScope.selectedBusinessType;
         $rootScope.inputBPMJson.policyApplication.customerDetails.customerPhone = $rootScope.customerDetails.customerPhone;
          if( $rootScope.customerDetails.dateOfBirth) {
                $rootScope.inputBPMJson.policyApplication.customerDetails.dateOfBirth = 
                _this.gateDateInFormat($rootScope.customerDetails.dateOfBirth,"DD/MM/YYYY"); 
          } 
      }

    }
    
   this.createPaymentRequest = () => {
             let jsonBPMString = '{"policyApplication":{"brokerConfig":{"name":"","brokerId":"","userId":"","brokerCategory":"","chaseInterval":"","merchantId":"","isCommercial":"","email":"","mobile":"","chaseNo":""},"customerDetails":{"email":"","mobileNumber":"","name":"","premiumRate":"","address":{"addressLine1":"","addressLine2":"","addressLine3":"","addressLine4":"","postcode":""}},"token":"","transactionType":"","source":"bluemix"}}';

             let inputBPMJson = JSON.parse(jsonBPMString);
             
             inputBPMJson.policyApplication.transactionType = "PayInFull";
             inputBPMJson.policyApplication.isCommercial = true;

             //broker
             inputBPMJson.policyApplication.brokerConfig.name = $rootScope.brokerConfig.brokerName;
             inputBPMJson.policyApplication.brokerConfig.brokerId = $rootScope.brokerId;
             inputBPMJson.policyApplication.brokerConfig.userId = $rootScope.loggedInUser;
             inputBPMJson.policyApplication.brokerConfig.email = $rootScope.brokerConfig.brokerEmail;
             inputBPMJson.policyApplication.brokerConfig.mobile =  $rootScope.brokerConfig.brokerMobile;


             inputBPMJson.policyApplication.brokerConfig.brokerCategory = $rootScope.brokerConfig.brokerCategory;
             inputBPMJson.policyApplication.brokerConfig.chaseInterval =  $rootScope.brokerConfig.eSign.chaseInterval;
             inputBPMJson.policyApplication.brokerConfig.chaseNo =  $rootScope.brokerConfig.eSign.chaseNo;
             inputBPMJson.policyApplication.brokerConfig.merchantId =  $rootScope.brokerConfig.payment.merchantId;
            
             console.log(inputBPMJson.policyApplication.brokerConfig);

             //customer
             inputBPMJson.policyApplication.customerDetails.name =  $rootScope.inputBPMJson.policyApplication.customerDetails.customerName;
             inputBPMJson.policyApplication.customerDetails.email = $rootScope.inputBPMJson.policyApplication.customerDetails.customerEmail;
             inputBPMJson.policyApplication.customerDetails.premiumRate = $rootScope.inputBPMJson.policyApplication.customerDetails.premiumRate;
             inputBPMJson.policyApplication.customerDetails.address.addressLine1 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine1;
             inputBPMJson.policyApplication.customerDetails.address.addressLine2 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine2;
             inputBPMJson.policyApplication.customerDetails.address.addressLine3 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine3;
             inputBPMJson.policyApplication.customerDetails.address.addressLine4 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine4;
             console.log(inputBPMJson.policyApplication.customerDetails);
              
             inputBPMJson.policyApplication.customerDetails.address.postcode =   $rootScope.inputBPMJson.policyApplication.customerDetails.address.postcode;

             inputBPMJson.policyApplication.customerDetails.companyRegNo = $rootScope.inputBPMJson.policyApplication.customerDetails.companyRegNo;

             inputBPMJson.policyApplication.customerDetails.tradeType = $rootScope.inputBPMJson.policyApplication.customerDetails.traderType.description;

             inputBPMJson.policyApplication.customerDetails.natureOfBusiness = 
                   $rootScope.inputBPMJson.policyApplication.customerDetails.natureOfBusiness.description;

             inputBPMJson.policyApplication.customerDetails.phoneNumber = 
             $rootScope.inputBPMJson.policyApplication.customerDetails.customerPhone;

             inputBPMJson.policyApplication.customerDetails.mobileNumber = 
             $rootScope.inputBPMJson.policyApplication.customerDetails.customerMobile;

             inputBPMJson.policyApplication.isCommercial= $rootScope.isCommercial;
             inputBPMJson.policyApplication.paymentAmount = this.quote.newClient.paymentAmount;
             if(this.isBankTransfer) {
               inputBPMJson.policyApplication.paymentVia = "Bank Transfer";
             }
             if(this.isCard) {
               if(inputBPMJson.policyApplication.paymentVia)
                  {
                    inputBPMJson.policyApplication.paymentVia = inputBPMJson.policyApplication.paymentVia + "," + "Credit/debit card";
                  } else {
                    inputBPMJson.policyApplication.paymentVia = "Credit/debit card";
                  }
             }

             $rootScope.inputBPMJson.policyApplication.brokerConfig.brokerId = inputBPMJson.policyApplication.brokerConfig.brokerId;
             $rootScope.inputBPMJson.policyApplication.brokerConfig.userId = inputBPMJson.policyApplication.brokerConfig.userId;
             $rootScope.inputBPMJson.policyApplication.brokerConfig.name = inputBPMJson.policyApplication.brokerConfig.name;
             $rootScope.inputBPMJson.policyApplication.paymentAmount = inputBPMJson.policyApplication.paymentAmount;
             $rootScope.inputBPMJson.policyApplication.paymentVia = inputBPMJson.policyApplication.paymentVia;
           Meteor.call("saveTransactionDetails",$rootScope.inputBPMJson,function(error, results) { 
                      delete inputBPMJson.policyApplication.paymentVia; 
                      delete inputBPMJson.policyApplication.paymentAmount; 
                       if(results) {
                         console.log($rootScope.isCommercial);
                         if($rootScope.isCommercial) {
                                   console.log("Initiating payment transaction for Commercial");
                                   inputBPMJson.policyApplication.token= '/verifydetails?token=' +results;
                         } else {
                                   console.log("Initiating payment transaction for personal");
                                   inputBPMJson.policyApplication.token= '/verifydetails_p?token=' + results;
                         }
                         $rootScope.tokenId = results;
                       }
                        $rootScope.basicHeader = "Basic c3BpbGxhaUBwcm9saWZpY3MuY29tOnBhc3N3b3JkMTM1";
                        let authenticationHeader = $rootScope.basicHeader;
                        let token = results;
                        // inputBPMJson = {"policyApplication":{"bankDetails":{"accountName":"sarath","sortCode":"123-2323-23","accountNumber":"3244"},"isEsign":"true","isManualUnderwritingReq":"false","isQuote":"false","manualWriterDetails":{"Decision":"","Remark":"","notes":""},"brokerConfig":{"name":"Jelf insurance services","brokerId":"Rash","userId":"JLF-1","brokerCategory":"","chaseInterval":"1","merchantId":"","isCommercial":"","email":"spillai@prolifics.com","mobile":"7703186192","chaseNo":"1"},"customerDetails":{"email":"Rashmi.srivastava@prolifics.com","mobileNumber":"7703186192","name":"Ford Consulting Ltd","premiumRate":"3334","address":{"addressLine1":"32443","addressLine2":"32434","addressLine3":"3244","addressLine4":"234234","postcode":"RG16QX`"}},"policyDetails":{"totalPremium":5000,"cumulativeTotal":"","isHighPremium":"false","policies":[{"policyNumber":"Pol1","insurer":"Ace European Group Limited", "cover":"Building Industry","premiumAmount":60,"renewalDate":"2016-08-18"},{"policyNumber":"Pol2","insurer":"Ace European Group Limited","cover":"Building Industry","premiumAmount":40,"renewalDate":"2016-08-09"}]},"source":"bluemix","token":"3t3672gdg","isCommercial":"true","financeRate":{"premiumAmount":"3400","amountPayable":"12333","costOfCredit":"1","brokerArrangementFee":"23","interestRate":"11","aprVariable":"12","durationOfAgreement":"2","numberOfMonthlyInstalments":"3"}}};
                  
                        //alert(JSON.stringify(inputBPMJson));
                         Meteor.call("startProcess",authenticationHeader,JSON.stringify(inputBPMJson),function(error, results) {   
                               if (results) {
                                      let arr = JSON.parse(results.content).data.data.responseText.split(".");
                                      let instanceCreated = arr[1];
                                      Notification.info('Payment Request Ref: ' + instanceCreated);
                                      Meteor.call("updateTransactionDetails",token,instanceCreated,"PayInFull",function(error, results) {  
                                          if(results) {
                                           $rootScope.isPaymentSent = true;
                                           $state.go('paymentconfirmation');
                                         }
                                      });
                               } else {
                                    console.log("Error in creating quote");
                               }

                            });


                          return true; 
                });
     };
  

  }

}
export default angular.module('createPayment', [
  angularMeteor
  ])
.component('createPayment', {
  templateUrl: 'client/client-entry/create-payment/create-payment.html',
  controller: ['$scope','$rootScope','$http','$state','$document','$reactive','$window','$uibModal','Notification','baseEncode', CreatePaymentCtrl]
});

