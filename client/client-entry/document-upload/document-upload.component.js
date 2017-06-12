
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './document-upload.html';

class DocumentUploadCtrl {
    constructor($scope,$rootScope,$http,Notification,$window,$stateParams) {
		let _this = this;
		 $rootScope.isLoggedIn = true;
		 $scope.upload=true;
		console.log($stateParams);	
		_this.isVisible = 'false';
		let transactionId= $stateParams.myParam;
		let transactionObj = {};
		let documentObj = {};

		this.downloadRaca = () =>{

			 $window.open('/showraca', 'RACA', 'width=800,height=800');

		};

		this.fileuploaded=true;

		$scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
  
   $scope.upload=false;
   
    
  };
		

		this.uploadDocument = function () {

			 this.fileuploaded=false;
			console.log( $rootScope.loggedInUser,"asd");
						console.log($stateParams.myParam);
			console.log(_this.uploadedFile);
			//let pdf=_this.uploadedFile;
			let base64File = _this.uploadedFile.base64;
			//console.log(base64File);
			let documentType = "PDF";
			let context = "fileContext";
			let fileName = "SecciPDF";
			let reference = _this.referenceNumber;
			console.log(reference);
			var containername = "SignedDocuments";
			let brokerId="12233";
			let customerId="1111";
			let digitalRefId="1111";
			let brokerUserId="CS5006831511";
			let isUploaded="true";
			let uploadedBy="tony";
			let uploadedDate=new Date();
			Meteor.call("uploadDocuments",base64File,documentType,context,fileName,reference,containername,brokerId,customerId,digitalRefId,brokerUserId,isUploaded,uploadedBy,uploadedDate,function(error, results) {
					if(error) { 
					  console.log(error);
					 } else {
						console.log("success");
						Notification.success("Uploaded wet sign successfully " + JSON.stringify(results.data["X-Object-Meta-DocumentId"]));
						console.log(results);

						documentObj = results;

						/*Meteor.call("retrieveCollection",transactionId, function(error, results) {
          				if(error) { 
             			 console.log(error);
            				 } else {
            				 	transactionObj = results;
            				 	transactionObj.documentId = JSON.stringify(documentObj.data["X-Object-Meta-DocumentId"]);
            				 	transactionObj.documentRef = JSON.stringify(documentObj.data["X-Object-Meta-Reference"]);
            				 	TransactionDetails.update({"_id" :$stateParams.myParam},{$set:transactionObj});
            				 }
            			});*/
												
          
       		}
						
        	 $scope.upload=true;			//window.close();
			});

		};
    
    }

}
export default angular.module('documentUpload', [
    angularMeteor
    ])
  .component('documentUpload', {
    templateUrl: 'client/client-entry/document-upload/document-upload.html',
    controller: ['$scope','$rootScope','$http','Notification','$window','$stateParams', DocumentUploadCtrl]
  });


