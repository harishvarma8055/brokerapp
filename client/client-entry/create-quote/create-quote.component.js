
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './create-quote.html';

import 'angular-component';

class CreateQuoteCtrl {
  constructor($scope,$rootScope,$http,$state,$document,$reactive,$window,$uibModal,Notification,baseEncode) {
  

  
    $rootScope.fromNewQuote = false;
    $scope.businessTypes = [];
    $scope.traderTypes = [];  
    $scope.insurerNamesList = [];
    $scope.insurerTypes = [];
    $scope.coverTypes = [];
    $scope.insurerNamesList = $rootScope.insurerNames;
    $scope.coverTypesList = [];
    $scope.coverTypesList = $rootScope.coverTypes;

    this.newClient = {};


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
           if(format == "DD/MM/YYYY") {
            if(inputDate) {
              try { 
                 let formattedDate = [pad(inputDate.getDate()),pad(inputDate.getMonth()+1),inputDate.getFullYear()].join('/');
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

     this.quoteDetails = {}; //for holding the actual collection
     this.quote = {};

     this.quote.compliance = {};
     $rootScope.inputBPMJson.policyApplication.policyDetails.policies = [];
     $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium = 0;
     _this.finance = {};
     this.quote.newClient={};
   
     this.quote.totalPremium = 0;
    
     this.quote.financeOption = [{}];                         

      if($rootScope.brokerConfig.brokerRates) {  
             angular.forEach($rootScope.brokerConfig.brokerRates, function(value, key) {
                 let grossRate = 0.0;
                 value.baseRate = parseFloat(Math.round(value.baseRate * 10) / 10).toFixed(1)
                 if(value.baseRate && !isNaN(value.electedOverrider)) {
                     grossRate = value.baseRate + value.electedOverrider;
                     grossRate = parseFloat(Math.round(grossRate * 10) / 10).toFixed(1);
                 }
            
                _this.quote.financeOption[key] = {"term":value.instalments,"net":value.baseRate,"gross":grossRate,"monthlyPremiumAmount":"0.00","totalInterestPayable":"0.00","totalAmountToRepay":"0.00","equivalentAPR":"0.0","equivalentPAR":"0.0","rateReference":value.productCode,"overriderRate":value.electedOverrider};                    
             }); 
       } 


       if($rootScope.brokerConfig.brokerInsurers){
                                 // console.log("Inside traderTypes");
                                  for(let i= 0; i< $rootScope.brokerConfig.brokerInsurers.length ; i++ ){
                                   // console.log("Inside traderTypes Loop");
                                  let keyVal = {};
                                  //console.log(results.data.traderTypes.body[i].ITTD_TRADER_TYPE_CODE);                            
                                  keyVal.type = $rootScope.brokerConfig.brokerInsurers[i].reference;
                                  keyVal.description = $rootScope.brokerConfig.brokerInsurers[i].name;
                                 // console.log(keyVal); 
                                  $scope.insurerTypes.push(keyVal);
                                  //console.log(businessTypes); 
                                  }
                                // console.log($scope.traderTypes); 
        }

        if($rootScope.brokerConfig.brokerCoverTypes){
                                 // console.log("Inside traderTypes");
                                  for(let i= 0; i< $rootScope.brokerConfig.brokerCoverTypes.length ; i++ ){
                                   // console.log("Inside traderTypes Loop");
                                  let keyVal = {};
                                  //console.log(results.data.traderTypes.body[i].ITTD_TRADER_TYPE_CODE);                            
                                  keyVal.type = $rootScope.brokerConfig.brokerCoverTypes[i].code;
                                  keyVal.description = $rootScope.brokerConfig.brokerCoverTypes[i].description;
                                 // console.log(keyVal); 
                                  $scope.coverTypes.push(keyVal);
                                  //console.log(businessTypes); 
                                  }
                                // console.log($scope.traderTypes); 
        }

    $scope.viewModel(this);

        //added for policy inclusion - copy from loan
        this.isPremiumEntered=false;
         $scope.today= new Date().toISOString().split('T')[0];
    this.addPolicyToTable = () => {
       if($scope.quickQuoteForm.$valid){
         this.isPremiumEntered=true;
          this.policies = {};
          let isPolicyNumberNotExisting = true;
          this.policies.policyNumber =  _this.quote.newClient.policyNumberInput;
          for (let i=0; i < $rootScope.inputBPMJson.policyApplication.policyDetails.policies.length; i++) {
             if ($rootScope.inputBPMJson.policyApplication.policyDetails.policies[i].policyNumber === _this.newClient.policyNumberInput) {
              isPolicyNumberNotExisting = false;
              }
           }
        if(isPolicyNumberNotExisting) {
              this.quote.newClient.policyNumberInput = "";
              this.policies.insurer = _this.quote.newClient.insurerInput;
              this.policies.insurerTypeCode = _this.quote.newClient.insurerInput.type;
              this.quote.newClient.insurerInput = "";
              this.policies.cover = _this.quote.newClient.coverInput;
              this.policies.coverTypeCode = _this.quote.newClient.coverInput.type;
              this.quote.newClient.coverInput = "";
              this.policies.premiumAmountWithCommas = _this.quote.newClient.premiumValue;
              this.policies.premiumAmount = parseFloat(_this.quote.newClient.premiumValue.replace(/,/g , "")).toFixed(2); //_this.quote.newClient.premiumValue; 
              this.quote.newClient.premiumValue = null;
              if(this.policies.isRenewal == "Yes") {
                 this.policies.isRenewal =  "true";
              } else {
                 this.policies.isRenewal =  "false";
              }
              this.quote.newClient.isRenewal = null;
              if(this.quote.newClient.isRenewal == "Yes") {
                  this.policies.isRefundable =  "true";
              } else {
                  this.policies.isRefundable =  "false";
              }
              this.quote.newClient.isRefundable = null;
              
              this.policies.renewalDate = _this.gateDateInFormat(_this.quote.newClient.policyPremiumDateInput,"YYYY-MM-DD");
              this.policies.renewalDateFormatted = _this.gateDateInFormat(_this.quote.newClient.policyPremiumDateInput,"DD/MM/YYYY");
              this.quote.newClient.policyPremiumDateInput = null;
              console.log(this.policies);
              $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium = Number($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium) + Number(this.policies.premiumAmount);
              this.quote.newClient.totalPremium = Number($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium);
              
              console.log($rootScope.inputBPMJson.policyApplication.policyDetails);
              console.log($rootScope.inputBPMJson.policyApplication.policyDetails.policies);
              this.quote.newClient.totalPremium = $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium;
              this.quote.newClient.totalPremium =  parseFloat(this.quote.newClient.totalPremium).toFixed(2); 
              this.quote.totalPremium = this.quote.newClient.totalPremium;
              $rootScope.inputBPMJson.policyApplication.policyDetails.policies.push(this.policies);
              $scope.policyGridOptions.data =  $rootScope.inputBPMJson.policyApplication.policyDetails.policies;
              _this.isPoliciesModified = true;
              $scope.gridApi.grid.refresh();
          } 
        }
         }; 

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
    { field: 'policyNumber',displayName: 'Policy number',width: 200},
    { field: 'insurer.description',displayName: 'Insurer' },
    { field: 'premiumAmountWithCommas',displayName: 'Premium (£)',cellClass:'text-right' },
    { field: 'cover.description',displayName: 'Cover' },
    { field: 'renewalDateFormatted',displayName: 'Renewal date' },
    {
    name: 'Delete',
    cellTemplate: '<image style="cursor: pointer;" ng-src="/images/bin.png" ng-click="grid.appScope.deleteRow(row)" height="80%"></image>'
    }]};

    $scope.deleteRow = function(row) {
        let index = $scope.policyGridOptions.data.indexOf(row.entity);
        console.log(index);
        $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium= Number($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium) - Number($scope.policyGridOptions.data[index].premiumAmount);
        console.log($rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium);

        _this.quote.newClient.totalPremium = $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium;
        //_this.quote.newClient.totalPremium = $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium;
        _this.quote.totalPremium = _this.quote.newClient.totalPremium;
        $scope.policyGridOptions.data.splice(index, 1);
        if(_this.quote.totalPremium == 0){
          //console.log("Disable Next Button");
          _this.isPremiumEntered=false;
        }
         $rootScope.inputBPMJson.policyApplication.policyDetails.policies.splice(index, 1);
    };

     this.applyCustomRate = () => {
            var modalScope = $scope.$new();

            function modalController($scope, $rootScope) {

                $scope.$on('$destroy', function() {
                    console.log('Modal scope should be destroyed.');
                });
            }
            modalController.$inject = ["$scope", "$rootScope"];

            var modalInstance = $uibModal.open({
                animation: 'false',
                templateUrl: 'client/client-entry/client-info/modal/applyCustomRate.html',
                controller: modalController,
                size: 'md',
                //scope: $scope,
                resolve: {

                }
            });

            modalScope.closeDialog = function(value) {
                modalScope.$destroy();
            }

            modalInstance.result.then(function(customRateVars) {
                
                $rootScope.customvalues = {};

                if(customRateVars && customRateVars.instalments &&  customRateVars.baseRate && customRateVars.gross){
                $rootScope.customvalues.instalments = customRateVars.instalments;
                $rootScope.customvalues.baseRate = customRateVars.baseRate;
                $rootScope.customvalues.gross = customRateVars.gross;
                console.log("qweqeq", $rootScope.customvalues);
                $rootScope.calculateCustomPremium();

            }
                //alert($rootScope.isCommercial);
            }, function() {
                //$log.info('Modal dismissed at: ' + new Date());
            });

        };

        $rootScope.calculateCustomPremium = () => {
            if (Number(_this.quote.totalPremium) < Number(_this.quote.deposit)) {

                Notification.error('Less deposit shouldnt be greater than Total premium');
                _this.quote.deposit = 0;

            }

            let quoteJsonStringData = '{"calculateLogicRequest":{"calculatorType":"","premiumValue":0.0,"aprRequest":{},"rateOptions":[]},"DecisionID":"string"}';
            let quoteJsonData = JSON.parse(quoteJsonStringData);

            quoteJsonData.calculateLogicRequest.premiumValue = Number(_this.quote.totalPremium);
            quoteJsonData.calculateLogicRequest.calculatorType = "Quote";

            quoteJsonData.calculateLogicRequest.aprRequest.depositPercent = 0;
            if (this.quote.deposit) {
                quoteJsonData.calculateLogicRequest.aprRequest.depositInSum = Number(this.quote.deposit);
            } else {
                quoteJsonData.calculateLogicRequest.aprRequest.depositInSum = 0.00;

            }

            quoteJsonData.calculateLogicRequest.aprRequest.collectionProfile = 1;
            quoteJsonData.calculateLogicRequest.aprRequest.facilityFee = $rootScope.brokerConfig.fee.facilityFee;
            quoteJsonData.calculateLogicRequest.aprRequest.transFee = $rootScope.brokerConfig.fee.transactionFee;

            //  angular.forEach($rootScope.brokerConfig.brokerRates, function(value, key) {
            this.rateOptions = {};
            this.rateOptions.termInMonths = $rootScope.customvalues.instalments;
            this.rateOptions.netRate = Number($rootScope.customvalues.baseRate);
            this.rateOptions.gross = $rootScope.customvalues.gross;
            this.rateOptions.overriderRate = 0.0;
            //this.rateOptions.overriderRate = Number(_this.quote.financeOption[key].gross) - Number(value.gross);
            //this.rateOptions.overriderRate = $rootScope.customvalues.gross;
            quoteJsonData.calculateLogicRequest.rateOptions.push(this.rateOptions);
            // });


            Meteor.call("getODMQuoteRules", quoteJsonData, function(error, results) {
                console.log("ODM Quote call");

                if (error) {
                    console.log(error);
                } else {
                    let jsonItem = JSON.parse(results.content);
                    console.log("custom odm response",jsonItem);
                    _this.finance.equivalentAPR = jsonItem.calculateLogicResponse.quoteCalculator[0].apr;
                    _this.finance.monthlyPremiumAmount = jsonItem.calculateLogicResponse.quoteCalculator[0].monthlyPremiumAmount;
                    _this.finance.equivalentPAR = jsonItem.calculateLogicResponse.quoteCalculator[0].par;
                    _this.finance.totalInterestPayable = jsonItem.calculateLogicResponse.quoteCalculator[0].totalInterestPayable;
                    _this.finance.totalAmountToRepay = jsonItem.calculateLogicResponse.quoteCalculator[0].totalPayableAmount;
                    _this.finance.totalPremium = Number(_this.quote.totalPremium);
                    _this.finance.term = $rootScope.customvalues.instalments + '';
                    _this.finance.net = $rootScope.customvalues.baseRate;
                    _this.finance.gross = $rootScope.customvalues.gross;
                     $scope.$apply();
                    
                }


            });

            this.selectQuote(null,_this.finance);
             //this.proceedToCustomerDetails();

        };

    $scope.agencyIds = ['543215', '717162'];
      this.selectAgency = () => {
        if($rootScope.isPolicyDetails==true){
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
      this.selectAgency();

     this.populateAddressFields = () => {
       console.log("In");
        console.log($rootScope.quote.newClient.customerAddress);
        var selectedAddress = $rootScope.quote.newClient.customerAddress;
        var arrayAddress = [];
        
        arrayAddress = selectedAddress.split(",");
        console.log(arrayAddress);
        $scope.addressLine1 = ((arrayAddress[0] != " ") ? (arrayAddress[0] + "," ) : ("")) + arrayAddress[1];
        this.quote.newClient.address1 = ((arrayAddress[0] != " ") ? (arrayAddress[0] + "," ) : ("")) + arrayAddress[1];
        $scope.addressLine2 = ((arrayAddress[2] != " ") ? (arrayAddress[2] + "," ) : ("")) + arrayAddress[3];
        this.quote.newClient.address2 = ((arrayAddress[2] != " ") ? (arrayAddress[2] + "," ) : ("")) + arrayAddress[3];
        $scope.addressLine3 =((arrayAddress[4] != " ") ? (arrayAddress[4] + "," ) : ("")) + arrayAddress[5];
        this.quote.newClient.address3 = ((arrayAddress[4] != " ") ? (arrayAddress[4] + "," ) : ("")) + arrayAddress[5];
        $scope.addressLine4 = arrayAddress[6];
        this.quote.newClient.address4 = arrayAddress[6] ;
      }

    this.changeState = function(state) {
        if(state == "newloan") {
          $state.go('onboardcustomer');
        } 
        if(state == "newquote") {
          $state.go('createquote');
        }
      };

    this.Base64 = baseEncode;

    this.helpers({

    });
    this.navHeader = "Homepage > Create a new finance quote for customer";

    this.navHeader1 = "Policy Details";
    this.navHeader2 = "Finance Details";
    this.navHeader3 = "Customer Details";
    this.navHeader4 = "Payment Details";
    this.navHeader5 = "Documentation";

   

    this.isClientDetailsNew = true;


     if($rootScope.customerDetailsTransfer != null){
        this.isQuoteCalculator = true;
        this.isClientDetailsNew = false;
      } else {
        this.isClientDetailsNew = true;
        this.isQuoteCalculator = false;
      }

    //Need to retrived from brokerConfig
    if($rootScope.brokerConfig.brokerAdvancedFees) {
      $rootScope.brokerConfig.fee = {};
      _this.totalFees = 0.00;
      angular.forEach($rootScope.brokerConfig.brokerAdvancedFees, function(value, key) {
                 if(value.feeDescription == 'Facility Fee') {
                   //alert(JSON.stringify(value));
                      angular.forEach(value.feeTiers, function(value, key) {
                            _this.quote.facilityFee = value.feeAmount; //Need to some check for the tiers
                            $rootScope.brokerConfig.fee.facilityFee = _this.quote.facilityFee;
                      }); 
                 }
                 if(value.feeDescription == 'Credit Arrangement Fee') {
                   //alert(JSON.stringify(value));
                      angular.forEach(value.feeTiers, function(value, key) {
                            _this.quote.transactionFee = value.feeAmount; //Need to some check for the tiers
                            $rootScope.brokerConfig.fee.transactionFee = _this.quote.transactionFee;
                      }); 
                 }
      }); 
      _this.totalFees = $rootScope.brokerConfig.fee.facilityFee + $rootScope.brokerConfig.fee.transactionFee;
     
    } else {
      this.quote.facilityFee = 0.00;
      this.quote.transactionFee = 0.00;
       _this.totalFees = 0.00;
    }

   

    this.getAmountToRepay = function() {
        this.quote.amountToRepay =  this.quote.totalFinanceAmount + Number(this.quote.facilityFee);
        if(this.quote.amountToRepay) {
          this.quote.amountToRepay = parseFloat(this.quote.amountToRepay).toFixed(2); 
        }
        return this.quote.amountToRepay;
    };

    this.amountFormatfilter = function($event){
      let keyCode = $event.keyCode|| $event.charCode;
        console.log(keyCode);
      //console.log(String.fromCharCode(keyCode));
        if(isNaN(String.fromCharCode(keyCode)) && keyCode != 8 && keyCode != 46 && keyCode != 37 && keyCode != 39 ){
                    $event.preventDefault();
                }
        };
     
     
     this.amountFormat = function(){
           let n = this.quote.newClient.premiumValue.replace(/[^\d.-]/g, '');
          n = parseFloat(n);
          console.log(n);
          let results = n.toFixed(2).replace(/./g, function(c, i, a) {
          return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
          });
          this.quote.newClient.premiumValue = results;
       };

    this.logout = function() {
      $rootScope.isNotDirectView = false;
         $rootScope.isSearchReturned = false;
         $rootScope.customerDetails = {};
      Meteor.loginFlag = false;
      $state.go('login');
    };

    this.clear=function(){
      this.quote.newClient = "";
    }
    this.reset=function(){
  $rootScope.customerDetails={};
  $rootScope.customerDetails.eMail="";
   $rootScope.quote.newClient.customerAddress="";
    }

    this.proceedToCreditAgreementDetails = function() {
       this.isCreditAgreementDetails = true;
       $rootScope.isPolicyDetails = false;
       this.isCustomerDetails = false;
       $rootScope.isBankDetails = false;
       this.isDocumentation = false;
       this.getFinanceAmount();
       this.getAmountToRepay();
       this.calculatePremium();
    };
    this.proceedToCustomerDetails = function() {
       this.isCustomerDetails = true;
       this.isCreditAgreementDetails = false;
       $rootScope.isPolicyDetails = false;
       $rootScope.isBankDetails = false;
       this.isDocumentation = false;
       $rootScope.isNotDirectView = true;
        
    };
    this.proceedToPaymentDetails = function() {
      console.log("check email: "+$rootScope.customerDetails.customerEmail);
      this.isButtonClicked = false;
      if ( $rootScope.customerDetails.customerEmail &&  $rootScope.customerDetails.customerMobile && $rootScope.customerDetails.customerName && $rootScope.customerDetails.address.postcode && $rootScope.customerDetails.address.addressLine1 && $rootScope.customerDetails.address.addressLine2) {
      this.isButtonClicked = true;      
       createQoute();
      
        $rootScope.backToCust=true;
     }

           // this.isCustomerDetails = false;
           // this.isCreditAgreementDetails = false;
           // $rootScope.isPolicyDetails = false;
           // $rootScope.isBankDetails = true;
           // this.isDocumentation = false;
           // $rootScope.isNotDirectView = false;
    };


    function initialiazeJson(isQuote) {
       if($rootScope.inputBPMJson.policyApplication.policyDetails.policies) {
        
       }
       if(_this.finance != null)
        {
           // alert(JSON.stringify(_this.finance));
            $rootScope.inputBPMJson.policyApplication.finance.net = _this.finance.net;
            $rootScope.inputBPMJson.policyApplication.finance.gross = _this.finance.gross;
            $rootScope.inputBPMJson.policyApplication.finance.apr = _this.finance.equivalentAPR;
            $rootScope.inputBPMJson.policyApplication.finance.term = _this.finance.term;
            $rootScope.inputBPMJson.policyApplication.finance.monthlyPremiumAmount  = _this.finance.monthlyPremiumAmount;
            $rootScope.inputBPMJson.policyApplication.finance.rateReference  = _this.finance.rateReference;
            $rootScope.inputBPMJson.policyApplication.finance.totalPremium   = $rootScope.inputBPMJson.policyApplication.policyDetails.totalPremium;
            $rootScope.inputBPMJson.policyApplication.finance.totalInterestPayable = _this.finance.totalInterestPayable;
            $rootScope.inputBPMJson.policyApplication.finance.totalAmountToRepay = _this.finance.totalAmountToRepay;
            $rootScope.inputBPMJson.policyApplication.finance.deposit = _this.quote.deposit;
            $rootScope.inputBPMJson.policyApplication.finance.par=_this.finance.equivalentPAR;


             //alert(JSON.stringify("Finance" + JSON.stringify($rootScope.inputBPMJson.policyApplication.finance)));
        }
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
                _this.gateDateInFormat($rootScope.customerDetails.dateOfBirth,"YYYY-MM-DD"); 
          } 
         $rootScope.inputBPMJson.policyApplication.customerDetails.clientId = $rootScope.customerDetails.clientId;
         $rootScope.inputBPMJson.policyApplication.customerDetails.organId = $rootScope.customerDetails.organId;
         //alert("clientId" + $rootScope.customerDetails.organId);
         
      }

      if(_this.newClient && !isQuote) {
         $rootScope.inputBPMJson.policyApplication.bankDetails.accountName = _this.quote.newClient.accountName;
         $rootScope.inputBPMJson.policyApplication.bankDetails.sortCode = _this.quote.newClient.sortCode1+_this.quote.newClient.sortCode2+_this.quote.newClient.sortCode3;
         $rootScope.inputBPMJson.policyApplication.bankDetails.accountNumber = _this.quote.newClient.accountNumber;
      }

    }

     this.proceedToDocumentation = function() {    
if($scope.bankForm.$valid){
     initialiazeJson(false);   

     let sortCode = this.quote.newClient.sortCode1 + this.quote.newClient.sortCode2 + this.quote.newClient.sortCode3;
     let accountNumber = this.quote.newClient.accountNumber;

     let accountDetailsJson = {"accountDetails": {"sortCode": sortCode,"accountNumber": accountNumber}}
      Meteor.call("doModulusCheck",accountDetailsJson,function(error, results) 
    {
      if(error) {
         console.log("Error in validation of bank details" + error);
      } else {
       console.log(results);
       //console.log(results.content);
       var isAccountTest;
       Meteor.call("getMeteorSettingVariableValue","isAccountTest",function(error,results1){

             if(error){
             }
             else{
               
               isAccountTest = results1;
               if(isAccountTest){
                   console.log("Here");
                 
                   let parser = new DOMParser();
                   let xmlDoc = parser.parseFromString(results.content,"text/xml"); 
                   console.log(xmlDoc.getElementsByTagName("bank_name")[0].childNodes[0].nodeValue);
                   $rootScope.inputBPMJson.policyApplication.bankDetails.bankName = xmlDoc.getElementsByTagName("bank_name")[0].childNodes[0].nodeValue;
                   $rootScope.inputBPMJson.policyApplication.bankDetails.bankAddress = xmlDoc.getElementsByTagName("bank_address")[0].childNodes[0].nodeValue + ", " + xmlDoc.getElementsByTagName("bank_city")[0].childNodes[0].nodeValue + ", " + xmlDoc.getElementsByTagName("bank_postalcode")[0].childNodes[0].nodeValue;
                   _this.isCustomerDetails = false;
                  _this.isCreditAgreementDetails = false;
                  $rootScope.isPolicyDetails = false;
                  $rootScope.isBankDetails = false;
                  _this.isDocumentation = true;
                  $rootScope.isNotDirectView = false;
                  $scope.$apply();
                 }else{
                   console.log("THere");
                   let jsonResponse = JSON.parse(results.content);
                   if(jsonResponse.accountValidationResponse.passModulusCheck) {
                      _this.isCustomerDetails = false;
                      _this.isCreditAgreementDetails = false;
                      $rootScope.isPolicyDetails = false;
                      $rootScope.isBankDetails = false;
                      _this.isDocumentation = true;
                      $rootScope.isNotDirectView = false;
                      $scope.$apply();
                     } else {
                       if(jsonResponse.accountDetailsValidationStatus.validationSeverity=="Error"){
                        Notification.error(jsonResponse.accountDetailsValidationStatus.validationStatusText);
                      }
                      else{
                      Notification.error(jsonResponse.accountValidationResponse.responseNote);
                    }

                      
                     }
                 }
               }
             });        
           }
       });
}
     };

    this.returnToPolicyDetails = () => {
       this.isCreditAgreementDetails = false;
       $rootScope.isPolicyDetails = true;
       this.isCustomerDetails = false;
       $rootScope.isBankDetails = false;
       this.isDocumentation = false;
    };
    this.backToPayment = () => {
       this.isCreditAgreementDetails = false;
       $rootScope.isPolicyDetails = false;
       this.isCustomerDetails = false;
       this.isDocumentation = false;
       $rootScope.isBankDetails = true;
    };
    this.backToCustomerDetails = () => {
       this.isCreditAgreementDetails = false;
       $rootScope.isPolicyDetails = false;
       this.isCustomerDetails = true;
       $rootScope.isBankDetails = false;
       this.isDocumentation = false;
       this.isButtonClicked = false;
        $rootScope.isNotDirectView = true;
    };
     this.backToFinance = () => {
       this.isCreditAgreementDetails = true;
       $rootScope.isPolicyDetails = false;
       this.isCustomerDetails = false;
       $rootScope.isBankDetails = false;
       this.isDocumentation = false;
       $rootScope.isNotDirectView = false;
       $rootScope.isSearchReturned = false;
    };
     this.backToFinanceCust = () => {
       this.isCreditAgreementDetails = true;
       $rootScope.isPolicyDetails = false;
       this.isCustomerDetails = false;
       $rootScope.isBankDetails = false;
       this.isDocumentation = false;
       $rootScope.isNotDirectView = false;
       $rootScope.isSearchReturned = true;
    };

    this.getFinanceAmount = function() {
      if(this.quote.deposit == undefined){
        this.quote.deposit = "";
      }
      let date = new Date().toISOString().split('T')[0];
      if(this.quote.newClient.policyPremiumDateInput != undefined){
      let rendate=this.quote.newClient.policyPremiumDateInput;
      let modifiedrendate=(rendate).toISOString().split('T')[0];
      if(modifiedrendate < date){
        Notification.error("Please select a future date");
      this.quote.newClient.policyPremiumDateInput=undefined;
      }
  
    }
       this.quote.totalFinanceAmount = this.quote.totalPremium - this.quote.deposit;
       console.log("Total Finance" + this.quote.totalFinanceAmount);
       return this.quote.totalFinanceAmount;
    };

    this.is6MonthsSelected = false;
    this.isQuoteSelected = false;
    this.selectQuote = function(selectedRow,finance) {
      this.isQuoteSelected = true;
      angular.forEach(this.quote.financeOption, function(value, key) {
        if(selectedRow == value.rateReference) {
          _this['is' + value.rateReference] = true;
          _this.finance.term = value.term + '';
          _this.finance.net =value.net;
          _this.finance.gross =value.gross;
          _this.finance.monthlyPremiumAmount = value.monthlyPremiumAmount;
          _this.finance.totalInterestPayable = value.totalInterestPayable;
          _this.finance.totalAmountToRepay = value.totalAmountToRepay;
          _this.finance.equivalentAPR = value.equivalentAPR;
          _this.finance.equivalentPAR = value.equivalentPAR;
          _this.finance.totalPremium = value.totalPremium;
          _this.finance.rateReference = value.rateReference;
         } else {
            _this['is' + value.term + 'MonthsSelected'] = false;
            _this['is' + value.rateReference] = false;

         }
       });

    };

    this.returnToHomePage = () => {
       $rootScope.isNotDirectView = false;
       $rootScope.isSearchReturned = false;
       $rootScope.backToCust=true;
        $rootScope.isBankDetails=false;
       $rootScope.customerDetails = {};
       $state.go("landingpage");
    };

      this.calculatePremium = () => {
        if( Number(_this.quote.totalPremium)  <  Number(_this.quote.deposit)){
          
          Notification.error('Less deposit shouldnt be greater than Total premium');
          _this.quote.deposit =0;

        }

        let quoteJsonStringData = '{"calculateLogicRequest":{"calculatorType":"","premiumValue":0.0,"aprRequest":{},"rateOptions":[]},"DecisionID":"string"}';
        let quoteJsonData =  JSON.parse(quoteJsonStringData);

        quoteJsonData.calculateLogicRequest.premiumValue = Number(_this.quote.totalPremium);
        quoteJsonData.calculateLogicRequest.calculatorType = "Quote";
      
        quoteJsonData.calculateLogicRequest.aprRequest.depositPercent = 0;
        if(this.quote.deposit) {
                 quoteJsonData.calculateLogicRequest.aprRequest.depositInSum = Number(this.quote.deposit);
        } else {
                  quoteJsonData.calculateLogicRequest.aprRequest.depositInSum = 0.00;
  
        }

        quoteJsonData.calculateLogicRequest.aprRequest.collectionProfile = 1;
        quoteJsonData.calculateLogicRequest.aprRequest.facilityFee = $rootScope.brokerConfig.fee.facilityFee;
        quoteJsonData.calculateLogicRequest.aprRequest.transFee = $rootScope.brokerConfig.fee.transactionFee;
        
         angular.forEach($rootScope.brokerConfig.brokerRates, function(value, key) {
              this.rateOptions ={};
              this.rateOptions.termInMonths = value.instalments;
              this.rateOptions.netRate = Number(value.baseRate);
              this.rateOptions.gross =_this.quote.financeOption[key].gross;
              this.rateOptions.overriderRate = 0.0;
              this.rateOptions.overriderRate = Number(_this.quote.financeOption[key].gross) - Number(value.gross);
              quoteJsonData.calculateLogicRequest.rateOptions.push(this.rateOptions);
        });
      

        Meteor.call("getODMQuoteRules",quoteJsonData,function(error, results) 
        {
          console.log("ODM Quote call");
          
                      if(error) 
                      {
                         console.log(error);
                      } 
                      else 
                      {
                            let jsonItem =JSON.parse(results.content);
                            console.log(jsonItem);
                            let calculateLogicResponse = jsonItem.calculateLogicResponse.quoteCalculator;
                            var i= 0;
                            angular.forEach($rootScope.brokerConfig.brokerRates, function(value, key) {
                                var resultsQuote = calculateLogicResponse[i];
                                  _this.quote.financeOption[key].totalInterestPayable = resultsQuote.totalInterestPayable;
                                  _this.quote.financeOption[key].monthlyPremiumAmount = resultsQuote.monthlyPremiumAmount;
                                  _this.quote.financeOption[key].totalAmountToRepay = resultsQuote.totalPayableAmount;
                                  _this.quote.financeOption[key].equivalentAPR = resultsQuote.apr;
                                  _this.quote.financeOption[key].equivalentPAR = resultsQuote.par;
                                i++;
                            });
                            $scope.$apply();
                      }
        });

                                                    
    };

     this.isCompliant = () => {
       let complianceFlag = this.quote.compliance.creditExplainedNo && this.quote.compliance.secciShownNo && this.quote.compliance.racaShownNo && this.quote.newClient.customerName;
       if(!complianceFlag) {
          complianceFlag = false;
       }
       return !complianceFlag;
     }


    this.openCreditAgreementExplanation = () => {
         this.quote.compliance.creditExplainedNo = true;
         $window.open('/creditagreementexplanation', 'Credit Agreement Explanation', 'width=800,height=800');
        
    };

    this.openSECCIDocument = () => {
         // Meteor.call("getEDocs","SecciDocuments","Sample_1469101395355.pdf",function(error, results) {
         //     if(error) { 
         //       console.log(error);
         //      } else {
         //         let file = new Blob([results.content], {type: 'application/pdf'});
         //         let fileURL = URL.createObjectURL(file);
         //         $window.open(fileURL,'SECCI', 'width=700,height=800');
         //       }
         // });
         this.quote.compliance.secciShownNo = true;
         $window.open('/showsecci','SECCI', 'width=800,height=800');
    };

    this.openRACADocument = () => {
         this.quote.compliance.racaShownNo = true;
         $window.open('/showraca','RACA', 'width=800,height=800');
    };
    this.openQuoteSummary = ()=>{

          $window.open('/showquotesummary','quoteTemplate','width=800,height=800')
        };


      this.createESignLink = () => {
         this.isDisabled = true;
         //Not a quote
         //This will convert a quote to loan
         if($rootScope.tokenId == undefined){
          $rootScope.tokenId=$rootScope.customerDetails.transactions[0].id;  
         }
         initiateBPMProcess(false,true);

      };

      function createQoute() {
         //Not a quote
         initialiazeJson(true);
         //This will create a quote 
         initiateBPMProcess(true,false);
      };

      function initiateBPMProcess(isQuote,isConvertToLoan) {
             let jsonBPMString = '{"policyApplication":{"bankDetails":{"accountName":"","sortCode":"","accountNumber":""},"isEsign": "true","isManualUnderwritingReq":"false","isQuote":"false","manualWriterDetails":{"Decision":"","Remark":"","notes": ""},"brokerConfig":{"name":"","brokerId":"","execInitials":"","userId":"","brokerCategory":"","chaseInterval":"10","merchantId":"","isCommercial":"","email":"","mobile":"","chaseNo":"1"},"customerDetails":{"email":"","mobileNumber":"","name":"","premiumRate":"","address":{"addressLine1":"","addressLine2":"","addressLine3":"","addressLine4":"","postcode":""}},"policyDetails":{"totalPremium":"","cumulativeTotal":"","isHighPremium": "","policies":[{"policyNumber":"","insurer":"","cover":"","premiumAmount":""}]},"source":"bluemix","systemID":"GATEWAY","token":"3t3672gdg","isCommercial":"true","financeRate":{"premiumAmount":"","amountPayable":"","costOfCredit":"1","brokerArrangementFee":"0","interestRate":"","aprVariable":"","durationOfAgreement":"2","numberOfMonthlyInstalments":"","rateReference":""}}}';
             let inputBPMJson = JSON.parse(jsonBPMString);
              inputBPMJson.policyApplication.isCommercial= $rootScope.isCommercial;
              inputBPMJson.policyApplication.brokerConfig.execInitials= $rootScope.execInitials;//"rxc";


             
             if(isQuote) {
               inputBPMJson.policyApplication.isQuote = "true";
             }
             //broker
            
             inputBPMJson.policyApplication.brokerConfig.name = $rootScope.brokerConfig.brokerName;
             inputBPMJson.policyApplication.brokerConfig.brokerId = $rootScope.brokerId;
             inputBPMJson.policyApplication.brokerConfig.userId = $rootScope.loggedInUser;
             inputBPMJson.policyApplication.brokerConfig.email = $rootScope.brokerConfig.brokerContactDetails.emailAddress;
             inputBPMJson.policyApplication.brokerConfig.mobile =  $rootScope.brokerConfig.brokerContactDetails.brokerMobile;//not available


             inputBPMJson.policyApplication.brokerConfig.brokerCategory = $rootScope.brokerConfig.brokerCategory;
             if($rootScope.brokerConfig.eSign) {
               inputBPMJson.policyApplication.brokerConfig.chaseInterval =  $rootScope.brokerConfig.eSign.chaseInterval;
               inputBPMJson.policyApplication.brokerConfig.chaseNo =  $rootScope.brokerConfig.eSign.chaseNo;
             }
             if($rootScope.brokerConfig.payment) {
              inputBPMJson.policyApplication.brokerConfig.merchantId =  $rootScope.brokerConfig.payment.merchantId;
             }
            
             console.log(inputBPMJson.policyApplication.brokerConfig);


             //customer
             inputBPMJson.policyApplication.customerDetails.name =  $rootScope.inputBPMJson.policyApplication.customerDetails.customerName;
             inputBPMJson.policyApplication.customerDetails.email = $rootScope.inputBPMJson.policyApplication.customerDetails.customerEmail;
             inputBPMJson.policyApplication.customerDetails.premiumRate = $rootScope.inputBPMJson.policyApplication.customerDetails.premiumRate;
             inputBPMJson.policyApplication.customerDetails.address.addressLine1 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine1;
             inputBPMJson.policyApplication.customerDetails.address.addressLine2 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine2;
             inputBPMJson.policyApplication.customerDetails.address.addressLine3 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine3;
             inputBPMJson.policyApplication.customerDetails.address.addressLine4 = $rootScope.inputBPMJson.policyApplication.customerDetails.address.addressLine4;
              
             inputBPMJson.policyApplication.customerDetails.address.postcode =   $rootScope.inputBPMJson.policyApplication.customerDetails.address.postcode;

             inputBPMJson.policyApplication.customerDetails.companyRegNo = $rootScope.inputBPMJson.policyApplication.customerDetails.companyRegNo;

             inputBPMJson.policyApplication.customerDetails.tradeType = $rootScope.inputBPMJson.policyApplication.customerDetails.traderType.type;

             inputBPMJson.policyApplication.customerDetails.natureOfBusiness = 
                   $rootScope.inputBPMJson.policyApplication.customerDetails.natureOfBusiness.type;
            
             if( $rootScope.customerDetails.dateOfBirth) {
                inputBPMJson.policyApplication.customerDetails.dateOfBirth =
                   _this.gateDateInFormat($rootScope.customerDetails.dateOfBirth,"YYYY-MM-DD"); 
               }   

             // inputBPMJson.policyApplication.customerDetails.tradeType = "TRADER_TYPE_1002";

             // inputBPMJson.policyApplication.customerDetails.natureOfBusiness = 
             //       "BUSINESS_TYPE_1040";

             inputBPMJson.policyApplication.customerDetails.phoneNumber = 
             $rootScope.inputBPMJson.policyApplication.customerDetails.customerPhone;

             inputBPMJson.policyApplication.customerDetails.mobileNumber = 
             $rootScope.inputBPMJson.policyApplication.customerDetails.customerMobile;

             //bank
             if(!isQuote) {
             inputBPMJson.policyApplication.bankDetails.accountName = $rootScope.inputBPMJson.policyApplication.bankDetails.accountName;
             inputBPMJson.policyApplication.bankDetails.accountNumber  = $rootScope.inputBPMJson.policyApplication.bankDetails.accountNumber;
             inputBPMJson.policyApplication.bankDetails.sortCode  = $rootScope.inputBPMJson.policyApplication.bankDetails.sortCode;
             console.log(inputBPMJson.policyApplication.bankDetails);
             }

             //policyDetails
             inputBPMJson.policyApplication.policyDetails  = $rootScope.inputBPMJson.policyApplication.policyDetails;
             //problem with date below as string
             let policyDetailsJson = angular.toJson($rootScope.inputBPMJson.policyApplication.policyDetails);
             let policyDetailsJsonObj = JSON.parse(policyDetailsJson);

             
             inputBPMJson.policyApplication.policyDetails.policies = policyDetailsJsonObj.policies;
             //$rootScope.inputBPMJson.policyApplication.policyDetails.policies = [];
             if(!$rootScope.policies) {
                $rootScope.policies = JSON.parse(JSON.stringify(policyDetailsJsonObj.policies));
              }
             if(_this.isPoliciesModified) { 
               for(var i = 0; i < inputBPMJson.policyApplication.policyDetails.policies.length; i++) {
                    delete inputBPMJson.policyApplication.policyDetails.policies[i]['renewalDateFormatted'];
                    // delete inputBPMJson.policyApplication.policyDetails.policies[i]['isRefundable'];
                    // delete inputBPMJson.policyApplication.policyDetails.policies[i]['isRenewal'];
                    delete inputBPMJson.policyApplication.policyDetails.policies[i]['premiumAmountWithCommas'];
          
                    inputBPMJson.policyApplication.policyDetails.policies[i]['insurer'] = inputBPMJson.policyApplication.policyDetails.policies[i]['insurerTypeCode'];
                    inputBPMJson.policyApplication.policyDetails.policies[i]['cover'] = inputBPMJson.policyApplication.policyDetails.policies[i]['coverTypeCode'];

                    delete inputBPMJson.policyApplication.policyDetails.policies[i]['coverTypeCode'];
                    delete inputBPMJson.policyApplication.policyDetails.policies[i]['insurerTypeCode'];
                    
                    delete $rootScope.policies[i]['renewalDateFormatted'];
                    delete $rootScope.policies[i]['coverTypeCode'];
                    delete $rootScope.policies[i]['insurerTypeCode'];
                    delete $rootScope.policies[i]['premiumAmountWithCommas'];
                }
                _this.isPoliciesModified = false;
              }

            


             //alert(JSON.stringify(policies));
             //$rootScope.inputBPMJson.policyApplication.policyDetails.policies = [];
           // $rootScope.inputBPMJson.policyApplication.policyDetails['policies'] = policies;
           // alert(JSON.stringify( $rootScope.inputBPMJson));


            inputBPMJson.policyApplication.financeRate.premiumAmount = $rootScope.inputBPMJson.policyApplication.finance.monthlyPremiumAmount;
            inputBPMJson.policyApplication.financeRate.amountPayable = $rootScope.inputBPMJson.policyApplication.finance.totalAmountToRepay;
            inputBPMJson.policyApplication.financeRate.netRate = $rootScope.inputBPMJson.policyApplication.finance.net;
            inputBPMJson.policyApplication.financeRate.grossRate = $rootScope.inputBPMJson.policyApplication.finance.gross;
            inputBPMJson.policyApplication.financeRate.aprVariable = $rootScope.inputBPMJson.policyApplication.finance.apr;
            inputBPMJson.policyApplication.financeRate.interestRate=$rootScope.inputBPMJson.policyApplication.finance.par;
            inputBPMJson.policyApplication.financeRate.durationOfAgreement = $rootScope.inputBPMJson.policyApplication.finance.durationOfAgreement;
            inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments = $rootScope.inputBPMJson.policyApplication.finance.term;
            inputBPMJson.policyApplication.financeRate.rateReference = $rootScope.inputBPMJson.policyApplication.finance.rateReference;
            inputBPMJson.policyApplication.financeRate.brokerDepositAmount = $rootScope.inputBPMJson.policyApplication.finance.deposit;
            inputBPMJson.policyApplication.financeRate.totalFees = $rootScope.totalFees;
            inputBPMJson.policyApplication.financeRate.annualFees = "0.00";

              
                       if ($rootScope.customerDetails.transactions &&  $rootScope.customerDetails.transactions[0] && $rootScope.customerDetails.transactions[0].financeDetails) {

                inputBPMJson.policyApplication.financeRate.amountPayable = $rootScope.customerDetails.transactions["0"].financeDetails.totalAmountToRepay;
                inputBPMJson.policyApplication.financeRate.aprVariable = $rootScope.customerDetails.transactions["0"].financeDetails.apr;
                inputBPMJson.policyApplication.financeRate.grossRate = $rootScope.customerDetails.transactions["0"].financeDetails.gross;
                inputBPMJson.policyApplication.financeRate.netRate = $rootScope.customerDetails.transactions["0"].financeDetails.net;
                inputBPMJson.policyApplication.financeRate.numberOfMonthlyInstalments = $rootScope.customerDetails.transactions["0"].financeDetails.term;
                inputBPMJson.policyApplication.financeRate.premiumAmount = $rootScope.customerDetails.transactions["0"].financeDetails.monthlyPremiumAmount;
                inputBPMJson.policyApplication.financeRate.rateReference = $rootScope.customerDetails.transactions["0"].financeDetails.rateReference;
                inputBPMJson.policyApplication.financeRate.brokerDepositAmount = $rootScope.customerDetails.transactions["0"].financeDetails.finance;
                inputBPMJson.policyApplication.financeRate.interestRate=$rootScope.customerDetails.transactions["0"].financeDetails.par;

            }
             
  
             inputBPMJson.policyApplication.isCommercial= $rootScope.isCommercial;
             $rootScope.inputBPMJson.isCommercial = $rootScope.isCommercial


             if(createTransaction($rootScope.inputBPMJson,inputBPMJson,$rootScope.policies,(isQuote?"Quote":"CreditAgreement"),isConvertToLoan)) {
               return true;
             }
      }

      function createTransaction(transactionDetails,inputBPMJson,policies,isQuote,isConvertToLoan) {
           transactionDetails.policyApplication.brokerConfig.brokerId = inputBPMJson.policyApplication.brokerConfig.brokerId;
           transactionDetails.policyApplication.brokerConfig.userId = inputBPMJson.policyApplication.brokerConfig.userId;
           transactionDetails.policyApplication.brokerConfig.name = inputBPMJson.policyApplication.brokerConfig.name;
           
           if($rootScope.tokenId && isConvertToLoan) {
             //while converting quote to loan it is always an existing customer
              delete transactionDetails.policyApplication.finance.par;
              console.log("transactionDetails for update in db",transactionDetails);

             if ($rootScope.customerDetails.transactions &&  $rootScope.customerDetails.transactions[0] && $rootScope.customerDetails.transactions[0].financeDetails) {

                    transactionDetails.policyApplication.finance.totalAmountToRepay = $rootScope.customerDetails.transactions["0"].financeDetails.totalAmountToRepay;
                    transactionDetails.policyApplication.finance.apr = $rootScope.customerDetails.transactions["0"].financeDetails.apr;
                    transactionDetails.policyApplication.finance.gross = $rootScope.customerDetails.transactions["0"].financeDetails.gross;
                    transactionDetails.policyApplication.finance.net = $rootScope.customerDetails.transactions["0"].financeDetails.net;
                    transactionDetails.policyApplication.finance.perAnnumRate=$rootScope.customerDetails.transactions["0"].financeDetails.par;
                    transactionDetails.policyApplication.finance.term = $rootScope.customerDetails.transactions["0"].financeDetails.term;
                    transactionDetails.policyApplication.finance.monthlyPremiumAmount = $rootScope.customerDetails.transactions["0"].financeDetails.monthlyPremiumAmount;
                    transactionDetails.policyApplication.finance.rateReference = $rootScope.customerDetails.transactions["0"].financeDetails.rateReference;
                    transactionDetails.policyApplication.finance.totalPremium = $rootScope.customerDetails.transactions["0"].financeDetails.totalPremium;
                    transactionDetails.policyApplication.finance.totalInterestPayable = $rootScope.customerDetails.transactions["0"].financeDetails.totalInterestPayable;
                    transactionDetails.policyApplication.finance.finance = $rootScope.customerDetails.transactions["0"].financeDetails.finance;
                     delete transactionDetails.policyApplication.finance.par;
                }
              Meteor.call("updateTransaction",$rootScope.tokenId ,transactionDetails,policies,false,function(error, results) {   
                       if(results) {
                         console.log($rootScope.isCommercial);
                         if($rootScope.isCommercial) {
                                   console.log("Initiating finance quote for Commercial");
                                   inputBPMJson.policyApplication.token= $rootScope.tokenId;
                                   inputBPMJson.policyApplication.isCommercial = "true";
                         } else {
                                   console.log("Initiating finance quote for Commercial");
                                   inputBPMJson.policyApplication.token= $rootScope.tokenId;
                                   inputBPMJson.policyApplication.isCommercial = "false";
                         }
                       }
                        $rootScope.basicHeader = "Basic c3BpbGxhaUBwcm9saWZpY3MuY29tOnBhc3N3b3JkMTM1";
                        let authenticationHeader = $rootScope.basicHeader;
                        let token = results;  
                                        
                        inputBPMJson.policyApplication.financeRate.amountPayable = inputBPMJson.policyApplication.financeRate.amountPayable.toString();
                        inputBPMJson.policyApplication.financeRate.aprVariable = inputBPMJson.policyApplication.financeRate.aprVariable.toString();


                        console.log("jsonnn to sendmsg",JSON.stringify(inputBPMJson));
                        Meteor.call("sendMessage",authenticationHeader,inputBPMJson, $rootScope.quoteRef,function(error, results) {   
                               if (results) {                                     
                                      Meteor.call("updateTransactionDetails",$rootScope.tokenId,$rootScope.quoteRef,isQuote,function(error, results) {  
                                          if(results) {
                                            $rootScope.isEsignLinkSent = true;
                                            $state.go('esignmessage');
                                            $rootScope.quoteRef = "";
                                            $rootScope.inputBPMJson.policyApplication.bankDetails.accountName="";
                                            $rootScope.inputBPMJson.policyApplication.bankDetails.accountNumber="";
                                            $rootScope.inputBPMJson.policyApplication.bankDetails.sortCode="";

                                          } else {
                                            console.log("Error in updating quote");
                                          }
                                      });
                               } else {
                                    console.log("Error in creating quote");
                               }

                        });


                          return true; 
                });

            } else {
              transactionDetails.policyApplication.finance.perAnnumRate=transactionDetails.policyApplication.finance.par;
              delete transactionDetails.policyApplication.finance.par;
              Meteor.call("saveTransactionDetails",transactionDetails,policies,function(error, results) {   
                       if(results) {
                         console.log($rootScope.isCommercial);
                         if($rootScope.isCommercial) {
                                   console.log("Initiating finance quote for Commercial");
                                   inputBPMJson.policyApplication.token= results;
                                   inputBPMJson.policyApplication.isCommercial = "true";
                         } else {
                                   console.log("Initiating finance quote for Commercial");
                                   inputBPMJson.policyApplication.token=   results;
                                   inputBPMJson.policyApplication.isCommercial = "false";
                         }
                         //alert(JSON.stringify(inputBPMJson));
                         $rootScope.tokenId = results;
                       }
                        $rootScope.basicHeader = "Basic c3BpbGxhaUBwcm9saWZpY3MuY29tOnBhc3N3b3JkMTM1";
                        let authenticationHeader = $rootScope.basicHeader;
                        let token = results;
                        // inputBPMJson = {"policyApplication":{"bankDetails":{"accountName":"sarath","sortCode":"123-2323-23","accountNumber":"3244"},"isEsign":"true","isManualUnderwritingReq":"false","isQuote":"false","manualWriterDetails":{"Decision":"","Remark":"","notes":""},"brokerConfig":{"name":"Jelf insurance services","brokerId":"Rash","userId":"JLF-1","brokerCategory":"","chaseInterval":"1","merchantId":"","isCommercial":"","email":"spillai@prolifics.com","mobile":"7703186192","chaseNo":"1"},"customerDetails":{"email":"Rashmi.srivastava@prolifics.com","mobileNumber":"7703186192","name":"Ford Consulting Ltd","premiumRate":"3334","address":{"addressLine1":"32443","addressLine2":"32434","addressLine3":"3244","addressLine4":"234234","postcode":"RG16QX`"}},"policyDetails":{"totalPremium":5000,"cumulativeTotal":"","isHighPremium":"false","policies":[{"policyNumber":"Pol1","insurer":"Ace European Group Limited", "cover":"Building Industry","premiumAmount":60,"renewalDate":"2016-08-18"},{"policyNumber":"Pol2","insurer":"Ace European Group Limited","cover":"Building Industry","premiumAmount":40,"renewalDate":"2016-08-09"}]},"source":"bluemix","token":"3t3672gdg","isCommercial":"true","financeRate":{"premiumAmount":"3400","amountPayable":"12333","costOfCredit":"1","brokerArrangementFee":"23","interestRate":"11","aprVariable":"12","durationOfAgreement":"2","numberOfMonthlyInstalments":"3"}}};
                        
                        inputBPMJson.policyApplication.financeRate.amountPayable = inputBPMJson.policyApplication.financeRate.amountPayable.toString();
                        inputBPMJson.policyApplication.financeRate.aprVariable = inputBPMJson.policyApplication.financeRate.aprVariable.toString();


                        //alert(JSON.stringify(inputBPMJson));
                         Meteor.call("startProcess",authenticationHeader,JSON.stringify(inputBPMJson),function(error, results) {   
                               if (results) {
                                      let arr = JSON.parse(results.content).data.data.responseText.split(".");
                                      let instanceCreated = arr[1];
                                      if(isQuote) {
                                         Notification.info('Quote Saved: ' + instanceCreated);
                                           _this.isCustomerDetails = false;
                                           _this.isCreditAgreementDetails = false;
                                           $rootScope.isPolicyDetails = false;
                                           $rootScope.isBankDetails = true;
                                           _this.isDocumentation = false;
                                            $rootScope.isNotDirectView = false;
                                            //QuoteRef is required in rootScope,if instantly converted to loan using next
                                            $rootScope.quoteRef = instanceCreated;
                                      } else {
                                            Notification.info('Credit Agreement Ref: ' + instanceCreated);
                                            $rootScope.isEsignLinkSent = true;
                                            $state.go('esignmessage');
                                            $rootScope.quoteRef = "";
                                      } 
                               } else {
                                    console.log("Error in creating quote");
                               }

                            });


                          return true; 
                });
            }
       }

      function pad(s) { return (s < 10) ? '0' + s : s; }
     

  }

}
export default angular.module('createQuote', [
  angularMeteor
  ])
.directive('onlydigits', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}) 
.component('createQuote', {
  templateUrl: 'client/client-entry/create-quote/create-quote.html',
  controller: ['$scope','$rootScope','$http','$state','$document','$reactive','$window','$uibModal','Notification','baseEncode', CreateQuoteCtrl]
});

