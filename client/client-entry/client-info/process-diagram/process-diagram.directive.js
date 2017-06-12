
import template from './process-diagram.html';

function processDiagram() {
    return {
    restrict: 'E',
    templateUrl: 'client/client-entry/client-info/process-diagram/process-diagram.html'
    }
}
export default angular.module('directives.processDiagram', [])
  .directive('processDiagram', processDiagram)
  .name;


