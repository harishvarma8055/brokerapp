
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './create-customer.html';

import 'angular-component';

class CreateCustomerCtrl {
  constructor($scope,$rootScope,$http,$state,$document,$reactive,$window,$uibModal,$timeout,Notification,baseEncode) {

    var today = new Date();
        $scope.dateFormat = 'dd/MM/yyyy';
        $scope.availableDateOptions = {
            formatYear: 'yy',
            startingDay: 1,
            //minDate: today,
            maxDate: today
        };
      
        $scope.availableDatePopup = {
            opened: false
        };
        $scope.OpenAvailableDate = function() {
            $scope.availableDatePopup.opened = !$scope.availableDatePopup.opened;
        };

  
    $rootScope.fromNewQuote = false;
     let _this = this;

     this.quoteDetails = {}; //for holding the actual collection
     this.quote = {};

     this.quote.compliance = {};
     _this.finance = {};
     this.quote.newClient={};
     console.log($rootScope.customerDetailsTransfer);
      if($rootScope.customerDetailsTransfer != null){
        console.log("Populating Customer in Quote");
        console.log($rootScope.customerDetailsTransfer);
        let customerObj = $rootScope.customerDetailsTransfer[0];
          $scope.customerName = customerObj.primaryContact;
          $scope.customerName = customerObj.primaryContact;
          $scope.postCode = customerObj.postcode;
          $scope.addressLine1 = customerObj.addressLine1;
          $scope.addressLine2 = customerObj.addressLine2;
          $scope.addressLine3 = customerObj.addressLine3;
          $scope.addressLine4 = customerObj.addressLine4;
          $scope.emailId = customerObj.eMail;
          $scope.traderType = customerObj.tradeType;
          $scope.dateOfBirth = customerObj.dateOfBirth;
          $scope.telephone = customerObj.telephone;
          $scope.natureOfBusiness = customerObj.natureOfBusiness;        


           _this.quote.newClient.customerName = customerObj.primaryContact;
           _this.quote.newClient.postCode = customerObj.postcode;;
           _this.quote.newClient.address1 = customerObj.addressLine1;
           _this.quote.newClient.address2 = customerObj.addressLine2;
           _this.quote.newClient.address3 = customerObj.addressLine3;
           _this.quote.newClient.address4 = customerObj.addressLine4;
           _this.quote.newClient.customerEmail = customerObj.eMail;
           _this.quote.newClient.customerType = customerObj.tradeType;
           _this.quote.newClient.dateOfBirth = customerObj.dateOfBirth;
            _this.quote.newClient.customerHomeTel = customerObj.telephone;
           _this.quote.newClient.natureOfBusiness = customerObj.natureOfBusiness;

      } else {
           this.newCustomer = "New";
      }

      function checkPostCode (toCheck) {
                // Permitted letters depend upon their position in the postcode.
                var alpha1 = "[abcdefghijklmnoprstuwyz]";                       // Character 1
                var alpha2 = "[abcdefghklmnopqrstuvwxy]";                       // Character 2
                var alpha3 = "[abcdefghjkpmnrstuvwxy]";                         // Character 3
                var alpha4 = "[abehmnprvwxy]";                                  // Character 4
                var alpha5 = "[abdefghjlnpqrstuwxyz]";                          // Character 5
                var BFPOa5 = "[abdefghjlnpqrst]";                               // BFPO alpha5
                var BFPOa6 = "[abdefghjlnpqrstuwzyz]";                          // BFPO alpha6
                
                // Array holds the regular expressions for the valid postcodes
                var pcexp = new Array ();
                
                // BFPO postcodes
                pcexp.push (new RegExp ("^(bf1)(\\s*)([0-6]{1}" + BFPOa5 + "{1}" + BFPOa6 + "{1})$","i"));

                // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
                pcexp.push (new RegExp ("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
                
                // Expression for postcodes: ANA NAA
                pcexp.push (new RegExp ("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));

                // Expression for postcodes: AANA  NAA
                pcexp.push (new RegExp ("^(" + alpha1 + "{1}" + alpha2 + "{1}" + "?[0-9]{1}" + alpha4 +"{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
                
                // Exception for the special postcode GIR 0AA
                pcexp.push (/^(GIR)(\s*)(0AA)$/i);
                
                // Standard BFPO numbers
                pcexp.push (/^(bfpo)(\s*)([0-9]{1,4})$/i);
                
                // c/o BFPO numbers
                pcexp.push (/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);
                
                // Overseas Territories
                pcexp.push (/^([A-Z]{4})(\s*)(1ZZ)$/i);  
                
                // Anguilla
                pcexp.push (/^(ai-2640)$/i);

                // Load up the string to check
                var postCode = toCheck;

                // Assume we're not going to find a valid postcode
                var valid = false;
                
                // Check the string against the types of post codes
                for ( var i=0; i<pcexp.length; i++) {
                
                  if (pcexp[i].test(postCode)) {
                  
                    // The post code is valid - split the post code into component parts
                    pcexp[i].exec(postCode);
                    
                    // Copy it back into the original string, converting it to uppercase and inserting a space 
                    // between the inward and outward codes
                    postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
                    
                    // If it is a BFPO c/o type postcode, tidy up the "c/o" part
                    postCode = postCode.replace (/C\/O\s*/,"c/o ");
                    
                    // If it is the Anguilla overseas territory postcode, we need to treat it specially
                    if (toCheck.toUpperCase() == 'AI-2640') {postCode = 'AI-2640'};
                    
                    // Load new postcode back into the form element
                    valid = true;
                    
                    // Remember that we have found that the code is valid and break from loop
                    break;
                  }
                }
                
                // Return with either the reformatted valid postcode or the original invalid postcode
                if (valid) {return postCode;} else return false;
              }

    $scope.viewModel(this);
   
  
    this.changeState = function(state) {
        if(state == "newloan") {
          $state.go('onboardcustomer');
        } 
        if(state == "newquote") {
          $state.go('createquote');
        }
      };

    this.Base64 = baseEncode;

     $scope.businessTypes = [];
    $scope.traderTypes = []; 
     $scope.traderTypeOptions = []; 
    $scope.businessTypeOptions=[];
    $scope.insurerNamesList = [];
    $scope.insurerNamesList = $rootScope.insurerNames;
    $scope.coverTypesList = [];
    $scope.coverTypesList = $rootScope.coverTypes;




    Meteor.call("getReferenceData",function(error, results) {
                          if(error) {
                          console.log(error);
                          } 
                          else {
                             console.log(results.data);
                              //if(results.data.length>0){
                                //console.log("Inside data");
                                var businessTypeOptions=[];
                                if(results.data.businessTypes.status.code == 200){
                                  //console.log("Inside businessTypes");
                                  for(let i= 0; i< results.data.businessTypes.body.length ; i++ ){
                                   // console.log("Inside businessTypes Loop");
                                  let keyVal = {};
                                 // console.log(results.data.businessTypes.body[i].IBTD_BUSINESS_TYPE_CODE);                            
                                  keyVal.type = results.data.businessTypes.body[i].IBTD_BUSINESS_TYPE_CODE;
                                  keyVal.description = results.data.businessTypes.body[i].IBTD_BUSINESS_TYPE_DESCRIPTION;
                                 // console.log(keyVal); 
                                  businessTypeOptions.push(keyVal);
                                  //console.log(businessTypes); 
                                  }
                              //   console.log($scope.businessTypes); 
                                }
                                 $rootScope.selectedBusinessType=businessTypeOptions[1];
                                $scope.businessTypeOptions=businessTypeOptions;
                                $scope.$apply();

                                var traderTypeOptions = [];
                                if(results.data.traderTypes.status.code == 200){
                                 // console.log("Inside traderTypes");
                                  for(let i= 0; i< results.data.traderTypes.body.length ; i++ ){
                                   // console.log("Inside traderTypes Loop");
                                  let keyVal = {};
                                  //console.log(results.data.traderTypes.body[i].ITTD_TRADER_TYPE_CODE);                            
                                  keyVal.type = results.data.traderTypes.body[i].ITTD_TRADER_TYPE_CODE;
                                  keyVal.description = results.data.traderTypes.body[i].ITTD_TRADER_TYPE_DESCRIPTION;
                                 // console.log(keyVal); 
                                  traderTypeOptions.push(keyVal);
                                  //console.log(businessTypes); 
                                  }
                               //  console.log($scope.traderTypes); 
                                }
                               $rootScope.selectedTraderType = traderTypeOptions[1];
                
                                $scope.traderTypeOptions = traderTypeOptions;
                                $scope.$apply();

                                if($rootScope.customerDetails != null && $rootScope.customerDetails.natureOfBusiness != null && $rootScope.customerDetails.traderType != null){
                            
                                    for(let i=0; i < $scope.businessTypeOptions.length ; i++ ){
                                      if($scope.businessTypeOptions[i].description == $rootScope.customerDetails.natureOfBusiness.description){
                                       // console.log("------I am here matched -----");
                                        $rootScope.customerDetails.natureOfBusiness.type = $scope.businessTypeOptions[i].type;
                                         $rootScope.selectedBusinessType=$rootScope.customerDetails.natureOfBusiness;
                                       // console.log($rootScope.customerDetails.natureOfBusiness);
                                      }
                                    }
                                    for(let i=0; i < $scope.traderTypeOptions.length ; i++ ){
                                     // console.log("------I am here in matched-----"); 
                                      if($scope.traderTypeOptions[i].description == $rootScope.customerDetails.traderType.description){
                                        $rootScope.customerDetails.traderType.type = $scope.traderTypeOptions[i].type;
                                       // console.log($rootScope.customerDetails.traderType);
                                        $rootScope.selectedTraderType = $rootScope.customerDetails.traderType;
                                      }
                                       
                                    } 
                                  //  console.log("------I am here in -----");   
                                    $scope.$apply();  

                                    }  


                              //}

                          }
            });

    this.helpers({

    });
    this.navHeader = "Homepage > Create new customer";
    this.isClientDetailsNew = true;


    this.createCustomer = () => {
      this.isCreatedCustomerDetails = true;
    };
    this.editCustomer = () => {
         this.isClientDetailsNew = true;
         this.isCreatedCustomerDetails = false;
    };
    this.createQuote = () => {
       $rootScope.backBtn=false;
      $rootScope.isSearchReturned = true;
      $state.go("createquote");
    };
    this.createPayment = () => {
      $rootScope.isSearchReturned = true;
      $state.go("createpayment");
    };


    this.logout = function() {
      Meteor.loginFlag = false;
      $rootScope.customerDetails = {};
      $state.go('login');
    };

    this.saveQuoteForLater = () => {
      _this.saveCustomerDetails();
    };

    this.createCustomerRecord = () => {
          $rootScope.customerDetails.brokerId = $rootScope.brokerId;
          $rootScope.customerDetails.createdBy = $rootScope.loggedInUser;
          Meteor.call("saveCustomerDetails", $rootScope.customerDetails,function(err,results) {
              if(err) {
                Notification.info("Customer details not saved due to an error");
              } else {
                Notification.info("Customer details saved with custRef : " + results);
              }   
          });      
    };

    this.saveComplianceDetails = () => {
      _this.quoteDetails.isRaccaShown = _this.quote.compliance.racaShownYes;
      _this.quoteDetails.isSecciShown = _this.quote.compliance.secciShownYes;
      _this.quoteDetails.isCreditAgreementExplained = _this.quote.compliance.creditExplainedYes;
      _this.saveFinanceDetails();  
    };
    this.saveQuoteDetails = () => {
      //_this.quoteDetails.qouteRef = "";
      QuoteDetails.insert(_this.quoteDetails, function(err,docsInserted){
          _this.quote.quoteRef = docsInserted; 
          console.log("Triggered:"+ docsInserted);   
           _this.initiateBPMProcess(_this.quote.quoteRef);
          
          });   
    };


    
    this.saveFinanceDetails = () => {
      FinanceDetails.insert(_this.finance, function(err,docsInserted){
             _this.quoteDetails.financeRef = docsInserted
             _this.saveQuoteDetails();
          });
     
    };

    this.returnToHomePage = () => {
       $rootScope.customerDetails = {};
       $state.go("landingpage");
    };

    this.cancelQuote = () => {
       Notification.warning("Quote Cancelled before saving");
       $state.go("searchcustomer");
    };

    this.proceedToLoan = () => {
       $rootScope.fromNewQuote = true;
       $rootScope.finance = _this.finance;
       $rootScope.clientDetailsFromQuote = _this.quote.newClient;
       $state.go("onboardcustomer");
    };

    this.reset = () => {
      $rootScope.customerDetails  = {};
      $rootScope.quote.newClient.customerAddress = "";
    };
    this.initiateLoan = () => {
      $state.go("onboardcustomer");
    };
        this.populateAddressFields = () => {
             console.log("In");
              console.log($rootScope.quote.newClient.customerAddress);
              var selectedAddress = $rootScope.quote.newClient.customerAddress;
              var arrayAddress = [];
              
              arrayAddress = selectedAddress.split(",");
              console.log(arrayAddress);

              //$scope.addressLine1 = ((arrayAddress[0] != " ") ? (arrayAddress[0] + "," ) : ("")) + arrayAddress[1];
              $rootScope.customerDetails.address.addressLine1 = (((arrayAddress[0]) ? (arrayAddress[0] + "," ) : ("")) + 
                                                        ((arrayAddress[1]) ? (arrayAddress[1]) : (""))).replace(/^,|,$/g,'');
              //$scope.addressLine2 = ((arrayAddress[2] != " ") ? (arrayAddress[2] + "," ) : ("")) + arrayAddress[3];
              $rootScope.customerDetails.address.addressLine2 = (((arrayAddress[2]) ? (arrayAddress[2] + "," ) : ("")) 
                                                       +((arrayAddress[3]) ? (arrayAddress[3]) : (""))).replace(/^,|,$/g,'');
              //$scope.addressLine3 =((arrayAddress[4] != " ") ? (arrayAddress[4] + "," ) : ("")) + arrayAddress[5];
              $rootScope.customerDetails.address.addressLine3 = (((arrayAddress[4]) ? (arrayAddress[4]) : (""))).replace(/^,|,$/g,'');
              //$scope.addressLine4 = arrayAddress[6];
              $rootScope.customerDetails.address.addressLine4 = (((arrayAddress[5]) ? (arrayAddress[5] + "," ) : ("")) +
                                                        ((arrayAddress[6]) ? (arrayAddress[6]) : (""))).replace(/^,|,$/g,'');
              //$scope.$apply();
            }


            function pad(s) { return (s < 10) ? '0' + s : s; }
           
            this.findAddress = () => {

            let postCodeInput = $rootScope.customerDetails.address.postcode;
                let postCodeResponse = checkPostCode(postCodeInput);
              if(checkPostCode(postCodeInput)) { 
                $rootScope.customerDetails.address.postcode =  postCodeResponse;
                Meteor.call("getAddresses",postCodeInput, function(error, results) {
                     if(error) { 
                       console.log(error);
                       Notification.error("Error while retrieving Post code");
                       $scope.addresses =[];
                       $rootScope.customerDetails.address.addressLine1 = "";
                       $rootScope.customerDetails.address.addressLine2 = "";
                       $rootScope.customerDetails.address.addressLine3 = "";
                       $rootScope.customerDetails.address.addressLine4 = "";
                       $scope.$apply();
                      } else {
                        let formattedAddress = [];
                        for(let m=0; m < results.data.Addresses.length;m++) {
                               let address = results.data.Addresses[m];
                               let res = address.replace(/^[,\s]+|[,\s]+$/g, '').replace(/,[,\s]*,/g, ',').trim();
                               let finalFormattedAddress = res.replace(" ",  ",");
                               formattedAddress.push(finalFormattedAddress);
                               
                      }
                        $scope.addresses = formattedAddress;
                        $rootScope.customerDetails.address.addressLine1 = "";
                        $rootScope.customerDetails.address.addressLine2 = "";
                        $rootScope.customerDetails.address.addressLine3 = "";
                        $rootScope.customerDetails.address.addressLine4 = "";
                        $scope.$apply();


                       }
                     
             });
            }  else {
              Notification.error("Invalid post code");
              $scope.addresses =[];
              $rootScope.customerDetails.address.addressLine1 = "";
              $rootScope.customerDetails.address.addressLine2 = "";
              $rootScope.customerDetails.address.addressLine3 = "";
              $rootScope.customerDetails.address.addressLine4 = "";
              $scope.$apply();
            } 
          }

          if($rootScope.customerDetails != null && $rootScope.customerDetails.address != null){
                console.log("I am in here");
                let postCodeInput = $rootScope.customerDetails.address.postcode;
                Meteor.call("getAddresses",postCodeInput, function(error, results) {
                     if(error) { 
                      console.log(error);
                     }
                      else {
                        let formattedAddress = [];
                        for(let m=0; m < results.data.Addresses.length;m++) {
                               let address = results.data.Addresses[m];
                               let res = address.replace(/^[,\s]+|[,\s]+$/g, '').replace(/,[,\s]*,/g, ',').trim();
                               let finalFormattedAddress = res.replace(" ",  ",");
                               formattedAddress.push(finalFormattedAddress);
                               
                      }
                        $scope.addresses = formattedAddress;
                      }
                      $scope.$apply();
                });



              }

  }

}
export default angular.module('createCustomer', [
  angularMeteor
  ])
.component('createCustomer', {
  templateUrl: 'client/client-entry/create-customer/create-customer.html',
  controller: ['$scope','$rootScope','$http','$state','$document','$reactive','$window','$uibModal','$timeout','Notification','baseEncode', CreateCustomerCtrl]
});

