
import { Meteor } from 'meteor/meteor';

routes.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];

export default function routes($urlRouterProvider,$stateProvider, $locationProvider ) {
  'ngInject';
  $locationProvider.html5Mode(true);
  $stateProvider
    .state('login', {
        url: '/login',
        template: '<login-view></login-view>'
      })
      .state('register', {
        url: '/register',
        template: '<register></register>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('searchcustomer', {
        url: '/searchcustomer',
        template: '<search-client></search-client>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('createcustomer', {
        url: '/createcustomer',
        template: '<create-customer></create-customer>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('landingpage', {
        url: '/landingpage',
        template: '<landing-page></landing-page>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('creditagreementexplanation', {
        url: '/creditagreementexplanation',
        template: '<creditagreement-explanation></creditagreement-explanation>'
      })
      .state('createquote', {
        url: '/createquote',
        template: '<create-quote></create-quote>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('createpayment', {
        url: '/createpayment',
        template: '<create-payment></create-payment>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('showsecci', {
        url: '/showsecci',
        template: '<precontract-info></precontract-info>'
      })
      .state('showraca', {
        url: '/showraca',
        template: '<precontract-info></precontract-info>'
      })
      .state('showquotesummary', {
        url: '/showquotesummary',
        template: '<precontract-info></precontract-info>'
      })
      .state('documentupload', {
        url: '/documentupload?myParam',
        template: '<document-upload></document-upload>'
       /* resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }*/
      })
      .state('premiumcalculator', {
        url: '/premiumcalculator',
        template: '<premium-calculator></premium-calculator>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('esignmessage', {
        url: '/esignmessage',
        template: '<esign-modal></esign-modal>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('refund', {
        url: '/refund',
        template: '<payment-modal></payment-modal>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('paymentconfirmation', {
        url: '/paymentconfirmation',
        template: '<esign-modal></esign-modal>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
       .state('refundconfirmation', {
        url: '/refundconfirmation',
        template: '<esign-modal></esign-modal>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
        }
      })
      .state('autoapproved', {
        url: '/autoapproved',
        template: '<auto-approve></auto-approve>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
       }
      })
     .state('additionalinfo', {
        url: '/additionalinfo',
        template: '<additional-info></additional-info>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
       }
      })
      .state('onboardcustomer', {
        url: '/onboardcustomer',
        template: '<client-info></client-info>',
        resolve: {
        currentUser: ['$q', function($q) {
          if (!Meteor.loginFlag) {
            return $q.reject('AUTH_REQUIRED');
          }
          else {
            return $q.resolve();
          }
        }]
       }
      });
    // .state('customerinsight', {
    //   url: '/customerinsight',
    //   template: '<chart-data></chart-data>',
    //    resolve: {
    //     currentUser: ['$q', function($q) {
    //       if (!Meteor.loginFlag) {
    //         return $q.reject('AUTH_REQUIRED');
    //       }
    //       else {
    //         return $q.resolve();
    //       }
    //     }]
    //    }
    // });
    $urlRouterProvider.otherwise("/login");
};



