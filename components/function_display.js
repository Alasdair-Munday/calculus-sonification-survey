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

        var fMax = 800;
        var fMin = 200;

        var graph;
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
                target: '#'+ $attr.id+ " .function-plot",
                yAxis: {domain: [axies.yMin, axies.yMax]},
                xAxis: {domain: [axies.xMin, axies.xMax]},
                width: 600,
                disableZoom: true
            }
        }
        updateOptions();

        function sonifyEquation(){
            options.data = [{
                fn: eqnString,
                color: "#ffffff"
            }];


            graph = functionPlot(options);

            graph.on('mouseover',function(){
                synth.start();
            });

            graph.on('mousemove',function(x,y){
                setX(x);
            });

            graph.on('mouseout',function(){
                //if(!playId)
                    synth.stop();
            });

        }
        sonifyEquation();

        $scope.$watch("equationString", function(newValue, oldValue) {
            eqnString = newValue;
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
            var plot = functionPlot(options);
            //firstDerivative.setData(firstDerivativeVal);
            //secondDerivative.setData(secondDerivativeVal);
            //xGauge.setData(x);
            //yGauge.setData(yVal);


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

        function setRange(parameterString,value){

            switch(parameterString) {
                case 'x':
                    axies.xMax = value;
                    axies.xMin = -value;
                    break;
                case 'y' :
                    axies.yMax = value;
                    axies.yMin = -value;
                    synth.setNoteRange(fMax,fMin,axies.yMax,axies.yMin);
                    break;
            }
            updateOptions();
            sonifyEquation();

        }
        if($scope.xRange)
            setRange('x',$scope.xRange);
        if($scope.yRange)
            setRange('y',$scope.yRange);

        var playhead = axies.xMin;
        var playId = null;
        var playtime = 10;
        var sampleRate = 20;
        var reverse = false;
        $scope.play = function(){
            playId = setInterval(nextFrame,1/(sampleRate*1000));
            synth.start();
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
                $scope.stop();

            setX(playhead);
            playhead += (axies.xMax - axies.xMin)/(sampleRate*playtime);
        }
    }]);

