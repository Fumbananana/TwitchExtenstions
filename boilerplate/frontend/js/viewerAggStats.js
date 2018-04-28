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

var username = null;

var pcVotes = 0;
var ecVotes = 0;
var ccVotes = 0;
var rlVotes = 0;
var elVotes = 0;
var clVotes = 0;

var pcMove = '-';
var ecMove = '-';
var ccMove = '-';
var rlMove = '-';
var elMove = '-';
var clMove = '-';

document.getElementById("image").style.visibility = "visible";
document.getElementById("extension").style.visibility = "hidden";


document.getElementById("pcVotes").innerHTML = pcVotes;
document.getElementById("ecVotes").innerHTML = ecVotes;
document.getElementById("ccVotes").innerHTML = ccVotes;
document.getElementById("rlVotes").innerHTML = rlVotes;
document.getElementById("elVotes").innerHTML = elVotes;
document.getElementById("clVotes").innerHTML = clVotes;

document.getElementById("pcMove").innerHTML = pcMove;
document.getElementById("ecMove").innerHTML = ecMove;
document.getElementById("ccMove").innerHTML = ccMove;
document.getElementById("rlMove").innerHTML = rlMove;
document.getElementById("elMove").innerHTML = elMove;
document.getElementById("clMove").innerHTML = clMove;

var dataEvent = {event: 'no', username: 'no'};

setInterval (function() {
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
}, 5000);



var doSomeMagic = function(data) {
  if (data.length > 0) {

    var sum = data[0].pcV + data[0].ccV + data[0].ecV + data[0].rlV + data[0].elV + data[0].clV;

    var widthPC = Math.floor(((data[0].pcV)/sum)*100);
    var widthEC = Math.floor(((data[0].ecV)/sum)*100);
    var widthCC = Math.floor(((data[0].ccV)/sum)*100);
    var widthRL = Math.floor(((data[0].rlV)/sum)*100);
    var widthEL = Math.floor(((data[0].elV)/sum)*100);
    var widthCL = Math.floor(((data[0].clV)/sum)*100);

    document.getElementById("pcVotes").innerHTML = data[0].pcV;
    document.getElementById("ecVotes").innerHTML = data[0].ecV;
    document.getElementById("ccVotes").innerHTML = data[0].ccV;
    document.getElementById("rlVotes").innerHTML = data[0].rlV;
    document.getElementById("elVotes").innerHTML = data[0].elV;
    document.getElementById("clVotes").innerHTML = data[0].clV;

    document.getElementById('pcAgg').style.width = widthPC+'%';
    document.getElementById('ccAgg').style.width = widthCC+'%';
    document.getElementById('ecAgg').style.width = widthEC+'%';
    document.getElementById('rlAgg').style.width = widthRL+'%';
    document.getElementById('elAgg').style.width = widthEL+'%';
    document.getElementById('clAgg').style.width = widthCL+'%';

    document.getElementById('pcMove').innerHTML = data[0].pc;
    document.getElementById('ccMove').innerHTML = data[0].cc;
    document.getElementById('ecMove').innerHTML = data[0].ec;
    document.getElementById('rlMove').innerHTML = data[0].rl;
    document.getElementById('elMove').innerHTML = data[0].el;
    document.getElementById('clMove').innerHTML = data[0].cl;
  }
}


window.Twitch.ext.onError(function(err) {
  });

window.Twitch.ext.onContext(function(context, contextFields) {
  });

window.Twitch.ext.onAuthorized(function(auth) {
  var parts = auth.token.split(".");
  var payload = JSON.parse(window.atob(parts[1]));
  $.ajax({
    url: 'https://api.twitch.tv/kraken/users/'+payload.user_id,
    type: 'GET',
    headers: {
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID': 'prsrpfk40yc2rc4f04q7xfm233qk17'
      }
    }).done(function(data) {
      username = data.name;
      document.getElementById("image").style.visibility = "hidden";
      document.getElementById("extension").style.visibility = "visible";
  });
});