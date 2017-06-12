import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Promise } from 'meteor/promise';

import clientInfo from '../../client/client-entry/client-info/client-info.component.js';


describe('Unit Test functionalities in client info component', function () {
	//var startURL;
	 var element;
	 var controller;
	 var spyMeteorCall;
	 var $compile;
     var $rootScope; 

	    beforeEach(function() {
		   spyMeteorCall = sinon.stub(Meteor,'call');
		   var xmlDataLowPremiumMock = '<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>2233.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>false</HighPremium></par:premiumType>' +
                       '</par:Request>';

		   spyMeteorCall.withArgs('getODMRules', xmlDataLowPremiumMock).returns(xmlDataLowPremiumMock);

		   var xmlDataHighPremiumMock = '<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>23423423424.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>false</HighPremium></par:premiumType>' +
                       '</par:Request>';

           var highPremiumMockResponse = '<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>23423423424.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>true</HighPremium></par:premiumType>' +
                       '</par:Request>'            

		   spyMeteorCall.withArgs('getODMRules', xmlDataHighPremiumMock).returns(highPremiumMockResponse);
		 
		    window.module('ui.router');
		    window.module('ui-notification');
		    window.module(clientInfo.name);
		 
		    inject(function(_$compile_, _$rootScope_,_$http_,_$state_,_$document_,_$reactive_,_Notification_){
		      $compile = _$compile_;
		      $rootScope = _$rootScope_;
		    });
		 
		    element = $compile('<client-info></client-info>')($rootScope.$new(true));
		    $rootScope.$digest();
		    //alert(element.innerHTML);

		    controller = element.controller('clientInfo');

	    	

	    });

	    afterEach(() => {
          Meteor.call.restore();
        });

	  

	    it('Verify CheckODMRules component returns low premium flag in response for lower premium input message', function() {
           
            var xmlData = '<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>2233.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>false</HighPremium></par:premiumType>' +
                       '</par:Request>';

            controller.checkODMRules(xmlData);          
        

            sinon.assert.calledOnce(Meteor.call);           

            sinon.assert.calledWith(Meteor.call, 'getODMRules', xmlData);

             assert.equal(spyMeteorCall.args[0][0],'getODMRules');
             assert.equal(spyMeteorCall.args[0][1],xmlData);

             assert.isTrue(spyMeteorCall.alwaysReturned('<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>2233.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>false</HighPremium></par:premiumType>' +
                       '</par:Request>'));

             //console.log(spyMeteorCall.returnValues);

                   
        });

        it('Verify CheckODMRules component returns high premium flag in response for high premium input message', function() {
           
            var xmlData = '<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>23423423424.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>false</HighPremium></par:premiumType>' +
                       '</par:Request>';

            controller.checkODMRules(xmlData);          
        
            sinon.assert.calledOnce(Meteor.call);           

            sinon.assert.calledWith(Meteor.call, 'getODMRules', xmlData);

             assert.equal(spyMeteorCall.args[0][0],'getODMRules');
             assert.equal(spyMeteorCall.args[0][1],xmlData);

             assert.isTrue(spyMeteorCall.alwaysReturned('<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>23423423424.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>true</HighPremium></par:premiumType>' +
                       '</par:Request>'));

             //console.log(spyMeteorCall.returnValues);

                   
        });
	});