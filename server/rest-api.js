var credentials = ""
if(process.env && process.env.VCAP_SERVICES) {
  var env = JSON.parse(process.env.VCAP_SERVICES);
  if(env['user-provided']) {
     credentials = env['user-provided'][0]['credentials'];
  } else {
     credentials = Meteor.settings;
  }
} else {
     credentials = Meteor.settings;
}
Meteor.methods({      
        getAllInstancesForProcess: function (accessToken) {
            console.log("Server Log before rest call" + accessToken);
            var response = Meteor.http.call("GET", credentials.bpmURL + "/rest/bpm/wle/v1/tasks/query/IBM.DEFAULTALLTASKSLIST_75?processAppName=CloseBrotherPolicy",
                {
    npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
          headers: {
            'Authorization': accessToken
        }
            });
             console.log("Server Response" + response);
             return response;
        },getExposedProcesses: function (accessToken) {
            //console.log("Server Log before rest call" + accessToken);
            var response = Meteor.http.call("GET", credentials.bpmURL + "/rest/bpm/wle/v1/exposed/process",
                {
    npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
          headers: {
            'Authorization': accessToken
        }
            });
             console.log("Server Response" + response);
             return response;
        },
        startProcess: function (accessToken,detailsJson) {
            console.log(credentials.bpmAbsoluteURL + credentials.startBPMProcessURL + "&params=" + detailsJson);
            console.log(detailsJson);
            let response =  Meteor.http.call("POST",  credentials.bpmAbsoluteURL + credentials.startBPMProcessURL + "&params=" + detailsJson,
                {
            npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
            headers: {
            'Authorization': credentials.commonBPMCredential
             }
            });
            console.log(response);
            return response;
        },
        sendMessage: function (accessToken,detailsJson,quoteRef) {
           console.log("detailsJson" + detailsJson)
           console.log("quoteRef" + quoteRef);
           console.log("detailsJson" + JSON.stringify(detailsJson));

            console.log("ISCOMMERCIAL " + detailsJson.policyApplication.isCommercial);

           // if(detailsJson.policyApplication.isCommercial) {
           //    detailsJson.policyApplication.isCommercial = "true";
           //  } else{
           //    detailsJson.policyApplication.isCommercial = "false";
           //  }

           console.log("Sending Message in process app : " + credentials.processAppName)

           let xmlMessage = '<eventmsg><event processApp="'+ credentials.processAppName +'" ucaname="QuoteToLoanConversionUCA">QuoteToLoanConversionUCA</event><parameters><parameter><key>policyInstanceID</key><value>' +quoteRef + '</value></parameter><parameter><key>policyApplication</key><value><bankDetails><accountName type="String">' +detailsJson.policyApplication.bankDetails.accountName + '</accountName><sortCode type="String">' + detailsJson.policyApplication.bankDetails.sortCode + '</sortCode><accountNumber type="String">'  + detailsJson.policyApplication.bankDetails.accountNumber + '</accountNumber></bankDetails><customerDetails><address><postcode type="String">'+ detailsJson.policyApplication.customerDetails.address.postcode + '</postcode><addressLine1 type="String">'+ detailsJson.policyApplication.customerDetails.address.addressline1 + '</addressLine1><addressLine2 type="String">'+ detailsJson.policyApplication.customerDetails.address.addressline2 + '</addressLine2><addressLine3 type="String">'+ detailsJson.policyApplication.customerDetails.address.addressline3 + '</addressLine3><addressLine4 type="String">'+ detailsJson.policyApplication.customerDetails.address.addressLine4 + '</addressLine4></address><email type="String">' + detailsJson.policyApplication.customerDetails.email+ '</email><mobileNumber type="String">' + detailsJson.policyApplication.customerDetails.mobileNumber+ '</mobileNumber><name type="String">'+ detailsJson.policyApplication.customerDetails.name+'</name><natureOfBusiness type="String">'+ detailsJson.policyApplication.customerDetails.natureOfBusiness+'</natureOfBusiness><phoneNumber type="String">'+ detailsJson.policyApplication.customerDetails.phoneNumber+'</phoneNumber><premiumRate type="String">0</premiumRate><tradeType type="String">'+ detailsJson.policyApplication.customerDetails.tradeType+'</tradeType></customerDetails><policyDetails><cumulativeTotal type="String"></cumulativeTotal><isHighPremium type="Boolean">'+ detailsJson.policyApplication.isHighPremium+'</isHighPremium></policyDetails><brokerConfig><name type="String">'+ detailsJson.policyApplication.brokerConfig.name+'</name> <brokerId type="String">'+ detailsJson.policyApplication.brokerConfig.brokerId+'</brokerId><userId type="String"></userId><brokerCategory type="String">'+ detailsJson.policyApplication.brokerConfig.brokerCategory+'</brokerCategory><chaseInterval type="String">'+ detailsJson.policyApplication.brokerConfig.chaseInterval+'</chaseInterval><merchantId type="String">'+ detailsJson.policyApplication.brokerConfig.merchantId+'</merchantId><isCommercial type="String">'+ detailsJson.policyApplication.isCommercial+'</isCommercial><email type="String">'+ detailsJson.policyApplication.brokerConfig.email+'</email><mobile type="String">'+ detailsJson.policyApplication.brokerConfig.mobile+'</mobile></brokerConfig><financeRate><premiumAmount type="Decimal">'+ detailsJson.policyApplication.financeRate.premiumAmount+'</premiumAmount><amountPayable type="String">'+ detailsJson.policyApplication.financeRate.amountPayable+'</amountPayable><costOfCredit type="String">'+ detailsJson.policyApplication.financeRate.costOfCredit+'</costOfCredit><brokerArrangementFee type="String">'+ detailsJson.policyApplication.financeRate.brokerArrangementFee+'</brokerArrangementFee><interestRate type="String">'+ detailsJson.policyApplication.financeRate.interestRate+'</interestRate><aprVariable type="String">'+ detailsJson.policyApplication.financeRate.aprVariable+'</aprVariable><numberOfMonthlyInstalments type="String">'+ detailsJson.policyApplication.financeRate.numberOfMonthlyInstalments+'</numberOfMonthlyInstalments></financeRate><isManualUnderwritingReq type="String">'+ detailsJson.policyApplication.financeRate.isManualUnderwritingReq+'</isManualUnderwritingReq><isCommercial type="String">'+ detailsJson.policyApplication.isCommercial+'</isCommercial><token type="String">'+ detailsJson.policyApplication.token+'</token><source type="String">'+ detailsJson.policyApplication.source+'</source></value></parameter></parameters></eventmsg>';

            console.log(xmlMessage);

           var sendFlag = "";
           try {
            sendFlag = Meteor.http.call("POST",  credentials.bpmURL + "/rest/bpm/wle/v1/process?action=sendMessage" + "&message=" + xmlMessage,
                {
    npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
          headers: {
            'Authorization':credentials.commonBPMCredential
        }
            });
            } catch(e) {
    console.log("custom error" + e);
                console.log("sendFlag" + sendFlag);
    
      }
             return sendFlag ;
        },
        getAddresses: function (postCode) {
            console.log(credentials.apicURL + "/" + credentials.testCatalog + "/" + credentials.externalPath +  "/get-addresses?postcode=" + encodeURI(postCode));

            return Meteor.http.call("GET", credentials.apicURL + "/" + credentials.testCatalog + "/" + credentials.externalPath +  "/get-addresses?postcode=" + encodeURI(postCode),
                {
            npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
            headers: {
            'x-ibm-client-id': credentials.apicClientId,
            'x-ibm-client-secret': credentials.apicClientPassword,
            'Content-Type':'application/json',
            'Accept':'application/json'
           }

            });
        },
        getODMRules: function (xmlData) {
           // console.log(xmlData);
            return Meteor.http.call("POST", credentials.odmURL,
                {
            npmRequestOptions: {
                    rejectUnauthorized: false // TODO remove when deploy
                    },
                  headers: {
                    'Authorization': credentials.commonODMCredential
                },
            content:xmlData
            });
        },
        doModulusCheck: function (accountDetailsJson) {

           //console.log("url" + credentials.ibanValidation + "&sortcode=" + accountDetailsJson.accountDetails.sortCode + "&account=" + accountDetailsJson.accountDetails.accountNumber);
           console.log(JSON.stringify(accountDetailsJson));
           let response;
           if(credentials.isAccountTest) {
               console.log("In ibanValidation");
                response =   Meteor.http.call("GET", credentials.ibanValidation + "&sortcode=" + accountDetailsJson.accountDetails.sortCode + "&account=" + accountDetailsJson.accountDetails.accountNumber,
               {
               npmRequestOptions: {
                       rejectUnauthorized: false // TODO remove when deploy
                       }
                     
              });
                console.log(response.content);
            
           } else {
               console.log("In Modulus Check");
                response =  Meteor.http.call("POST", credentials.odmModulusCheckURL,
                   {
                   data:accountDetailsJson,
                   npmRequestOptions: {
                           rejectUnauthorized: false // TODO remove when deploy
                           },
                         headers: {
                           'Authorization': credentials.commonODMCredential,
                           'Content-Type':'application/json',
                           'Accept':'application/json'
                       }
                  });
                console.log(response);
            }

       return response;
           
       },

       getMeteorSettingVariableValue: function(varName){
           console.log("I m here");
           let a=credentials;
           let returnVal = a[varName];
           console.log(returnVal);
           return returnVal;
         },
        getEDocs: function (containerName,docName) {
           // console.log(xmlData);
            return Meteor.http.call("GET", credentials.fileRetrieveURL,
                {
            npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
            headers: {
            'pdfcontainername': containerName,
            'pdffilename': docName,
            'Content-Type':'application/json'
           }
         })
        },
        searchCustomer1: function (customerName) {
            console.log(credentials.apicURL + "/" + credentials.apicCatalog + "/" + credentials.apicPath);
            return Meteor.http.call("GET", credentials.apicURL + "/" + credentials.apicCatalog + "/" + credentials.apicPath + "/customers?filter[where][primaryContact][like]=" + customerName + "&filter[include]=addresses",
            {
            npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
            headers: {
            'x-ibm-client-id': credentials.apicClientId,
            'x-ibm-client-secret': credentials.apicClientPassword,
            'Content-Type':'application/json',
            'Accept':'application/json'
           }
         })
        },
        searchCustomer: function (inputRef,brokerId) {
            let urlAppend = "";
            let dataType = "";
            let inputObject = "";
            let inputType = inputRef.searchBy;
            console.log("inpuTRef" + JSON.stringify(inputRef));
          if(inputType == 'Customer Name/Company Name'){
            urlAppend = "?searchtype=name";
            dataType = {"customername":"","brokerid":''};
            //inputObject = JSON.parse(dataType);
            dataType.customername = inputRef.customerName;
            dataType.brokerid = brokerId;
            
          }else if(inputType == 'Address'){
            urlAppend = "?searchtype=address";
            dataType = {"address":"","brokerid":''};
            //inputObject = JSON.parse(dataType);
            dataType.address = inputRef.customerName;
            dataType.brokerid = brokerId;
            
          }else if(inputType == 'Quote Ref'){
            urlAppend = "?searchtype=quoteref";
            dataType = {"quoteref":"","brokerid":''};
            //inputObject = JSON.parse(dataType);
            dataType.quoteref = inputRef.customerName;
            dataType.brokerid = brokerId;
            
          }else if(inputType == 'Loan Ref'){
            urlAppend = "?searchtype=loanref";
            dataType = {"loanref":"","brokerid":''};
            //dataType = JSON.parse(dataType);
            dataType.loanref = inputRef.customerName;
            dataType.brokerid = brokerId;
           
          }else if(inputType == 'Mandate'){
            urlAppend = "?searchtype=mandate";
            dataType = {"mandate":"","brokerid":''};
            //inputObject = JSON.parse(dataType);
            dataType.mandate = inputRef.customerName;
            dataType.brokerid = brokerId;
           
          }else if(inputType == 'Sort Code/Account Number'){
            urlAppend = "?searchtype=bank";
            dataType = {"sortcode":"","accountnumber":"","brokerid":""};
            //inputObject = JSON.parse(dataType);
            dataType.sortcode = inputRef.sortCode1 +inputRef.sortCode2 + inputRef.sortCode3;
            dataType.accountnumber = inputRef.accountNumber;
            dataType.brokerid = brokerId;

          }else if(inputType == 'Post Code'){
            urlAppend = "?searchtype=postcode";
            dataType = {"postcode":"","brokerid":""};
            //inputObject = JSON.parse(dataType);
            dataType.postcode = inputRef.customerName;
            dataType.brokerid = brokerId;
            
          }else{

          }
            console.log(credentials.searchCustomerApi+urlAppend);
            console.log("inputObject" + JSON.stringify(dataType)); 
            var searchResults = Meteor.http.call("POST", credentials.searchCustomerApi+urlAppend,
            {
                data:dataType,
                npmRequestOptions: {
                rejectUnauthorized: false // TODO remove when deploy
                },
                headers: {
                'x-ibm-client-id': credentials.apicClientId,
                'x-ibm-client-secret': credentials.apicClientPassword,
                'Content-Type':'application/json',
                'Accept':'application/json'
                }
            })
            console.log(JSON.stringify(searchResults));
            return searchResults;
        },
        getCustomerDetails1: function (customerId) {
            return Meteor.http.call("GET", credentials.apicURL + "/" + credentials.apicCatalog + "/" + credentials.apicPath +  "/customers/" + customerId + '?filter[include]=addresses&filter[include][loans]=policies',
            {
            npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
            headers: {
            'x-ibm-client-id': credentials.apicClientId,
            'x-ibm-client-secret': credentials.apicClientPassword,
            'Content-Type':'application/json',
            'Accept':'application/json'
           }
         })
        },
        getCustomerDetails: function (customerRef,clientId,brokerId) {
            let urlParams = "&broker-id="+brokerId;
            if(customerRef) {
               urlParams = urlParams + "&customer-ref="+customerRef;
            }
            if(clientId) {
                urlParams = urlParams + "&client-id="+clientId;
            }
            let detailSearchURL = credentials.getCustomerApi + urlParams;
            console.log("detailSearchURL" + detailSearchURL);
            var customerDetails =  Meteor.http.call("GET",detailSearchURL,
            {
            npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            },
            headers: {
            'x-ibm-client-id': credentials.apicClientId,
            'x-ibm-client-secret': credentials.apicClientPassword,
            'Content-Type':'application/json',
            'Accept':'application/json'
           }
           });
            //console.log(JSON.stringify(customerDetails));
            return customerDetails;
        },
         uploadDocuments: function(base64File,documentType,context,fileName,reference,brokerId,customerId,digitalRefId,brokerUserId,isUploaded,uploadedBy,uploadedDate,containername) { 
          console.log("Entering REST");
          return Meteor.http.call("POST",credentials.documentUploadURL,
          {
            data:{
            'documentBase64': base64File,
            'documentType': 'PDF',
            'context': 'fileContext',
            'fileName': 'SecciPDF',
            'reference': reference, 
            'brokerId':brokerId,
            'customerId':customerId,
            'digitalRefId':digitalRefId,
            'brokerUserId':brokerUserId,
            'isUploaded':isUploaded,
            'uploadedBy':uploadedBy,
            'uploadedDate':uploadedDate,
            'containername': containername

            },
            npmRequestOptions: {
            rejectUnauthorized: false // TODO remove when deploy
            }
           }
          )
        },

        getODMQuoteRules: function (jsonData) {
             console.log(JSON.stringify(jsonData));
            
            var odmResponse =  Meteor.http.call("POST", credentials.odmQuoteURL,
                {
            data:jsonData,
            
            npmRequestOptions: {
                    rejectUnauthorized: false // TODO remove when deploy
                    },
            headers: {
                    'Authorization': credentials.commonODMCredential,
                    'Content-Type':'application/json'
                }            
            });
            console.log(JSON.stringify(odmResponse));
            return odmResponse;
        },
        getODMExpiredPasswordValidate: function (jsonData) {
          console.log(jsonData);
            
            return Meteor.http.call("POST", credentials.odmExpiredPasswordValidateURL,
                {
            data:jsonData,
            
            npmRequestOptions: {
                    rejectUnauthorized: false // TODO remove when deploy
                    },
            headers: {
                    'Authorization': credentials.commonODMCredential,
                    'Content-Type':'application/json'
                }            
            });
        },
        getLoginVerified: function(brokerId,username,hash) {
          console.log("Calling Verification" + credentials.loginVerifyURL);

              var results = Meteor.http.call("POST",credentials.loginVerifyURL,
              {
                data:{
                'brokerId': brokerId,
                'username' : username,
                'hash' : hash

                },
                npmRequestOptions: {
                  rejectUnauthorized: false // TODO remove when deploy
                  },
                headers: {
                  'x-ibm-client-id': credentials.apicClientId,
                  'x-ibm-client-secret': credentials.apicClientPassword,
                  'Content-Type':'application/json',
                  'Accept':'application/json'
                }
              });
              console.log(JSON.stringify(results));
              return results;
            
        },
        getReferenceData: function(){
          console.log("Calling Get References");
              var referenceData =  Meteor.http.call("GET",credentials.getReferenceData,
              {
                  npmRequestOptions: {
                  rejectUnauthorized: false // TODO remove when deploy
                  },
                headers: {
                  'x-ibm-client-id': credentials.apicClientId,
                  'x-ibm-client-secret': credentials.apicClientPassword
                  }
              });
           //console.log("referenceData" + JSON.stringify(referenceData));
           return referenceData;
        }
    });