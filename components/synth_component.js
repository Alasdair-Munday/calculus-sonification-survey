/**
 * Created by alasd on 05/04/2016.
 */
angular.module('app').service('synthComponent', function () {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    var playing = false;
    var component = {};

    component.fMin = 200;
    component.fxSemitoneRatio = 24/2;


    component.panner = audioContext.createStereoPanner();
    component.osc1 =  audioContext.createOscillator();
    component.osc2 = audioContext.createOscillator();
    component.amp = audioContext.createGain();
    component.filter = audioContext.createBiquadFilter();
    component.lfo = audioContext.createOscillator();

    //the two oscillators

    component.osc1.type = 'sawtooth';
    component.osc1.start();
    component.osc2.type = 'square';
    component.osc2.start();
    component.sub = audioContext.createOscillator();
    component.sub.start();



    //the gain node at the oscilators output

    component.amp.gain.value = 0;
    //the detune between the two oscilators
    component.detune = 5;


    component.filter.type = 'bandpass';

    component.lfo.frequency.value = 0;
    component.lfo.start();
    component.filter.Q.value = 10;

    var lfoGain = audioContext.createGain();
    lfoGain.gain.value =  300;
    component.lfo.connect(lfoGain);

    component.filter.frequency = 400;
    lfoGain.connect(component.filter.detune);


    //setup audio graph
    component.osc1.connect(component.filter);
    component.osc2.connect(component.filter);
    var subAmp = audioContext.createGain();
    subAmp.gain.value = 0.2;

    component.sub.connect(subAmp);
    subAmp.connect(component.amp);

    component.filter.connect(component.amp);
    component.amp.connect(component.panner);
    component.panner.connect(audioContext.destination);


    component.setNoteRange = function(fMax,fMin,yMax,yMin){
        component.fMin = fMin;
        var semitones = 12*Math.log2(fMax/fMin);

        var yRange = yMax - yMin;

        component.fxSemitoneRatio = semitones/yRange;
    };

    component.getPitch = function(fx){

        var n = fx* component.fxSemitoneRatio;

        return Math.pow(2,n/12)* component.fMin;
    };

    //methods
    component.setFrequency = function(frequency){
        component.osc1.frequency.value = frequency;
        component.osc2.detune.value = component.detune;
        component.osc2.frequency.value = frequency/2;
        component.sub.frequency.value = frequency/2;
    };

    component.sonifyValues = function(fx,dx,dx2){
        component.lfo.frequency.value = 3* Math.abs(dx) ;
        component.filter.frequency.value = 200 + 50*Math.abs(dx2);
        component.setFrequency(component.getPitch(fx));
    };

    component.start = function () {
        this.amp.gain.value = 1;
        playing = true;
    };

    component.stop = function(){
        this.amp.gain.value = 0;
        playing = false;
    };

    component.toggle = function(){
        this.amp.gain.value = playing? 0:1;
        playing = ! playing;
    }

    return component;
});