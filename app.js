/**
 * Created by alasd on 05/04/2016.
 */
angular.module('app',[])
    .controller('testCtrl',["$scope","synthComponent",function($scope,synthComponent){


        $scope.testStage = 1;

        $scope.nextStage = function(){
            $scope.testStage ++;
            synthComponent.stop();
        };

        $scope.toggleSynth = function(){
            synthComponent.toggle();
        };

        $scope.eqn = 'x^2';
        $scope.graphVals = {};

        $scope.break = function () {
            var x= $scope.graphVals
        }


    }]);

