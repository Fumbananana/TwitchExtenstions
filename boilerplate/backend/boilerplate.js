"use strict";

/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express');
const fs = require('fs');
const https = require('https');
var bodyParser = require('body-parser');
var net = require('net');

var moveEventCache = []; // cache for the move votes
var aggregatorEventCache = []; // cache for the aggregator votes
var readyEventCache = []; // cache for the ready votes
var setTimeEventCache = []; // cache for the setTime votes
var setReadyEventCache = []; // cache for the setready votes
var resignEventCache = []; // cache for the resign votes
var userStats = []; // User Statistics with expertise & conformity values of the Game CrowdChess

const PORT = 8080;
const app = express();

app.use((req, res, next) => {
  console.log('Got request', req.path, req.method);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Origin', '*');
  return next();
});

app.use(express.static('../frontend'));
app.use(bodyParser.json());

let options = {
   key  : fs.readFileSync('../certs/testing.key'),
   cert : fs.readFileSync('../certs/testing.crt')
};

app.get('/', function(req, res){
  res.send('hello world');
});

app.get('/boilerplate.js', function(req, res){
  res.send('So man, ich bin eine Boilerplate!');
});

app.post('/boilerplate.js', function(req, res){
  res.send(userStats);
  var dataString = JSON.stringify(req.body);
  var parsedData = JSON.parse(dataString);
  console.log(parsedData.event);
  var obj = {};
  console.log('body: ' + JSON.stringify(req.body));
  if (parsedData.username != null) {
      if (parsedData.event == 'voteForMove') {
        moveEventCache.push(JSON.stringify(req.body));
        updateCache(moveEventCache);
        console.log(JSON.stringify(req.body));
        res.send(userStats);
      }
      if (parsedData.event == 'upvoteMediator') {
        aggregatorEventCache.push(JSON.stringify(req.body));
        updateCache(aggregatorEventCache);
        console.log(JSON.stringify(req.body));
        res.send(userStats);
      }
      if (parsedData.event == 'ready') {
        readyEventCache.push(JSON.stringify(req.body));
        updateCache(readyEventCache);
        console.log(JSON.stringify(req.body));
        res.send(userStats);
      }
      if (parsedData.event == 'setTime') {
        setTimeEventCache.push(JSON.stringify(req.body));
        updateCache(setTimeEventCache);
        console.log(JSON.stringify(req.body));
        res.send(userStats);
      }
      if (parsedData.event == 'setReady') {
        setReadyEventCache.push(JSON.stringify(req.body));
        updateCache(setReadyEventCache);
        console.log(JSON.stringify(req.body));
        res.send(userStats);
      }
      if (parsedData.event == 'resign') {
        resignEventCache.push(JSON.stringify(req.body));
        updateCache(resignEventCache);
        console.log(JSON.stringify(req.body));
        res.send(userStats);
      }
    }
});

var server = https.createServer(options, app);

server.listen(PORT, function (req, res) {
  console.log('EBS is running on Port:',PORT);
});

function updateCache(cache) { 
  for (var i = 0; i < cache.length; i++) {
    if (cache.length > 1 ) {
      for (var j = cache.length - 1; j > 0; j--) {
        if (cache[i].username == cache[j].username && i != j) {
          cache.splice(i, 1);
        }
      } 
    } 
  }
}

// ---- Communication with CrowdChess-Server ---- //

var client = net.connect(13337, 'localhost', function() {
  console.log('Client is Connected to CrowdChess Server');
  var text = 'Hello, CrowdChess-Server! Love, Boilerplate Server.'
  client.write(JSON.stringify(text));
});

client.on('data', function(data) {
  console.log('Got some data com CC-Server');
  try { 
    var parsedData = JSON.parse(data);
    if (parsedData instanceof Array) {
      if (parsedData.length > 2 ) { // only the valid userStats-Array will be accepted
        userStats = [];
        for (var i = 0; i < parsedData.length; i++) {
          userStats.push(parsedData[i]);
        }
        console.log ('I got executed -> ClientEvent(Stats)');
        io.sockets.emit('clientEvent', userStats); // update expertise & conformity values
      }
    }
  }
  catch (error) {
    if (error instanceof SyntaxError) {
      console.log('Boom, I caught you!');
    } 
  }
});

setInterval (function() {  // every 5 seconds end the Cache to the CrowdChess-Server and empty them
  if (moveEventCache.length != 0)
    client.write(JSON.stringify(moveEventCache));
    moveEventCache = [];
  if (aggregatorEventCache.length != 0)  
    client.write(JSON.stringify(aggregatorEventCache));
    aggregatorEventCache = [];
  if (readyEventCache != 0)
    client.write(JSON.stringify(readyEventCache));
    readyEventCache = [];
  if (setTimeEventCache != 0)
    client.write(JSON.stringify(setTimeEventCache));
    setTimeEventCache = [];
  if (setReadyEventCache != 0)
    client.write(JSON.stringify(setReadyEventCache));
    setReadyEventCache = [];
  if (resignEventCache != 0)
    client.write(JSON.stringify(resignEventCache));
    resignEventCache = [];
  for (var i = 0; i < userStats.length; i++) {
    console.log(userStats[i]);
  }
}, 5000)

client.on('connect', function() {
  console.log('Client Connected!');
});

client.on('close', function() {
  console.log('Connection Closed!');
});

client.on('error', function() {
  console.log("Handled Error!");
});


// ---- Communication with CrowdChess-Server ---- //


