
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
//import { Tasks } from '../../api/tasks.js';

import template from './client-info.html';

import 'angular-component';



class clientInfoCtrl {
  constructor($scope,$rootScope,$http,$state,$document,$window,$reactive,$uibModal,Notification) {

    //console.log($stateParams);
    console.log($rootScope.finance);
    console.log($rootScope.fromNewQuote);
    console.log($rootScope.clientDetailsFromQuote);

    $scope.businessTypes = [];
    $scope.traderTypes = [];  
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

    $scope.viewModel(this);
    this.helpers({

    });
 
      this.scrollTo = function(id) {
        var scrollElement = angular.element(document.getElementById(id));
        $document.scrollToElement(scrollElement , 0, 2000);
      };
      // this.changeOptions = function() {
      //   alert("changed value" + JSON.stringify(this.newClient.customerType));
      // };

      this.logout = function() {
        Meteor.loginFlag = false;
        $state.go('login');
      };
        this.changeState = function(state) {
     
      
        if(state == "newquote") {
          $rootScope.customerDetailsTransfer = null;
          $state.go('createquote');
        }
        if(state == "dashboard") {
          $state.go('landingpage');
        }
      };
    
   
                         
      //selectAgency();

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
     this.selectAgency();

      this.quote = {};
      
      this.quote.totalPremium = 0;
     this.quote.financeOption = {"term6Months":{"net":"3.1","gross":5,"monthlyPremiumAmount":"0.00",
                                 "totalInterestPayable":"0.00","equivalentAPR":"3.4"},
                                 "term8Months":{"net":"2.9","gross":5,"monthlyPremiumAmount":"0.00",
                                 "totalInterestPayable":"0.00","equivalentAPR":"4.1"},
                                 "term10Months":{"net":"2.8","gross":5,"monthlyPremiumAmount":"0.00",
                                 "totalInterestPayable":"0.00","equivalentAPR":"4.4"}
                               };

      this.calculatePremium = () => {
        _this.quote.financeOption.term6Months.totalInterestPayable = 
                        _this.quote.totalPremium*_this.quote.financeOption.term6Months.net/100;

        _this.quote.financeOption.term6Months.monthlyPremiumAmount = 
                         (_this.quote.financeOption.term6Months.totalInterestPayable + 
                         _this.quote.totalPremium)/6;  

         _this.quote.financeOption.term6Months.totalInterestPayable = 
                  parseFloat(_this.quote.financeOption.term6Months.totalInterestPayable).toFixed(2);                
         _this.quote.financeOption.term6Months.monthlyPremiumAmount = 
                  parseFloat(_this.quote.financeOption.term6Months.monthlyPremiumAmount).toFixed(2);

        _this.quote.financeOption.term8Months.totalInterestPayable = 
                        _this.quote.totalPremium*_this.quote.financeOption.term8Months.net/100;                
        _this.quote.financeOption.term8Months.monthlyPremiumAmount = 
                         (_this.quote.financeOption.term8Months.totalInterestPayable + 
                         _this.quote.totalPremium)/8;
         _this.quote.financeOption.term8Months.totalInterestPayable = 
                  parseFloat(_this.quote.financeOption.term8Months.totalInterestPayable).toFixed(2);                 
         _this.quote.financeOption.term8Months.monthlyPremiumAmount = 
                  parseFloat(_this.quote.financeOption.term8Months.monthlyPremiumAmount).toFixed(2);

                         
        _this.quote.financeOption.term10Months.totalInterestPayable = 
                        _this.quote.totalPremium*_this.quote.financeOption.term10Months.net/100;
        _this.quote.financeOption.term10Months.monthlyPremiumAmount = 
                         (_this.quote.financeOption.term10Months.totalInterestPayable + 
                         _this.quote.totalPremium)/10;  
        _this.quote.financeOption.term10Months.totalInterestPayable = 
                  parseFloat(_this.quote.financeOption.term10Months.totalInterestPayable).toFixed(2);                  
        _this.quote.financeOption.term10Months.monthlyPremiumAmount = 
                  parseFloat(_this.quote.financeOption.term10Months.monthlyPremiumAmount).toFixed(2);                                                         
    };

    this.selectQuote = function(selectedRow) {
      _this.isNotFinanceSelected = true;
      if(selectedRow == "6MonthsSelected") {
        _this.is6MonthsSelected = true;
        _this.is8MonthsSelected = false;
        _this.is10MonthsSelected = false;
        _this.finance.term ="6 Months";
        _this.finance.net =_this.quote.financeOption.term6Months.net;
        _this.finance.gross =_this.quote.financeOption.term6Months.gross;
        _this.finance.monthlyPremiumAmount =_this.quote.financeOption.term6Months.monthlyPremiumAmount;
        _this.finance.totalInterestPayable =_this.quote.financeOption.term6Months.totalInterestPayable;
         if(_this.finance.totalInterestPayable && _this.quote.totalPremium) {
          _this.finance.totalAmountPayable  = parseFloat(_this.quote.totalPremium) + parseFloat(_this.finance.totalInterestPayable);
         }
        _this.finance.equivalentAPR =_this.quote.financeOption.term6Months.equivalentAPR;
        $rootScope.inputBPMJson.policyApplication.financeRate.financeRate = _this.finance.net;
        $rootScope.inputBPMJson.policyApplication.financeRate.interestRate = _this.finance.gross;
        $rootScope.inputBPMJson.policyApplication.financeRate.aprVariable = _this.finance.equivalentAPR;
        $rootScope.inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments = _this.finance.term;
        $rootScope.inputBPMJson.policyApplication.financeRate.premium  = _this.finance.monthlyPremiumAmount;
        $rootScope.inputBPMJson.policyApplication.financeRate.premiumAmount   = _this.quote.totalPremium;
        $rootScope.inputBPMJson.policyApplication.financeRate.totalInterestPayable = _this.quote.financeOption.term6Months.totalInterestPayable;
        $rootScope.inputBPMJson.policyApplication.financeRate.totalAmountPayable = Number(_this.quote.totalPremium) + Number(_this.quote.financeOption.term6Months.totalInterestPayable);
        _this.finance.totalPremium = _this.quote.totalPremium;

      }
      if(selectedRow == "8MonthsSelected") {
        _this.is6MonthsSelected = false;
        _this.is8MonthsSelected = true;
        _this.is10MonthsSelected = false;
        _this.finance.term ="8 Months";
        _this.finance.net =_this.quote.financeOption.term8Months.net;
        _this.finance.gross =_this.quote.financeOption.term8Months.gross;
        _this.finance.monthlyPremiumAmount =_this.quote.financeOption.term8Months.monthlyPremiumAmount;
        _this.finance.totalInterestPayable =_this.quote.financeOption.term8Months.totalInterestPayable;
        if(_this.finance.totalInterestPayable && _this.quote.totalPremium) {
          _this.finance.totalAmountPayable  = parseFloat(_this.quote.totalPremium) + parseFloat(_this.finance.totalInterestPayable);
         }
        _this.finance.equivalentAPR =_this.quote.financeOption.term8Months.equivalentAPR;

        $rootScope.inputBPMJson.policyApplication.financeRate.financeRate = _this.finance.net;
        $rootScope.inputBPMJson.policyApplication.financeRate.interestRate = _this.finance.gross;
        $rootScope.inputBPMJson.policyApplication.financeRate.aprVariable = _this.finance.equivalentAPR;
        $rootScope.inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments = _this.finance.term;
        $rootScope.inputBPMJson.policyApplication.financeRate.premium  = _this.finance.monthlyPremiumAmount;
        $rootScope.inputBPMJson.policyApplication.financeRate.premiumAmount   = _this.quote.totalPremium;
        $rootScope.inputBPMJson.policyApplication.financeRate.totalInterestPayable = _this.quote.financeOption.term8Months.totalInterestPayable;
        _this.finance.totalPremium = _this.quote.totalPremium;

        console.log($rootScope.inputBPMJson.policyApplication.financeRate);
      }
      if(selectedRow == "10MonthsSelected") {
        _this.is6MonthsSelected = false;
        _this.is8MonthsSelected = false;
        _this.is10MonthsSelected = true;
        _this.finance.term ="10 Months";
        _this.finance.net =_this.quote.financeOption.term10Months.net;
        _this.finance.gross =_this.quote.financeOption.term10Months.gross;
        _this.finance.monthlyPremiumAmount =_this.quote.financeOption.term10Months.monthlyPremiumAmount;
        _this.finance.totalInterestPayable =_this.quote.financeOption.term10Months.totalInterestPayable;
        _this.finance.equivalentAPR =_this.quote.financeOption.term10Months.equivalentAPR;
        if(_this.finance.totalInterestPayable && _this.quote.totalPremium) {
          _this.finance.totalAmountPayable  = parseFloat(_this.quote.totalPremium) + parseFloat(_this.finance.totalInterestPayable);
         }

        $rootScope.inputBPMJson.policyApplication.financeRate.financeRate = _this.finance.net;
        $rootScope.inputBPMJson.policyApplication.financeRate.interestRate = _this.finance.gross;
        $rootScope.inputBPMJson.policyApplication.financeRate.aprVariable = _this.finance.equivalentAPR;
        $rootScope.inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments = _this.finance.term;
        $rootScope.inputBPMJson.policyApplication.financeRate.premium  = _this.finance.monthlyPremiumAmount;
        $rootScope.inputBPMJson.policyApplication.financeRate.premiumAmount   = _this.quote.totalPremium;
        $rootScope.inputBPMJson.policyApplication.financeRate.totalInterestPayable = _this.quote.financeOption.term10Months.totalInterestPayable;
        _this.finance.totalPremium = _this.quote.totalPremium;
      }
    };

      this.updateAmountPayable = function() {
          // (this.newClient.financeRate * this.newClient.premiumValue/100) + this.newClient.premiumValue;
             this.newClient.financeRate = "3.1";
             if(this.newClient.financeRate != "undefined" && this.newClient.premiumValue > 0) { 

                 if(this.newClient.financeRate == "3.1") {
                   this.newClient.totalAmountPayable = (this.newClient.financeRate * (10/12) * this.newClient.premiumValue/100) + this.newClient.premiumValue;
                   this.newClient.totalAmountPayable = Math.round(this.newClient.totalAmountPayable * 100) / 100;
                   this.newClient.monthlyInstalmentCount = "10";
                   this.newClient.monthlyInstalmentAmount = Math.round(this.newClient.totalAmountPayable/10 * 100) / 100;
                   this.newClient.rateOptionUsed = "10 months with interest rate of 3.1";
                 } 
                 if(this.newClient.financeRate == "4.1") {
                   this.newClient.totalAmountPayable = (this.newClient.financeRate * (6/12) * this.newClient.premiumValue/100) + this.newClient.premiumValue;
                   this.newClient.totalAmountPayable = Math.round(this.newClient.totalAmountPayable * 100) / 100;
                   this.newClient.monthlyInstalmentCount = "6";
                   this.newClient.monthlyInstalmentAmount = Math.round(this.newClient.totalAmountPayable/6 * 100) / 100;
                   this.newClient.rateOptionUsed = "6 months with interest rate of 4.1";
                 }
                 if(this.newClient.financeRate == "5.1") {
                   this.newClient.totalAmountPayable = (this.newClient.financeRate * (3/12) * this.newClient.premiumValue/100) + this.newClient.premiumValue;
                   this.newClient.totalAmountPayable = Math.round(this.newClient.totalAmountPayable * 100) / 100;
                   this.newClient.monthlyInstalmentCount = "3";
                   this.newClient.monthlyInstalmentAmount = Math.round(this.newClient.totalAmountPayable/3 * 100) / 100;
                   this.newClient.rateOptionUsed = "3 months with interest rate of 5.1";
                 }
              
                
             }
      };

      this.newClient = {};
      this.isPremiumDetails = false;
      this.isClientDetails = true;
      this.isComplianceDetails = false;
      this.isBankDetails = false;
      $scope.step1Status = "active";
      $scope.step2Status = "disabled";
      $scope.step3Status = "disabled";
      $scope.step4Status = "disabled";
      $scope.step5Status = "disabled";

      this.navHeader = "Customer Details";
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var _this =this;
      _this.finance = {};



      if($rootScope.finance != null){
        console.log(_this.quote);

        this.finance = $rootScope.finance ;
        $rootScope.inputBPMJson.policyApplication.financeRate.financeRate = _this.finance.net;
        $rootScope.inputBPMJson.policyApplication.financeRate.interestRate = _this.finance.gross;
        $rootScope.inputBPMJson.policyApplication.financeRate.aprVariable = _this.finance.equivalentAPR;
        $rootScope.inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments = _this.finance.term;
        $rootScope.inputBPMJson.policyApplication.financeRate.premium  = _this.finance.monthlyPremiumAmount;
        $rootScope.inputBPMJson.policyApplication.financeRate.premiumAmount   = _this.finance.totalPremium;
        $rootScope.inputBPMJson.policyApplication.financeRate.totalInterestPayable = _this.finance.totalInterestPayable;
        $rootScope.inputBPMJson.policyApplication.financeRate.totalAmountPayable = Number(_this.finance.totalPremium) + Number(_this.finance.totalInterestPayable);
      }


      if($rootScope.customerDetailsTransfer != null){
        console.log(customerObj);
  let customerObj = $rootScope.customerDetailsTransfer[0];
    $scope.customerName = customerObj.primaryContact;
    $scope.customerName = customerObj.primaryContact;
    $scope.postCode = customerObj.addresses.postcode;
    $scope.addressLine1 = customerObj.addresses.addressLine1;
    $scope.addressLine2 = customerObj.addresses.addressLine2;
    $scope.addressLine3 = customerObj.addresses.addressLine3;
    $scope.addressLine4 = customerObj.addresses.addressLine4;
    $scope.emailId = customerObj.eMail;
    $scope.traderType = customerObj.tradeType;
    $scope.dateOfBirth = customerObj.dateOfBirth;
    $scope.telephone = customerObj.telephone;
    $scope.natureOfBusiness = customerObj.natureOfBusiness;

     _this.newClient.customerName = customerObj.primaryContact;
     _this.newClient.postCode = customerObj.addresses.postcode;;
     _this.newClient.address1 = customerObj.addresses.addressLine1;
     _this.newClient.address2 = customerObj.addresses.addressLine2;
     _this.newClient.address3 = customerObj.addresses.addressLine3;
     _this.newClient.address4 = customerObj.addresses.addressLine4;
     _this.newClient.customerEmail = customerObj.eMail;
     _this.newClient.customerType = customerObj.tradeType;
     _this.newClient.dateOfBirth = customerObj.dateOfBirth;
      _this.newClient.customerHomeTel = customerObj.telephone;
     _this.newClient.natureOfBusiness = customerObj.natureOfBusiness;
}
  
  if($rootScope.clientDetailsFromQuote != null){
        console.log("Hello");
        console.log($rootScope.clientDetailsFromQuote);
  let customerObj = $rootScope.clientDetailsFromQuote;
  console.log(customerObj);
    $scope.customerName = customerObj.customerName;
    $scope.postCode = customerObj.postCode;
    $scope.addressLine1 = customerObj.address1;
    $scope.addressLine2 = customerObj.address2;
    $scope.addressLine3 = customerObj.address3;
    $scope.addressLine4 = customerObj.address1;
    $scope.emailId = customerObj.customerEmail;
    $scope.traderType = customerObj.customerType;
    $scope.dateOfBirth = customerObj.dateOfBirth;
    $scope.telephone = customerObj.customerHomeTel;
    $scope.natureOfBusiness = customerObj.natureOfBusiness;

   _this.newClient.customerName = customerObj.customerName;
     _this.newClient.postCode = customerObj.postCode;;
     _this.newClient.address1 = customerObj.address1;
     _this.newClient.address2 = customerObj.address2;
     _this.newClient.address3 = customerObj.address3;
     _this.newClient.address4 = customerObj.address4;
     _this.newClient.customerEmail = customerObj.customerEmail;
     _this.newClient.customerType = customerObj.customerType;
     _this.newClient.dateOfBirth = customerObj.dateOfBirth;
      _this.newClient.customerHomeTel = customerObj.customerHomeTel;
     _this.newClient.natureOfBusiness = customerObj.natureOfBusiness;
     _this.newClient.premiumRate = customerObj.premiumRate;
     _this.newClient.companyRegNo = customerObj.companyRegNo;
      _this.newClient.customerMobile = customerObj.customerMobile;

}
     

      var apiKey = "Basic YXBpX2tleTpUZVVEUlFCeVprYXgzZXMwZVc4Qzh3NDA3NA==";



//      var apiKey = "Basic c21hcnRlcnByb2Nlc3MudWtAZ21haWwuY29tOlRlVURSUUJ5WmtheDNlczBlVzhDOHc0MDc0";

      this.findAddress = () => {
        var postCodeInput = this.newClient.postCode;
       // alert(postCodeInput); 
        Meteor.call("getAddresses",apiKey,postCodeInput, function(error, results) {
             if(error) { 
               console.log(error);
             } else {
                var formattedAddress = [];
                //console.log(results);
                for(var m=0; m < results.data.Addresses.length;m++) {
                       var address = results.data.Addresses[m];
                       console.log(address);
                      // var res = address.replace(/^[, ]+|[, ]+$|[, ]+/g, " ").trim();
                     // console.log(res);
           //var finalFormattedAddress = res.replace(" ",  ",");
           //console.log(finalFormattedAddress);
                       formattedAddress.push(address);
                       
              }   
                $scope.addresses = formattedAddress;
             }
           
         });

      }

    //   this.openCreditAgreementExplanation = () => {
    //     console.log("Here now");
    //      window.open('/creditagreementexplanation', 'Credit Agreement Explanation', 'width=800,height=800');
        
    // };

    this.openCreditAgreementExplanation = () => {
         this.newClient.isCreditAggrementExplanation = true;
         $window.open('/creditagreementexplanation', 'Credit Agreement Explanation', 'width=800,height=800');
        
    };

     this.openRACADocument = () => {
         // Meteor.call("getEDocs","SecciDocuments","Sample_1469101395355.pdf",function(error, results) {
         //     if(error) { 
         //       console.log(error);
         //      } else {
         //         let file = new Blob([results.content], {type: 'application/pdf'});
         //         let fileURL = URL.createObjectURL(file);
         //         $window.open(fileURL,'SECCI', 'width=700,height=800');
         //       }
         // });
         this.newClient.isRaca = true;
         $window.open('/showraca','RACA', 'width=800,height=800');
    };

    this.downloadRACADocument = () => {
          $window.open("pdf/raca.pdf");
          this.isDownloadedRaca = true;
    };

    this.isCompliant = () => {
       let complianceFlag = this.newClient.isSecci && this.newClient.isRaca  && this.newClient.isCreditAggrementExplanation;
       if(!complianceFlag) {
          complianceFlag = false;
       }
       return !complianceFlag;
     }

    this.openEdocs = () => {
       //alert("called secci");
       this.newClient.isRaca = true;
       let transactionRef = "";
       let transactionObj = {};
       if($rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef == ""  || $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef === undefined)
       {
          TransactionDetails.insert($rootScope.inputBPMJson.policyApplication.transactionDetails, function(err,docsInserted){
          console.log(docsInserted);
          $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef = docsInserted;
          transactionRef = docsInserted;
          $window.open('/documentupload?myParam='+transactionRef, 'Document Upload', 'width=1280,height=800');
           }); 
      }
      else{
          transactionRef = $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef;
          Meteor.call("retrieveCollection",transactionRef, function(error, results) {
              if(error) { 
                   console.log(error);
             } 
              else {
                      transactionObj = results;

                    if(transactionObj.documentId =="" || transactionObj.documentId === undefined)
                    {
                        $window.open('/documentupload?myParam='+transactionRef, 'Document Upload', 'width=1280,height=800');

                    }
                    else{
                      let documentId = transactionObj.documentId;
                      Meteor.call("getEDocs","SecciDocuments","Sample_1469101395355.pdf",function(error, results) {
                          if(error) { 
                          console.log(error);
                          } else {
                          let file = new Blob([results.content], {type: 'application/pdf'});
                          let fileURL = URL.createObjectURL(file);
                          $window.open(fileURL,'RACA', 'width=700,height=800');
                          }
                      });

                    }
              }
          });
       }    
   };

      

    this.openSECCIDocument = () => {
       //alert("called secci");
        // Meteor.call("getEDocs","SecciDocuments","SampleTest.pdf",function(error, results) {
        //     if(error) { 
        //       console.log(error);
        //      } else {
        //         let file = new Blob([results.content], {type: 'application/pdf'});
        //         console.log(file);
        //         let fileURL = URL.createObjectURL(file);
        //         console.log(fileURL);
        //         window.open(fileURL,'SECCI', 'width=700,height=800');
        //       }
        // });
        this.newClient.isSecci = true;
        $window.open('/showsecci','SECCI', 'width=800,height=800');
   };

      this.populateAddressFields = () => {
       // alert("In");
        console.log(this.newClient.customerAddress);
        var selectedAddress = this.newClient.customerAddress;
        var arrayAddress = [];
        
        arrayAddress = selectedAddress.split(",");
        console.log(arrayAddress);
        $scope.addressLine1 = ((arrayAddress[0] != " ") ? (arrayAddress[0] + "," ) : ("")) + arrayAddress[1];
        this.newClient.address1 = ((arrayAddress[0] != " ") ? (arrayAddress[0] + "," ) : ("")) + arrayAddress[1];
        $scope.addressLine2 = ((arrayAddress[2] != " ") ? (arrayAddress[2] + "," ) : ("")) + arrayAddress[3];
        this.newClient.address2 = ((arrayAddress[2] != " ") ? (arrayAddress[2] + "," ) : ("")) + arrayAddress[3];
        $scope.addressLine3 =((arrayAddress[4] != " ") ? (arrayAddress[4] + "," ) : ("")) + arrayAddress[5];
        this.newClient.address3 = ((arrayAddress[4] != " ") ? (arrayAddress[4] + "," ) : ("")) + arrayAddress[5];
        $scope.addressLine4 = arrayAddress[6];
        this.newClient.address4 = arrayAddress[6] ;
      }

      this.next = () => {

       // if(($scope.customerForm.$valid)) { 
          if(_this.isClientDetails){
            _this.isPremiumDetails = true;
            _this.isClientDetails = false;
            _this.navHeader = "Policy Details";
            $scope.step1Status = "complete";
            $scope.step2Status = "active";
            $scope.step3Status = "disabled";
            $scope.step4Status = "disabled";
            $scope.step5Status = "disabled";

        if($rootScope.fromNewQuote == false && this.isPremiumDetails == true ) {
        _this.QuoteVisibility = true;
          }
          else{
            _this.QuoteVisibility = true;
             
             $rootScope.fromNewQuote = false;

            // $rootScope.finance = _this.finance;
              _this.newClient.totalPremium = $rootScope.finance.totalPremium;
              $scope.policyGridOptions.data =  $rootScope.inputBPMJson.policyApplication.policyDetails.policies;
              $scope.gridApi.grid.refresh();
             _this.quote.totalPremium = $rootScope.finance.totalPremium;
             if(_this.quote.totalPremium) {
             _this.calculatePremium();
             }

            //$rootScope.policyDetailsFromQuote = $rootScope.inputBPMJson.policyApplication.policyDetails;

            // alert(JSON.stringify($rootScope.inputBPMJson.policyApplication.policyDetails));
            // alert(JSON.stringify($rootScope.policyDetailsFromQuote));

             if($rootScope.finance.term == "6 Months") {
               _this.selectQuote('6MonthsSelected');
             } else if($rootScope.finance.term == "8 Months") {
               _this.selectQuote('8MonthsSelected');
             }else if($rootScope.finance.term == "10 Months") {
               _this.selectQuote('10MonthsSelected');
             } else {}
             

          }
       
        $rootScope.inputBPMJson.policyApplication.customerDetails.customerName = _this.newClient.customerName;
        $rootScope.inputBPMJson.policyApplication.customerDetails.customerMobile = _this.newClient.customerMobile;
        $rootScope.inputBPMJson.policyApplication.customerDetails.customerEmail = _this.newClient.customerEmail;
        $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine1= _this.newClient.address1;
        $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine2= _this.newClient.address2;
        $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine3= _this.newClient.address3;
        $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine4= _this.newClient.address4;
        $rootScope.inputBPMJson.policyApplication.customerDetails.address.postcode= _this.newClient.postCode;
        $rootScope.inputBPMJson.policyApplication.customerDetails.address.selectedAddress= _this.newClient.customerAddress;
        $rootScope.inputBPMJson.policyApplication.customerDetails.premiumRate= _this.newClient.premiumRate;
        $rootScope.inputBPMJson.policyApplication.customerDetails.customerType= _this.newClient.customerType;
        $rootScope.inputBPMJson.policyApplication.customerDetails.companyRegNo = _this.newClient.companyRegNo;
        $rootScope.inputBPMJson.policyApplication.customerDetails.traderType = _this.newClient.customerType;
        $rootScope.inputBPMJson.policyApplication.customerDetails.natureOfBusiness = _this.newClient.natureOfBusiness;
        $rootScope.inputBPMJson.policyApplication.customerDetails.customerPhone = _this.newClient.customerHomeTel;
        console.log($rootScope.inputBPMJson.policyApplication);

        if($rootScope.inputBPMJson.policyApplication.transactionDetails.customerRef == ""  || $rootScope.inputBPMJson.policyApplication.transactionDetails.customerRef === undefined){
         CustomerDetails.insert($rootScope.inputBPMJson.policyApplication.customerDetails, function(err,docsInserted){
           console.log(docsInserted);
           $rootScope.inputBPMJson.policyApplication.transactionDetails.customerRef = docsInserted }); 
      }
        else{
           CustomerDetails.update({"_id" :$rootScope.inputBPMJson.policyApplication.transactionDetails.customerRef},{$set:$rootScope.inputBPMJson.policyApplication.customerDetails});
         }
         }
         else if(_this.isPremiumDetails){
            _this.isBankDetails = true;
            _this.isPremiumDetails = false;
            if($rootScope.fromNewQuote == false && this.isPremiumDetails == true ) {
           _this.QuoteVisibility = true;
            }
            else{
              _this.QuoteVisibility = false;
          }
            _this.navHeader = "Bank Details";
            $scope.step1Status = "complete";
            $scope.step2Status = "complete";
            $scope.step3Status = "active";
            $scope.step4Status = "disabled";
            $scope.step5Status = "disabled";


        if($rootScope.inputBPMJson.policyApplication.transactionDetails.policyRef == ""  || $rootScope.inputBPMJson.policyApplication.transactionDetails.policyRef === undefined){
            console.log($rootScope.inputBPMJson.policyApplication.policyDetails);
            console.log($rootScope.inputBPMJson.policyApplication);
            let policyDetailsJson = angular.toJson($rootScope.inputBPMJson.policyApplication.policyDetails);
            let policyDetailsJsonObj = JSON.parse(policyDetailsJson);
            console.log(policyDetailsJsonObj);
            PolicyDetails.insert(policyDetailsJsonObj , function(err,docsInserted){
            console.log(docsInserted);
           $rootScope.inputBPMJson.policyApplication.transactionDetails.policyRef = docsInserted });   
        }
      else{
            PolicyDetails.update({"_id" :$rootScope.inputBPMJson.policyApplication.transactionDetails.policyRef},{$set:$rootScope.inputBPMJson.policyApplication.policyDetails});
       }

       if($rootScope.inputBPMJson.policyApplication.transactionDetails.financeRef == ""  || $rootScope.inputBPMJson.policyApplication.transactionDetails.financeRef === undefined){
            console.log($rootScope.inputBPMJson.policyApplication.financeRate);
            console.log($rootScope.inputBPMJson.policyApplication);
            
            FinanceDetails.insert($rootScope.inputBPMJson.policyApplication.financeRate , function(err,docsInserted){
            console.log(docsInserted);
           $rootScope.inputBPMJson.policyApplication.transactionDetails.financeRef = docsInserted });   
        }
      else{
            FinanceDetails.update({"_id" :$rootScope.inputBPMJson.policyApplication.transactionDetails.financeRef},{$set:$rootScope.inputBPMJson.policyApplication.financeRate});
       }

         

         }
         else if(_this.isBankDetails){
            _this.isBankDetails = false;
            _this.isComplianceDetails = true;
            _this.navHeader = "Compliance";
            $scope.step1Status = "complete";
            $scope.step2Status = "complete";
            $scope.step3Status = "complete";
            $scope.step4Status = "active";
            $scope.step5Status = "disabled";

             if($scope.bankForm.$valid) {
         $rootScope.inputBPMJson.policyApplication.transactionDetails.brokerId = $rootScope.brokerId;
         $rootScope.inputBPMJson.policyApplication.bankDetails.accountName = _this.newClient.accountName;
         $rootScope.inputBPMJson.policyApplication.bankDetails.sortCode = _this.newClient.sortCode1+"-"+_this.newClient.sortCode2+"-"+_this.newClient.sortCode3;
         $rootScope.inputBPMJson.policyApplication.bankDetails.accountNumber = _this.newClient.accountNumber;

            if($rootScope.inputBPMJson.policyApplication.transactionDetails.bankRef == ""  || $rootScope.inputBPMJson.policyApplication.transactionDetails.bankRef === undefined)
   {
                BankDetails.insert($rootScope.inputBPMJson.policyApplication.bankDetails, function(err,docsInserted){
                  console.log(docsInserted);

                  $rootScope.inputBPMJson.policyApplication.transactionDetails.bankRef = docsInserted ;

              if($rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef == ""  || $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef === undefined)
              {
          TransactionDetails.insert($rootScope.inputBPMJson.policyApplication.transactionDetails, function(err,docsInserted){
          console.log(docsInserted);
          $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef = docsInserted }); 
      }
     
      else{
          TransactionDetails.update({"_id" :$rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef},{$set:$rootScope.inputBPMJson.policyApplication.transactionDetails});
       }
     });
               }

              else{
                  BankDetails.update({"_id" :$rootScope.inputBPMJson.policyApplication.transactionDetails.bankRef},{$set:$rootScope.inputBPMJson.policyApplication.bankDetails});
               }
                 console.log($rootScope.inputBPMJson.policyApplication);
               }

         else{
              return;
          }


           


         }
         else {}
            
        let dob = _this.gateDateInFormat(_this.newClient.dateOfBirth,"YYYY/MM/DD");
      }


      this.gateDateInFormat = (inputDate,format) => {
          if(format == "YYYY/MM/DD") {
            if(inputDate) {
              try { 
                 let formattedDate = [inputDate.getFullYear(), pad(inputDate.getMonth()+1),pad(inputDate.getDate()) ].join('/');
                 console.log(formattedDate);
                 return formattedDate;
              } catch(e) {
                 return inputDate;
              }
              return inputDate;
            }
          }
          if(format == "YYYY-MM-DD") {
            if(inputDate) {
              try { 
                let formattedDate = [inputDate.getFullYear(), pad(inputDate.getMonth()+1), pad(inputDate.getDate())].join('-');
                console.log(formattedDate);
                return formattedDate;
              } catch(e) {
                return inputDate;
              }
            }
          }
        }
      
       this.addPolicyToTable = () => {
          if(!$scope.policyForm.$valid) {
              return;
            }
          this.policies = {};
          let isPolicyNumberNotExisting = true;
          this.policies.policyNumber =  _this.newClient.policyNumberInput;
          for (let i=0; i < $rootScope.inputBPMJson.policyApplication.policyDetails.policies.length; i++) {
             if ($rootScope.inputBPMJson.policyApplication.policyDetails.policies[i].policyNumber === _this.newClient.policyNumberInput) {
              isPolicyNumberNotExisting = false;
              }
           }
        if(isPolicyNumberNotExisting) {
              this.newClient.policyNumberInput = "";
              this.policies.insurer = _this.newClient.insurerInput;
              this.newClient.insurerInput = "";
              this.policies.cover = _this.newClient.coverInput;
              this.newClient.coverInput = "";
              this.policies.premiumAmount = _this.newClient.premiumValue;
              this.newClient.premiumValue = null;
              this.policies.renewalDate = _this.gateDateInFormat(_this.newClient.policyPremiumDateInput,"YYYY-MM-DD");
              this.newClient.policyPremiumDateInput = null;
              console.log(this.policies);
              $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium = Number($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium) + Number(this.policies.premiumAmount);
              this.newClient.totalPremium = Number($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium);
              this.quote.totalPremium = Number($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium);

              console.log($rootScope.inputBPMJson.policyApplication.policyDetails);
              console.log($rootScope.inputBPMJson.policyApplication.policyDetails.policies);
              //alert(JSON.stringify($rootScope.inputBPMJson.policyApplication.policyDetails.policies));
              $rootScope.inputBPMJson.policyApplication.policyDetails.policies.push(this.policies);
              $scope.policyGridOptions.data =  $rootScope.inputBPMJson.policyApplication.policyDetails.policies;
              $scope.gridApi.grid.refresh();
         }  

        }

      $scope.policyGridOptions = {
            showFooter: true,
            enableSorting: true,
            multiSelect: false,
            enableFiltering: false,     
            enableRowSelection: true, 
            enableSelectAll: false,
            enableRowHeaderSelection: false,
            selectionRowHeaderWidth: 35,  
            noUnselect: true,
            enableGridMenu: true,
          onRegisterApi: function(gridApi){
           $scope.gridApi = gridApi;
      },
                columnDefs: [
    { field: 'policyNumber',displayName: 'Policy Number',width: 200},
    { field: 'insurer',displayName: 'Insurer' },
    { field: 'premiumAmount',displayName: 'Premium Amount' },
    { field: 'cover',displayName: 'Cover' },
    { field: 'renewalDate',displayName: 'Start Date' },
    {
    name: 'Delete',
    cellTemplate: '<image style="cursor: pointer;" ng-src="/images/bin.png" ng-click="grid.appScope.deleteRow(row)" height="80%"></image>'
    }]};

    $scope.deleteRow = function(row) {
        let index = $scope.policyGridOptions.data.indexOf(row.entity);
        console.log(index);
        $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium= Number($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium) - Number($scope.policyGridOptions.data[index].premiumAmount);
        console.log($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium);
        _this.newClient.totalPremium = $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium ;
        _this.quote.totalPremium = _this.newClient.totalPremium;
        $scope.policyGridOptions.data.splice(index, 1);
    };
    
    this.back = () => {
        this.navHeader = "Customer Details";
         if(this.isPremiumDetails){
           this.isPremiumDetails = false;
           this.isClientDetails = true;
           if($rootScope.fromNewQuote == false && this.isPremiumDetails == true ) {
           _this.QuoteVisibility = true;
            }
            else{
              _this.QuoteVisibility = false;
          }
           $scope.step1Status = "active";
           $scope.step2Status = "disabled";
           $scope.step3Status = "disabled";
           $scope.step4Status = "disabled";
           $scope.step5Status = "disabled";
         }
         else if(this.isBankDetails){
           this.isBankDetails = false;
           this.isPremiumDetails = true;
           if($rootScope.fromNewQuote == false && this.isPremiumDetails == true ) {
           _this.QuoteVisibility = true;
            }
            else{
              _this.QuoteVisibility = false;
          }
           $scope.step1Status = "complete";
           $scope.step2Status = "active";
           $scope.step3Status = "disabled";
           $scope.step4Status = "disabled";
           $scope.step5Status = "disabled";
         }
         else if(this.isComplianceDetails){
           this.isBankDetails = true;
           this.isComplianceDetails = false;
           $scope.step1Status = "complete";
           $scope.step2Status = "complete";
           $scope.step3Status = "active";
           $scope.step4Status = "disabled";
           $scope.step5Status = "disabled";
         }
         else {}
        //this.isPremiumDetails = false;

      }

      this.checkODMRules =(xmlData) => {
          //alert("called odm rules");
         this.currentState = "default";
         let _this = this;
         $rootScope.isHighPremium= "true";
         Meteor.call("getODMRules",xmlData,function(error, results) {
                      if(error) {
                       console.log(error);
                       _this.currentState = "error";
                      } else {
                          let xmlString = String(results.content);
                          let subXmlString = "<HighPremium>false</HighPremium>";
                          if(xmlString.indexOf(subXmlString) > -1) {
                               $rootScope.isHighPremium= "false";
                               _this.currentState = "autoapproved";
                               $state.go("autoapproved");
                               Notification.info('Loan is Autoapproved');
                          } else {
                              $rootScope.isHighPremium= "true";
                              _this.currentState = "additionalinfo";
                              $state.go("additionalinfo");
                          }
                      }
        });
      }

      //this.checkODMRules('<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID><par:PolicyDetails><BrokerType>platinum</BrokerType><premiumValue>76.00</premiumValue></par:PolicyDetails><par:premiumType><HighPremium>false</HighPremium></par:premiumType></par:Request>');

     
      this.checkRulesForClient = () => {

        $rootScope.inputBPMJson.policyApplication.transactionDetails.isCreditAgreementExplained = _this.newClient.isCreditAggrementExplanation;
           $rootScope.inputBPMJson.policyApplication.transactionDetails.isRaccaShown = _this.newClient.isRaca;
           $rootScope.inputBPMJson.policyApplication.transactionDetails.isSecciShown = _this.newClient.isSecci;

        if($rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef == ""  || $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef === undefined){
          TransactionDetails.insert($rootScope.inputBPMJson.policyApplication.transactionDetails, function(err,docsInserted){
          console.log(docsInserted);
          $rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef = docsInserted }); 
      }
      else{
          TransactionDetails.update({"_id" :$rootScope.inputBPMJson.policyApplication.transactionDetails.transactionRef},{$set:$rootScope.inputBPMJson.policyApplication.transactionDetails});
       }



           _this.navHeader = "Loan Confirmation";
            $scope.step1Status = "complete";
            $scope.step2Status = "complete";
            $scope.step3Status = "complete";
            $scope.step4Status = "complete";
            $scope.step5Status = "complete";

            $rootScope.inputBPMJson.policyApplication.brokerConfig.Mobile = $rootScope.brokerPhone + '';
            $rootScope.inputBPMJson.policyApplication.financeRate.brokerArrangementFee = "0";
            $rootScope.inputBPMJson.policyApplication.financeRate.interestRate =this.newClient.financeRate + '';
            $rootScope.inputBPMJson.policyApplication.financeRate.amountPayable = this.newClient.totalAmountPayable + '';
            $rootScope.inputBPMJson.policyApplication.financeRate.aprVariable = "5.51";
            $rootScope.inputBPMJson.policyApplication.financeRate.durationOfAgreement = "Recurring";
            $rootScope.inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments = this.newClient.monthlyInstalmentCount + '';
            $rootScope.inputBPMJson.policyApplication.financeRate.depositPayable = "0";
            $rootScope.inputBPMJson.policyApplication.financeRate.totalAmountOfCredit = this.newClient.premiumValue + '';
            $rootScope.inputBPMJson.policyApplication.financeRate.costOfCredit = this.newClient.premiumValue + '';
            $rootScope.inputBPMJson.policyApplication.financeRate.premiumAmount = this.newClient.monthlyInstalmentAmount;
            $rootScope.inputBPMJson.policyApplication.financeRate.financeRate= this.newClient.financeRate;
            $rootScope.inputBPMJson.policyApplication.financeRate.premium= this.newClient.premium;
            $rootScope.inputBPMJson.policyApplication.financeRate.brokerType= this.newClient.brokerType;
            $rootScope.inputBPMJson.policyApplication.brokerConfig.email= "spillai@prolifics.com";

            Notification.info('Checking ODM Rules for client');


            var xmlData = '<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
              '<par:PolicyDetails><BrokerType>BROKERTYPE</BrokerType><premiumValue>PREMIUMVALUE.00</premiumValue></par:PolicyDetails>' +
                '<par:premiumType><HighPremium>false</HighPremium></par:premiumType>' +
                           '</par:Request>';

             xmlData = xmlData.replace("BROKERTYPE",$rootScope.actualbrokerType);
             xmlData = xmlData.replace("PREMIUMVALUE",$rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium);

             //alert($rootScope.actualbrokerType);
                             
            $rootScope.isHighPremium= "false";
            Meteor.call("getODMRules",xmlData,function(error, results) {
                          if(error) {
                           console.log(error);
                          } else {
                              console.log(results.content);
                              var xmlString = String(results.content);
                               xmlString = results;
                              var subXmlString = "<HighPremium>false</HighPremium>";
                              if(xmlString.indexOf(subXmlString) > -1) {
                                   $rootScope.isHighPremium= "false";
                                   $state.go("autoapproved");
                                   Notification.info('Loan is Autoapproved');
                              } else {
                                  $rootScope.isHighPremium = "true";
                                  $state.go("additionalinfo");

                              }
                          }
            });

       }
    }

}
export default angular.module('clientInfo', [
  angularMeteor
])
  .component('clientInfo', {
    templateUrl: 'client/client-entry/client-info/client-info.html',
    controller: ['$scope','$rootScope','$http','$state','$document','$window','$reactive','$uibModal','Notification', clientInfoCtrl]
  });
