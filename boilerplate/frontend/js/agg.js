$("#aggrMenu").change(function () {
  var aggOp = document.getElementById("aggrMenu");
  var agg = aggOp.options[aggOp.selectedIndex].value;

  var dataEvent = {
    event: 'upvoteMediator',
    aggregator: agg,
    username: username
  };

  var e = document.getElementById("aggrMenu");
  var oldValue2 = e.options[e.selectedIndex].text;
  e.options[e.selectedIndex].text = 'processing...';
  document.getElementById("aggrMenu").disabled = true;

  setTimeout(function(){
    document.getElementById("aggrMenu").disabled = false;
    e.options[e.selectedIndex].text = oldValue2;
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