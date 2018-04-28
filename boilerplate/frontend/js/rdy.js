$( "#ready" ).click(function(){
  
  var dataEvent = {
    event: 'ready',
    username: username
  };

  var oldValue = document.getElementById("ready").innerHTML;
  document.getElementById("ready").disabled = true;
  document.getElementById("ready").innerHTML = 'processing...';

  setTimeout(function(){
    document.getElementById("ready").disabled = false;
    document.getElementById("ready").innerHTML = oldValue;
  }, 5000)

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
});