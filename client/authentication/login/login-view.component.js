
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import template from './login-view.html';

class LoginCtrl {
  constructor($scope,$rootScope,$reactive,$state,Notification,baseEncode,$window) {

    this.Base64 = baseEncode;
    $reactive(this).attach($scope);
    this.credentials = {
      email: '',
      password: ''
    };

    this.error = '';
    var _this = this;
    var isNewBroker = true;
    $rootScope.isLoggedIn = false;


    Meteor.loginFlag = false;
    this.playAudio = function(message) {
      if($window.audioEnabled) {
        var audio = new Audio();
        var downloadURL = "https://text-to-speech-demo.mybluemix.net/api/synthesize?voice=en-US_AllisonVoice&text=" + encodeURIComponent(message);
        audio.src = downloadURL;
        audio.play();
      }
    };

    this.loginAPI = function(message) {
                let brokerId = this.credentials.brokerid.toUpperCase();
                let brokerType = "";
                if(brokerId && brokerId.length > 2) {
                  if(brokerId.includes("CS") || brokerId.includes("CS")) {
                    $rootScope.loggedInUser = this.credentials.username;
                    brokerId = this.credentials.brokerid.substring(2);
                    brokerType = this.credentials.brokerid.substring(0,2);
                    $rootScope.loggedInUser = $rootScope.loggedInUser.toLowerCase();
                    $rootScope.brokerId = brokerId;
                  } else {
                    console.log(this.credentials.username);
                    $rootScope.loggedInUser = this.credentials.username;
                    console.log($rootScope.loggedInUser);
                    $rootScope.loggedInUser = $rootScope.loggedInUser.toLowerCase();
                    $rootScope.brokerId = this.credentials.brokerid;
                    console.log($rootScope.brokerId);
                    $rootScope.brokerId = $rootScope.brokerId.toLowerCase();
                  }
                } else {
                    console.log(this.credentials.username);
                    $rootScope.loggedInUser = this.credentials.username;
                    console.log($rootScope.loggedInUser);
                    $rootScope.loggedInUser = $rootScope.loggedInUser.toLowerCase();
                    $rootScope.brokerId = this.credentials.brokerid;
                    console.log($rootScope.brokerId);
                    $rootScope.brokerId = $rootScope.brokerId.toLowerCase();
                }
     Meteor.call("getBrokerConfig",$rootScope.brokerId,function(error,results) {
      if(error) {
        Notification.error("BrokerId is Invalid");
     } else {

    if(results && results._id) {
      Meteor.call("getLoginVerified",_this.credentials.brokerid,_this.credentials.username,_this.credentials.password, function(error, results) {
             //console.log("Error" + error);
             if (error) {
                 Meteor.loginFlag = false;
                 Notification.error("Authentication failed");
               }
               else {
                console.log("Logging in");
                Meteor.loginFlag = true;
                console.log(results);
                if(results.data.length > 0) {
                  if(results.data[0].responseCode == "0") {
                  $rootScope.isLoggedIn = true;
                  $rootScope.execInitials = results.data[0].execInitials;
                      if(brokerType.toUpperCase() == "CS") {
                        $rootScope.isCommercial = true;
                      } else {
                        $rootScope.isCommercial = false;
                      }
                      $state.go('landingpage');
                  } else {
                    Notification.error(results.data[0].responseMessage);
                  }
                } else {
                  Meteor.loginFlag = false;
                 Notification.error("Invalid Credentials");
                }
              }
            });
      } else {
              Notification.error("Broker Id is Invalid");
 
      }
    }
    });

    };

   
    }
  }
  export default angular.module('loginView', [
    angularMeteor
    ])
  .component('loginView', {
    templateUrl: 'client/authentication/login/login-view.html',
    controller: ['$scope','$rootScope','$reactive','$state','Notification','baseEncode','$window', LoginCtrl]
  });
