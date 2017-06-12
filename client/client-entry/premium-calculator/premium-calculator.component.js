
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './premium-calculator.html';

import 'angular-component';

class PremiumCalculatorCtrl {
  constructor($scope,$rootScope,$http,$state,$document,$reactive,$window,$uibModal,Notification,baseEncode) {
  

  
    $rootScope.fromNewQuote = false;

    
     let _this = this;


     this.quoteDetails = {}; //for holding the actual collection
     this.quote = {};

     this.quote.compliance = {};
     _this.finance = {};
     this.quote.newClient={};


     this.quote.totalPremium = 0.00;

     this.quote.financeOption = [{}];                         

     if($rootScope.brokerConfig.brokerRates) {  
           angular.forEach($rootScope.brokerConfig.brokerRates, function(value, key) {
               let grossRate = 0.0;
                 value.baseRate = parseFloat(Math.round(value.baseRate * 10) / 10).toFixed(1)
                 if(value.baseRate && !isNaN(value.electedOverrider)) {
                     grossRate = value.baseRate + value.electedOverrider;
                     grossRate = parseFloat(Math.round(grossRate * 10) / 10).toFixed(1);
                 }
              _this.quote.financeOption[key] = {"term":value.instalments,"net":value.baseRate,"gross":grossRate,"monthlyPremiumAmount":"0.00","totalInterestPayable":"0.00","totalAmountToRepay":"0.00","equivalentAPR":"0.0","equivalentPAR":"0.0"};                    
           }); 
    } 


    //Need to retrived from brokerConfig
    if($rootScope.brokerConfig.brokerAdvancedFees) {
      $rootScope.brokerConfig.fee = {};
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
     
    } else {
      this.quote.facilityFee = 0.00;
      this.quote.transactionFee = 0.00;
    }           


      this.calculatePremium = () => {

        if(!_this.quote.totalPremium) {
          _this.quote.totalPremium = 0;
        }
         
        let quoteJsonStringData = '{"calculateLogicRequest":{"calculatorType":"","premiumValue":0.0,"aprRequest":{},"rateOptions":[]},"DecisionID":"string"}';
        let quoteJsonData =  JSON.parse(quoteJsonStringData);

        quoteJsonData.calculateLogicRequest.premiumValue = Number(_this.quote.totalPremium);
        quoteJsonData.calculateLogicRequest.calculatorType = "Quote";
      
        quoteJsonData.calculateLogicRequest.aprRequest.depositPercent = 0;
        quoteJsonData.calculateLogicRequest.aprRequest.depositInSum = 0.0;
        quoteJsonData.calculateLogicRequest.aprRequest.facilityFee = $rootScope.brokerConfig.fee.facilityFee;
        quoteJsonData.calculateLogicRequest.aprRequest.transFee = $rootScope.brokerConfig.fee.transactionFee;
        quoteJsonData.calculateLogicRequest.aprRequest.collectionProfile = 1;


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
                         var i= 0;
                         angular.forEach($rootScope.brokerConfig.brokerRates, function(value, key) {
                                var resultsQuote = calculateLogicResponse[i];
                                _this.quote.financeOption[key].totalInterestPayable = "0.00";
                                _this.quote.financeOption[key].monthlyPremiumAmount = "0.00";
                                _this.quote.financeOption[key].totalAmountToRepay = "0.00";
                                _this.quote.financeOption[key].equivalentAPR = "0.0";
                                 _this.quote.financeOption[key].equivalentPAR = "0.0";
                                i++;
                            });
                         console.log(error);
                      } 
                      else 
                      {
                          if(results) {
                            let jsonItem =JSON.parse(results.content);
                            console.log(jsonItem);
                            let calculateLogicResponse = jsonItem.calculateLogicResponse.quoteCalculator;
                            var i= 0;
                                if(jsonItem.validationStatus.validationStatusText == "Success") {
                                    angular.forEach($rootScope.brokerConfig.brokerRates, function(value, key) {
                                        var resultsQuote = calculateLogicResponse[i];
                                       
                                        _this.quote.financeOption[key].totalInterestPayable = resultsQuote.totalInterestPayable;
                                        _this.quote.financeOption[key].monthlyPremiumAmount = resultsQuote.monthlyPremiumAmount;
                                        _this.quote.financeOption[key].totalAmountToRepay = resultsQuote.totalPayableAmount;
                                        _this.quote.financeOption[key].equivalentAPR = resultsQuote.apr;
                                        _this.quote.financeOption[key].equivalentPAR = resultsQuote.par;
                                        i++;
                                    
                                    });
                                } else {
                                   angular.forEach($rootScope.brokerConfig.brokerRates, function(value, key) {
                                    _this.quote.financeOption[key].totalInterestPayable = "0.00";
                                    _this.quote.financeOption[key].monthlyPremiumAmount = "0.00";
                                    _this.quote.financeOption[key].totalAmountToRepay = "0.00";
                                    _this.quote.financeOption[key].equivalentAPR = "0.0";
                                     _this.quote.financeOption[key].equivalentPAR = "0.0";
                                    i++;
                                     });
                                }
                                    $scope.$apply();
                                } else {
                                  var i= 0;
                                  angular.forEach($rootScope.brokerConfig.rates, function(value, key) {
                                      var resultsQuote = calculateLogicResponse[i];
                                      if(resultsQuote.term == value.term)
                                      _this.quote.financeOption[key].totalInterestPayable = "0.00";
                                      _this.quote.financeOption[key].monthlyPremiumAmount = "0.00";
                                      _this.quote.financeOption[key].totalAmountToRepay = "0.00";
                                      _this.quote.financeOption[key].equivalentAPR = "0.0";
                                       _this.quote.financeOption[key].equivalentPAR = "0.0";
                                      i++;
                                  });
                                  $scope.$apply();

                            }
                      }
        });

                                                    
    };                      

    $scope.viewModel(this);

    this.Base64 = baseEncode;

    this.helpers({

    });
    this.navHeader = "Homepage > Premium finance calculator";

    this.logout = function() {
      Meteor.loginFlag = false;
      $state.go('login');
    };
   
   
    this.returnToHomePage = () => {
       $state.go("landingpage");
    };


  }

}
export default angular.module('premiumCalculator', [
  angularMeteor
  ])
.component('premiumCalculator', {
  templateUrl: 'client/client-entry/premium-calculator/premium-calculator.html',
  controller: ['$scope','$rootScope','$http','$state','$document','$reactive','$window','$uibModal','Notification','baseEncode', PremiumCalculatorCtrl]
});

