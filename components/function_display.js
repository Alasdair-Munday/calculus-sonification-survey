/**
 * Created by alasd on 05/04/2016.
 */
angular.module('app').directive('functionDisplay',function(){
    return {
        restrict:'E',
        templateUrl: 'templates/function_display.html',
        scope:{
            equationString: '=',
            yRange: '=rangeY',
            xRange: '=rangeX',
            output: '='

        },
        controller:'functionDisplayCtrl'
    };
}).controller('functionDisplayCtrl',['synthComponent','$scope','$element','$attrs',
    function(synthComponent,$scope,$element,$attr){
        var synth  = synthComponent;
        $scope.loop=true;
        var fMax = 800;
        var fMin = 200;

        var axies = {
            xMin : -5,
            xMax : 5,
            yMin : -1,
            yMax : 1
        };

        var eqnString = $scope.equationString;

        var options = {};
        function updateOptions(){
            options = {
                data: [
                    {
                        fn: eqnString,
                        color: "#ffffff"
                    }
                ],
                target: '#'+ $attr.id+ " .function-plot",
                yAxis: {domain: [axies.yMin, axies.yMax]},
                xAxis: {domain: [axies.xMin, axies.xMax]},
                width: 600,
                disableZoom: true
            }
        }

        function sonifyEquation(){
            options.data = [{
                fn: eqnString,
                color: "#ffffff"
            }];

            $scope.graph = functionPlot(options);

            $scope.graph.on('mouseover', function () {
                synth.start();
                synth.setNoteRange(fMax, fMin, axies.yMax, axies.yMin)
            });

            $scope.graph.on('mousemove', function (x, y) {
                setX(x);
            });

            $scope.graph.on('mouseout', function () {
                if(!playId)
                    synth.stop();
            });

        }

        $scope.$watch("equationString", function(newValue, oldValue) {
            eqnString = newValue;
            updateOptions();
            sonifyEquation();
        });


        function setX(x){
            playhead = x;
            var yVal = Parser.evaluate(eqnString, { x: x  });
            var deltaY = Parser.evaluate(eqnString, {x: x+0.001});
            var thirdY = Parser.evaluate(eqnString, {x: x+0.002});

            var firstDerivativeVal = (deltaY - yVal)/ 0.001;
            var deltafirstDerivative = (thirdY - deltaY)/0.001;
            var secondDerivativeVal = ( deltafirstDerivative - firstDerivativeVal)/ 0.001;
            options.annotations = [{x:x}];
            functionPlot(options);

            synth.sonifyValues(yVal,firstDerivativeVal,secondDerivativeVal);
            synth.panner.pan.value = (x)/axies.xMax;

            if($scope.output) {
                $scope.$apply(function () {
                    $scope.output.y = yVal;
                    $scope.output.x = x;
                    $scope.output.firstDerivative = firstDerivativeVal;
                    $scope.output.secondDerivative = secondDerivativeVal;
                });
            }
        }

        //function setRange(parameterString,value){
        //
        //    switch(parameterString) {
        //        case 'x':
        //            axies.xMax = value;
        //            axies.xMin = -value;
        //            break;
        //        case 'y' :
        //            axies.yMax = value;
        //            axies.yMin = -value;
        //            break;
        //    }
        //    updateOptions();
        //    sonifyEquation();
        //}

        if ($scope.xRange) {
            axies.xMax = $scope.xRange;
            axies.xMin = -$scope.xRange;
        }
        if ($scope.yRange) {
            axies.yMax = $scope.yRange;
            axies.yMin = -$scope.yRange;
        }

        var playhead = axies.xMin;
        var playId = null;
        var playtime = 10;
        var sampleRate = 20;
        var reverse = false;
        $scope.play = function(){
            playId = setInterval(nextFrame,1/(sampleRate*1000));
            synth.start();
            synth.setNoteRange(fMax,fMin,axies.yMax,axies.yMin);
        };
        $scope.pause = function(){
            clearInterval(playId);
            playId = null;
            synth.stop();
        };

        $scope.stop = function(){
            if(playId)
                $scope.pause();
            $scope.reset();
        };

        $scope.reset = function(){
            playhead = axies.xMin;
        };

        function nextFrame(){

            if(playhead > axies.xMax)
                $scope.loop ? $scope.reset(): $scope.stop();

            setX(playhead);
            playhead += (axies.xMax - axies.xMin)/(sampleRate*playtime);
        }



        updateOptions();
        sonifyEquation();

    }]);

