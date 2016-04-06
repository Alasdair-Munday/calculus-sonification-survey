/**
 * Created by alasd on 05/04/2016.
 */
angular.module('app').directive('functionDisplay',['$scope','synthComponent',function($scope,synthComponent){
    return {
        restrict:'E',
        templateUrl: 'templates/function_display.html'
    }
}]);