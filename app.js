/**
 * Created by alasd on 05/04/2016.
 */
angular.module('app',['ui.bootstrap'])
    .controller('testCtrl',["$scope","synthComponent",function($scope,synthComponent){


        $scope.testStage = 3;

        $scope.trainingSlopeOut = {};
        $scope.trainingCurveOut = {};
        $scope.playgroundEquation = "tanh(2*sin(x))/tanh(5)";
        $scope.playgroundOut = {};

        $scope.nextStage = function(){
            $scope.testStage ++;
            synthComponent.stop();
        };

        $scope.toggleSynth = function(){
            synthComponent.toggle();
        };


        $scope.trainingValue = 1;

        $scope.break = function () {
            var x= $scope.graphVals
        }


    }]);

