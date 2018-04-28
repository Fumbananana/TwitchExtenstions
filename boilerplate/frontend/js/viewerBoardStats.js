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

var expertise = '1.00';
var conformity = '1.00';
var username = null;
var usernameNotNull = false;
var bool = false;
var promoting = false;
var piece_theme = '../img/chesspieces/wikipedia/{piece}.png';
var promotion_dialog = $('#promotion-dialog');
var promote_to;
var s = null;
var t = null;

document.getElementById("conformity").innerHTML = conformity;
document.getElementById("expertise").innerHTML = expertise;

document.getElementById("image").style.visibility = "visible";
document.getElementById("extension").style.visibility = "hidden";

//var fen = '8/3P3P/8/1k6/8/6K1/1p1p4/8 w - - 0 1';

var board,
  boardEl = $('#board'),
  game = new Chess(),
  crowdIsWhite,
  flag = true,
  squareToHighlight;

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
}, 1000);

var doSomeMagic = function(data) {
  if (data.length > 0) {
    board.position(data[0].board);
    game = new Chess(data[0].board); // so that possible moves in grey will be visible on the own chess pieces
    crowdIsWhite = data[0].crowdIsWhite;
    if (crowdIsWhite) {
      flag = true;
    }
    if (flag) {
      if (!crowdIsWhite) {
        board.flip();
        flag = false;
      }
    }
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i].username == username) {
        document.getElementById("conformity").innerHTML = (data[i].conformity).toFixed(2);
        document.getElementById("expertise").innerHTML = (data[i].expertise).toFixed(2);
      }
    }
  }
}

function getImgSrc(piece) {
  return piece_theme.replace('{piece}', game.turn() + piece.toLocaleUpperCase());
}

var onDialogClose = function() {
  sendMoveEvent();
  //move.promotion = promote_to;
  //makeMove(game, move_cfg);
}

var removeHighlights = function(color) {
  boardEl.find('.square-55d63')
    .removeClass('highlight-' + color);
};

// do not pick up pieces if the game is over
// only pick up pieces for White
var onDragStart = function(source, piece, position, orientation) {
  if ((orientation === 'white' && piece.search(/^w/) === -1) ||
      (orientation === 'black' && piece.search(/^b/) === -1)) {
    return false;
  }
};


$("#resignButton").click(function() {

  var dataEvent = {
    event: 'resign',
    username: username
  }

  $(resignButton).css('background-color','#390057');
  $.ajax({
    url: 'https://fumbananana.de:8443/boilerplate.js',
    //url: 'https://localhost:8080/boilerplate.js',
    type: 'POST',
    data: JSON.stringify(dataEvent),
    contentType: 'application/json',
    headers: {}
    }).done(function(data) {
      setTimeout(function() { $(resignButton).css('background-color','#2d1b2dad'); }, 5000);
  })
});


// init promotion piece dialog
$(function() {
  $("#promote-to").selectable({
  stop: function() {
    $( ".ui-selected", this ).each(function() {
      var selectable = $('#promote-to li');
      var index = selectable.index(this);
      if (index > -1) {
        var promote_to_html = selectable[index].innerHTML;
        var span = $('<div>' + promote_to_html + '</div>').find('span');
        promote_to = span[0].innerHTML;
      }
      promotion_dialog.dialog('close');
      $('.ui-selectee').removeClass('ui-selected');
    });
  }
})
});

var onDrop = function(source, target) {

  var piece = game.get(source).type;

  removeGreySquares();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback';

  // highlight white's move
  removeHighlights('white');
  boardEl.find('.square-' + source).addClass('highlight-white');
  boardEl.find('.square-' + target).addClass('highlight-white');

  //console.log('Der Move war von ' + source + ' nach ' + target);
  s = source;
  t = target;

  // is it a promotion?
  var source_rank = source.substring(2,1);
  var target_rank = target.substring(2,1);
  
  //console.log(piece);

  if (piece === 'p' &&
     ((source_rank === '7' && target_rank === '8') || (source_rank === '2' && target_rank === '1'))) {
       promoting = true;

    // get piece images
    $('.promotion-piece-q').attr('src', getImgSrc('q'));
    $('.promotion-piece-r').attr('src', getImgSrc('r'));
    $('.promotion-piece-n').attr('src', getImgSrc('n'));
    $('.promotion-piece-b').attr('src', getImgSrc('b'));

    //show the select piece to promote to dialog
    promotion_dialog.dialog({
      modal: true,
      height: 46,
      width: 230,
      resizable: false,
      draggable: false,
      close: onDialogClose,
      closeOnEscape: false,
      dialogClass: 'noTitleStuff'
    }).dialog('widget').position({
      of: $('#board'),
      my: 'middle middle',
      at: 'middle middle',
    });
    //the actual move is made after the piece to promote to
    //has been selected, in the stop event of the promotion piece selectable
    return;
  }

  sendMoveEvent();
};

var sendMoveEvent = function() {
  if (promoting) {
    var promoUpperCase = promote_to.charAt(0).toUpperCase();
    promoting = false;
    var dataEvent = {
      event: 'voteForMove',
      username: username,
      san: s + '-' + t + promoUpperCase
    }
  } else {
    var dataEvent = {
      event: 'voteForMove',
      username: username,
      san: s + '-' + t 
    }
  }
  
  //console.log(dataEvent);
  $.ajax({
    url: 'https://fumbananana.de:8443/boilerplate.js',
    type: 'POST',
    data: JSON.stringify(dataEvent),
    contentType: 'application/json',
    headers: {}
    }).done(function(data) {
      //console.log('success');
      doSomeMagic(data);
  });
}

// ------------------ Highlight Legal Moves ------------------- //

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);
  
  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

// ------------------------------------------------------------- //

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  //if (promoting) return; //if promoting we need to select the piece first
  game.undo();
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  piece_theme: piece_theme
};

board = ChessBoard('board', cfg);

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
      'Client-ID': 'rht5p4rtpme57avow6798xm06u4qvz'
      }
    }).done(function(data) {
      username = data.name;
      document.getElementById("image").style.visibility = "hidden";
      document.getElementById("extension").style.visibility = "visible";
  });
});