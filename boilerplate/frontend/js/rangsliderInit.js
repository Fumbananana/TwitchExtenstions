'use strict';

$(function init() {


    var $document = $(document);
    var selector = '[data-rangeslider]';
    var inputRange = $('input[type="range"]');
    var $element = $(selector);
    // For ie8 support
    var textContent = ('textContent' in document) ? 'textContent' : 'innerText';
    // Example functionality to demonstrate a value feedback
    function valueOutput(element) {
        var value = element.value;
        var output = element.parentNode.getElementsByTagName('output')[0] || element.parentNode.parentNode.getElementsByTagName('output')[0];
        output[textContent] = value;
    }
    $document.on('input', 'input[type="range"], ' + selector, function(e) {
        valueOutput(e.target);
    });

    function myDisableFunction() {
        $document.on('click', 'button[data-behaviour="toggle"]', function(e) {
            var $inputRange = $('input[type="range"]', e.target.parentNode);
            if ($inputRange[0].disabled) {
                $inputRange.prop("disabled", false);
            }
            else {
                $inputRange.prop("disabled", true);
            }
          
            $inputRange.rangeslider('update');

            $inputRange.rangeslider({
                polyfill: false 
            });
        });
    }

    $element.rangeslider({
        // Deactivate the feature detection
        polyfill: false,
        // Callback function
        onInit: function() {
            valueOutput(this.$element[0]);
        },
        // Callback function
        onSlide: function(position, value) {
            //console.log('onSlide');
            //console.log('position: ' + position, 'value: ' + value);
        },
        // Callback function
        onSlideEnd: function(position, value) {
            //console.log('ENDE');
            myDisableFunction();
            document.getElementById('button').click();
            setTimeout (function() {
                document.getElementById('button').click();
                myDisableFunction();
            }, 5000)

        }
    });
    
    
});