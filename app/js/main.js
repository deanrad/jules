/*globals rxt:false, exports:false */
var deps=["jquery", "jquery.sortable", "underscore", "underscore.string", "coffee-script", "reactive-coffee", "bootstrap", "css!/css/application", "css!/css/main"];
console.log("Loading up " + deps.join(","));
requirejs(deps, function(){
  rxt.importTags();
  bind = rx.bind;
  //_.mixin(_.str.exports())
});

require(["domReady!", 
        "jquery",
        "jwerty",
        "coffee!js/jules/world"], function(doc, $, jwerty, world){
  
  var world = world.create();
  var timer = world.timer;
  var ui    = world.ui;

  window.timer = timer;
  console.log("The dom will see you now");
  $('#jules-window').append(ui);
  $('.sortable').sortable();

  jwerty.key("space", timer.togglePlay, timer);
  jwerty.key("m", timer.toggleMute, timer);
  jwerty.key("↑", timer.incTempo);
  jwerty.key("↓", timer.decTempo);

});


