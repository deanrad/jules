/*globals rxt:false, exports:false */
var deps=["jquery", "underscore", "underscore.string", "coffee-script", "reactive-coffee", "bootstrap", "css!bootstrap-css", "css!/css/main"];
console.log("Loading up " + deps.join(","));
requirejs(deps, function(){
  rxt.importTags();
  //_.mixin(_.str.exports())
});

require(["domReady!", "jquery", "coffee!js/templates/example"], function(doc, $, tmpl){
  console.log("The dom will see you now");
  $("h2").html( tmpl({title: "Jules"}) );
});
