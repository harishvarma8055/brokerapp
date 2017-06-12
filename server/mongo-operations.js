
Meteor.methods({
        updateChartsData: function (token,docuSignStatus) {
             BrokerDetails.update({_id: token},{$set: {status:docuSignStatus,updatedDate:new Date()}}); 
             console.log(token);
             var record  = BrokerDetails.findOne({"_id":token});
             console.log(record.instanceId);
             return record.instanceId;
     },
        retrieveCollection: function (token){
            var record  = TransactionDetails.findOne({"_id":token});
             console.log(record);
             return record;
        },
        getBrokerSettings: function (username){
            var record  = BrokerSettings.findOne({"username":username});
             console.log(record);
             return record;
        },
        getBrokerConfig: function (brokerId) {
            console.log(brokerId);
            var record  = BrokerReference.findOne({"_id":brokerId.toUpperCase()});
            console.log("Broker Config : " + JSON.stringify(record));
            return record;


                // const Cloudant = require('cloudant');
                // var account;
                // var password;
                // brokerId = brokerId.toLowerCase();

                // if(process.env.VCAP_SERVICES) {
                //     var env = JSON.parse(process.env.VCAP_SERVICES);
                //     const credentials = env['cloudantNoSQLDB'][0]['credentials'];
                //      account =  credentials.username;
                //      password = credentials.password;
                // } else {
                //      //Commited code should n't connect to cloudant without VCAP,local testing uncomment the below
                //      account = '634bbb96-af19-42c5-ae78-10571ac1c165-bluemix'; // Set this to your own account
                //      password = 'fbf0ae362c65afbb9c1af49c2b2eec9edf8c3f6c18eccf9a6109b4e00bb200ef';
                // }

                // const cloudant = Cloudant({account:account, password:password});
                // let brokerdb = cloudant.db.use('brokerdb');

                // var promise = new Promise(function(resolve, reject) {
                //     brokerdb.find({selector:{brokerId:brokerId}},function(err, results) {
                //         if(err) {
                //             console.log("Retrieving broker config - Error" + err);
                //             reject(err);
                //         } else {
                //             resolve(results.docs[0]);
                //         }
                //      });
                //  });
                // console.log(promise);
                // return promise;

        },
        getFinanceDetails: function (token) {
             console.log(token);
             var record  = FinanceDetails.findOne({"_id":token});
              console.log("record" + record);
             return record;
         },
         saveCustomerDetails: function (customerRecord) {
            customerRecord.createdTime = new Date();
            var promise = new Promise(function(resolve, reject) {
                 CustomerDetails.insert(customerRecord, 
                    function(err,docsInserted) {
                        if(err) {
                            console.log("Error in saving customer record : " + customerRecord);
                            reject(err);
                        } else {
                            console.log("Inserted customer record : " + customerRecord);
                            resolve(docsInserted);
                        }
                      });
             });
             console.log(promise);
             return promise;
         },
         saveTransactionDetails: function (transactionDetails,policies) {

            console.log("transactionDetails" + JSON.stringify(transactionDetails));
            var bankDetails = transactionDetails.policyApplication.bankDetails;
            if(bankDetails && !bankDetails.bankName) {
                bankDetails.bankName = "";    
            }
            if(bankDetails && !bankDetails.bankAddress) {
                bankDetails.bankAddress = "";    
            }
            var financeDetails = transactionDetails.policyApplication.finance;
            var customerDetails = transactionDetails.policyApplication.customerDetails;
            customerDetails
            var policyDetails;
            if(transactionDetails.policyApplication.policyDetails) {
               policyDetails = policies;//transactionDetails.policyApplication.policyDetails.policies;
               console.log(JSON.stringify(policyDetails));
            }

            console.log("customer details" + customerDetails);

            if(!customerDetails.clientId)
                customerDetails.clientId = "";
            if(!customerDetails.organId)
                 customerDetails.organId = "";
            customerDetails.brokerId = transactionDetails.policyApplication.brokerConfig.brokerId;
            customerDetails.createdBy = transactionDetails.policyApplication.brokerConfig.userId;
            var custRef = CustomerDetails.insert(customerDetails);

            console.log("custRef" + custRef);

            var complianceDetails = {};
            if(bankDetails) {
                complianceDetails = {"creditAgreementExplained":{"isShown":false,"shownBy":"","shownDate":""},
                                         "raccaShown":{"isShown":false,"shownBy":"","shownDate":""},
                                         "SecciShown" :{"isShown":false,"shownBy":"","shownDate":""}
                                          };
            }                              

            var transactionRecord = {"bankDetails":bankDetails,"policies":policyDetails,"brokerId":transactionDetails.policyApplication.brokerConfig.brokerId,"brokerName":transactionDetails.policyApplication.brokerConfig.name,"createdBy":transactionDetails.policyApplication.brokerConfig.userId,"createdTime":new Date(),"custRef":custRef,"clientId":customerDetails.clientId,"organId":customerDetails.organId,"financeDetails":financeDetails,"complianceDetails":complianceDetails,"isWetSign":"","transactionRef":"","loanRef":"","lastUpdatedBy" : "","lastUpdatedTime" : "","transactionType": "","paymentVia" : transactionDetails.policyApplication.paymentVia,"paymentAmount" : transactionDetails.policyApplication.paymentAmount,"paymentSchedule" :[],"envelopId":"","racaDocumentRef":"","isCommercial":transactionDetails.policyApplication.isCommercial,"payment":[]};
   
            var promise = new Promise(function(resolve, reject) {
                 TransactionDetails.insert(transactionRecord, 
                    function(err,docsInserted) {
                        if(err) {
                            console.log("Error in transactionRecord customer record : " + transactionDetails);
                            reject(err);
                        } else {
                            console.log("Inserted transactionRecord record : " + transactionDetails);
                            resolve(docsInserted);
                        }
                     });
             });
             console.log(promise);
             return promise;
         },
         updateTransactionDetails: function (token,instanceId,transactionType) {
            TransactionDetails.update({"_id":token},{$set:{"transactionRef":instanceId,"transactionType":transactionType}});  
            return true;
         },
         updateTransaction: function (token,transactionDetails,policies,isNewCustomer) {
           // TransactionDetails.update({"_id":token},{$set:bankDetails});
            console.log("updating transactionDetails" + JSON.stringify(transactionDetails));
            console.log("updating policyDetails" + JSON.stringify(policies));
            var bankDetails = transactionDetails.policyApplication.bankDetails;

            if(bankDetails && !bankDetails.bankName) {
                bankDetails.bankName = "";    
            }
            if(bankDetails && !bankDetails.bankAddress) {
                bankDetails.bankAddress = "";    
            }

            var financeDetails = transactionDetails.policyApplication.finance;
            var customerDetails = transactionDetails.policyApplication.customerDetails;

            var policyDetails;

            if(transactionDetails.policyApplication.policyDetails) {
               policyDetails = policies//transactionDetails.policyApplication.policyDetails.policies;
            }

            console.log("customer details" + customerDetails);

            if(!customerDetails.clientId)
                customerDetails.clientId = "";
            if(!customerDetails.organId)
                 customerDetails.organId = "";
            var custRef = "";
                if(isNewCustomer) {
                   customerDetails.brokerId = transactionDetails.policyApplication.brokerConfig.brokerId;
                   customerDetails.createdBy = transactionDetails.policyApplication.brokerConfig.userId;   
                  custRef = CustomerDetails.insert(customerDetails); 
                } else {
                    custRef = TransactionDetails.findOne({"_id":token}).custRef;
                    CustomerDetails.update({"_id":token},{$set:customerDetails}); 
                }
                
            var complianceDetails = {"creditAgreementExplained":{"isShown":false,"shownBy":"","shownDate":""},
                                         "raccaShown":{"isShown":false,"shownBy":"","shownDate":""},
                                         "SecciShown" :{"isShown":false,"shownBy":"","shownDate":""}
                                          };

           var transactionRecord = {"bankDetails":bankDetails,"policies":policyDetails,"brokerId":transactionDetails.policyApplication.brokerConfig.brokerId,"brokerName":transactionDetails.policyApplication.brokerConfig.name,"createdBy":transactionDetails.policyApplication.brokerConfig.userId,"custRef":custRef,"clientId":customerDetails.clientId,"organId":customerDetails.organId,"financeDetails":financeDetails,"complianceDetails":complianceDetails,"isWetSign":"","transactionRef":"","loanRef":"","lastUpdatedBy" : "","lastUpdatedTime" : "","transactionType": "","paymentVia" : "","paymentAmount" : "","paymentSchedule" :[],"envelopId":"","racaDocumentRef":"","isCommercial":"","payment":[]};

           transactionRecord.isCommercial = transactionDetails.isCommercial;

            TransactionDetails.update({"_id":token},{$set:transactionRecord});
            return true;
         }


});