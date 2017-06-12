import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { expect } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import 'meteor/practicalmeteor:sinon';
import '../../server/rest-api.js'
//import loginView from '../../client/authentication/login/login-view.component.js';

if (Meteor.isServer) {

  describe('Verify Rest API Calls', () => {

    describe('ODM Rest Call Scenarios', () => {
      const inputHighPremiumXML = '<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>23423423424.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>false</HighPremium></par:premiumType>' +
                       '</par:Request>';

      const inputLowPremiumXML = '<par:Request xmlns:par="http://www.ibm.com/rules/decisionservice/HighPremiumPolicyDecision/CheckHighPremium/param"><par:DecisionID>string</par:DecisionID>' +
          '<par:PolicyDetails><BrokerType>gold</BrokerType><premiumValue>21.00</premiumValue></par:PolicyDetails>' +
            '<par:premiumType><HighPremium>false</HighPremium></par:premiumType>' +
                       '</par:Request>';                 

      it('ODM Rest Call - Returns High Premium Flag in response based on the input data',function() {
      	 let actualResponse = Meteor.call("getODMRules",inputHighPremiumXML);
      	 //console.log(actualResponse);
      	 assert.equal(actualResponse.statusCode,'200');
      	 assert.notEqual(inputHighPremiumXML,actualResponse.content);
      	 expect(actualResponse.content).to.contain('<HighPremium>true</HighPremium>');
      });

      it('ODM Rest Call - Returns Low Premium Flag in response based on the input data',function() {
      	 let actualResponse = Meteor.call("getODMRules",inputLowPremiumXML);
      	 //console.log(actualResponse);
      	 assert.equal(actualResponse.statusCode,'200');
      	  assert.notEqual(inputHighPremiumXML,actualResponse.content); //there are /n charcters in response
      	 expect(actualResponse.content).to.contain('<HighPremium>false</HighPremium>');
      });

   });

  });

}