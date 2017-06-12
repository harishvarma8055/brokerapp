
routesValidation.$inject = ['$rootScope', '$state'];
export default function routesValidation($rootScope, $state) {
   'ngInject';
    $rootScope.transitionTo = function(state, params) {
      $state.transitionTo(state, params, { location: true, inherit: true, relative: $state.$current, notify: true });
    }
    $rootScope.checkState = function (state) {
    return $state.current.name == state ? true : false;
    }
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        $state.go('login');
      }
    });
};
