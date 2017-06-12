
initialize.$inject = ['$rootScope'];
export default function initialize($rootScope) {
    let jsonBPMString = '{"policyApplication":{"brokerConfig":{"name":"","brokerId":"","userId":"","brokerCategory":"","loan":{},"lob":{}},"customerDetails":{"address":{"addressLine1":"","addressLine2":"","addressLine3":"","addressLine4":"","postcode":"","selectedAddress":""},"customerName":"","customerMobile":"","premiumRate":"","customerType":"","customerEmail":"","natureOfBusiness":"","traderType":"","customerPhone":"","companyRegNo":"","dob":""},"policyDetails":{"totalPremium":"","cumulativeTotal":"","isHighPremium":"false","policies":[]},"transactionDetails":{"customerRef":"","bankRef":"","policyRef":"","RACADocumentRef":{}, "transactionRef": "", "isCreditAgreementExplained":"","isRaccaShown":"","isSecciShown":"","createdBy":"","createdTime":"","updatedBy*":"","updatedTime*":"","brokerId":"","totalPremium":"","isWetSign":""},"bankDetails":{"accountName":"","sortCode":"","accountNumber":""},"finance":{}},"loanRef":""}';
    //$rootScope.inputJson = JSON.parse(jsonString);
    $rootScope.inputBPMJson = JSON.parse(jsonBPMString);
    $rootScope.basicHeader = "";
    $rootScope.themeName = "cerulean";
};
