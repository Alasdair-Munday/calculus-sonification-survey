/**
 * Created by alasd on 05/04/2016.
 */
angular.module('app',['ui.bootstrap'])
    .controller('testCtrl',["$scope","synthComponent",function($scope,synthComponent){
        $scope.testStage = 1;

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
            var x = $scope
        }


    }])
    .controller('quizCtrl',['$scope','$http',function($scope,$http){

        var formId = "1WlealmzTHa3LZKa1TQ_SQlcOyRVWzH7gHWFA05G1U3Y";
        var formUrl = "https://docs.google.com/forms/d/1WlealmzTHa3LZKa1TQ_SQlcOyRVWzH7gHWFA05G1U3Y/formResponse";

        $scope.questionNumber = 0;
        $scope.submitted = false;

        var questions = [
            {
                equation:"x^2",
                text:"Click on the graph at the lowest Y value",
                xRange : 1,
                yRange : 1,
                gauges : true,
                sonify : true
            },
            {
                equation:"(2*x^2-1) + sin(5*x)",
                text:"Click on the graph at the lowest y value",
                xRange : 1,
                yRange : 2,
                gauges : true,
                sonify : false
            },
            {
                equation:"-(2*x^2-1) + sin(5*x)",
                text:"Click on the graph at the highest Y value",
                xRange : 3,
                yRange : 2,
                gauges : true,
                sonify : true
            },
            {
                equation:"x^3",
                text:"Click on the graph at the slope value closest to zero",
                xRange : 1,
                yRange : 1,
                gauges : true,
                sonify : false
            },
            {
                equation:"sin(2*x)/x -1",
                text:"Click on the graph at a point where the slope is furthest from zero",
                xRange : 5,
                yRange : 2,
                gauges : false,
                sonify : true
            },
            {
                equation:"tanh(2*sin(x))/tanh(5)",
                text:"Click on the graph at a slope value furthest from zero",
                xRange : 5,
                yRange : 1,
                gauges : true,
                sonify : true
            },
            {
                equation:"tanh(5*sin(x))/tanh(5)",
                text:"Click on the graph at the curviture value furthest from zero",
                xRange : 1,
                yRange : 1,
                gauges : true,
                sonify : true
            },
            {
                equation:"(1/20)*sin(20*x)/(3*cos(2*x))",
                text:"Click a point on the graph where the curvature is closest to zero",
                xRange : 3,
                yRange : 1,
                gauges : false,
                sonify : true
            },
            {
                equation:"cos(x^2)",
                text:"Click on the graph where the curviture is furthest from zero",
                xRange : 3,
                yRange : 1,
                gauges : true,
                sonify : false
            },
            {
                equation:"tan(x/2)+5*sin(x/5)",
                text:"Click on your favourite part of this graph",
                xRange : 5,
                yRange : 7,
                gauges : false,
                sonify : true
            }
        ];

        $scope.quizLength = questions.length -1;

        $scope.questionOut={};

        $scope.question = questions[$scope.questionNumber];

        $scope.userInfo = {
            mathsLevel: -1,
            mathsOpinion : -1,
            musicOpinion: -1,
            synthesisOpinion:-1,
            age:-1
        };

        $scope.postQuiz = {
            mathsRatingPost: -1,
            experienceRating:-1,
            soundComments:"",
            mathsComments:"",
            otherComments:""
        };

        $scope.quizState = 0;

        $scope.continue = function () {
            $scope.quizState++;
        };

        $scope.startQuestion = function(){
            $scope.ready = true;
            $scope.question.startedAt = Date.now();
        };

        $scope.nextQuestion = function(){
            $scope.question.answeredAt = Date.now();
            $scope.question.timeTaken = $scope.question.answeredAt - $scope.question.startedAt;
            if($scope.questionNumber < $scope.quizLength) {
                $scope.questionNumber++;
                $scope.question = questions[$scope.questionNumber];
                $scope.ready=false;
            }else{
                $scope.continue();
            }

        };

        $scope.selectValue = function (){
            $scope.question.answer = $scope.questionOut.x;
        };

        $scope.submitResults = function(){
            $http.get(formUrl , {
                params: {
                    //User info
                    "entry.616501172" : $scope.userInfo.mathsLevel,
                    "entry.136533384" : $scope.userInfo.mathsOpinion,
                    "entry.1688833816" : $scope.userInfo.musicOpinion,
                    "entry.1045838795" : $scope.userInfo.age,
                    "entry.986229210" : questions[0].answer,
                    "entry.1906447978" : questions[0].timeTaken,
                    "entry.1820341719" : questions[1].answer,
                    "entry.111467348" : questions[1].timeTaken,
                    "entry.139050949" : questions[2].answer,
                    "entry.806153033" : questions[2].timeTaken,
                    "entry.1181280904" : questions[3].answer,
                    "entry.623846552" : questions[3].timeTaken,
                    "entry.283261551" : questions[4].answer,
                    "entry.531653099" : questions[4].timeTaken,
                    "entry.923211059" : questions[5].answer,
                    "entry.1093845699" : questions[5].timeTaken,
                    "entry.1822055833" : questions[6].answer,
                    "entry.1181459855" : questions[6].timeTaken,
                    "entry.2134337721" : questions[7].answer,
                    "entry.741685941" : questions[7].timeTaken,
                    "entry.1146241254" : questions[8].answer,
                    "entry.1442689694" : questions[8].timeTaken,
                    "entry.1146160365" : questions[9].answer,
                    "entry.660097956" : questions[9].timeTaken,
                    "entry.279043477" : $scope.postQuiz.mathsRatingPost,
                    "entry.915178329" : $scope.postQuiz.experienceRating,
                    "entry.1887122534": $scope.postQuiz.soundComments,
                    "entry.1347851208": $scope.postQuiz.mathsComments,
                    "entry.137717031": $scope.postQuiz.otherComments
                }
            });
            $scope.submitted = true;
        }
    }])
    .directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

