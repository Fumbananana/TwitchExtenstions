// /*
// Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

//     http://aws.amazon.com/apache2.0/

// or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
// */

// /*

//   Set Javascript specific to the extension viewer view in this file.

//   Favicon used: https://www.freefavicon.com/freefavicons/objects/iconinfo/chess-piece-silhouette---black-pawn--pen-negro-152-275299.html

// */
'use strict';

$(function() {


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
                        // console.log('ENDEEEEEE');
                        // console.log('Slider ID:', this.$element);  //DEBUG
                        // console.log('Slider ID:', this.$element[0].id );  //DEBUG
                        myDisableFunction();
                        document.getElementById('button').click();
                        setTimeout (function() {
                            document.getElementById('button').click();
                            myDisableFunction();
                        }, 5000)

                        
                        var element = this.$element[0].id;
                        var dataEvent;

                        if (element == 'readySlider') {
                          dataEvent = {
                            event: 'setReady',
                            username: username,
                            value: value
                          }
                        } 
                        if (element == 'timeSlider') {
                          dataEvent = {
                            event: 'setTime',
                            username: username,
                            value: value
                          }
                        }

                        $.ajax({
                          url: 'https://fumbananana.de:8443/boilerplate.js',
                          //url: 'https://localhost:8080/boilerplate.js',
                          type: 'POST',
                          data: JSON.stringify(dataEvent),
                          contentType: 'application/json',
                          headers: {}
                          }).done(function(data) {
                            doSomeMagic(data);
                        });
                    }
                });
                
                
            });

var username = null;
var bool = false;
var time = 180;
var ready = 50;

var spanT = document.getElementById('timeV');
spanT.textContent = time + " sec";
var spanR = document.getElementById('readyV');
spanR.textContent = ready + " %";

var dataEvent = {event: 'no', username: 'no'};

setInterval( function() {
  $.ajax({
    url: 'https://fumbananana.de:8443/boilerplate.js',
    //url: 'https://localhost:8080/boilerplate.js',
    type: 'POST',
    data: JSON.stringify(dataEvent),
    contentType: 'application/json',
    headers: {}
    }).done(function(data) {
      doSomeMagic(data);
    });
}, 3000);


var doSomeMagic = function(data) {
  if (data.length > 0) {
    var valueR = data[0].threshold;
    var valueT = data[0].turnTime;
    // $('input[type="range"][id=timeSlider]').val(valueT).change();
    // $('input[type="range"][id=readySlider]').val(valueR).change();
    spanT.textContent = valueT + " sec";
    spanR.textContent = valueR + " %";

    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i].username == username) {
        if (data[i].ready == true) {
          document.getElementById('ready').style.backgroundColor = '#380058';
        } else {
          document.getElementById('ready').style.backgroundColor = '#aaa8c6';
        }
      }
    }
  }
}

document.getElementById("image").style.visibility = "visible";
document.getElementById("extension").style.visibility = "hidden";

$("#ready").click(function() {
    if (bool === true) {
      $(ready).css('background-color','#380058');
      bool = false;
    } else {
      $(ready).css('background-color','#aaa8c6');
      bool = true;
    }
});


$("#aggrMenu").change(function() {
    var e = document.getElementById("aggrMenu");
    var agg = e.options[e.selectedIndex].value;
    switch (agg) {
      case 'pc':
          $(aggrMenu).css('background-color','#380058');
          break;
      case 'cc':
          $(aggrMenu).css('background-color','#380058');
          break;
      case 'ec':
          $(aggrMenu).css('background-color','#380058');
          break;
      case 'el':
          $(aggrMenu).css('background-color','#380058');
          break;
      case 'rl':
          $(aggrMenu).css('background-color','#380058');
          break;
      case 'cl':
          $(aggrMenu).css('background-color','#380058');
          break;
      default:
          $(aggrMenu).css('background-color','#aaa8c6');
          break;
      }
});


window.Twitch.ext.onError(function(err) {});

window.Twitch.ext.onContext(function(context, contextFields) {});

window.Twitch.ext.onAuthorized(function(auth) {
  var parts = auth.token.split(".");
  var payload = JSON.parse(window.atob(parts[1]));
  $.ajax({
    url: 'https://api.twitch.tv/kraken/users/'+payload.user_id,
    type: 'GET',
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': '344bna5na8gcfryiauxqpnfqxvp0o4'
      }
    }).done(function(data) {
      username = data.name;
      document.getElementById("image").style.visibility = "hidden";
      document.getElementById("extension").style.visibility = "visible";
  });
});