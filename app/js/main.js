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
  
  world = world.create()

  console.log("The dom will see you now");
  $('#jules-window').append(world.ui);
  $('.sortable').sortable();

  jwerty.key("space", world.timer.toggle, world.timer);

});


