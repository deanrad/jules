/*globals exports:true */

var require={
  baseUrl: ".",
  urlArgs: "bust=" + (new Date()).getTime(),
  paths: {
    /* CSS */
    "bootstrap-css": "bower_components/bootstrap/dist/css/bootstrap.min", /*data-alt-path="//netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min"*/
    /* JS */
    "jquery": "bower_components/jquery/jquery.min", /*data-alt-path="//code.jquery.com/jquery-1.10.2.min"*/
    "bootstrap": "bower_components/bootstrap/dist/js/bootstrap.min", /*data-alt-path="//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min"*/
    "underscore": "bower_components/underscore/underscore-min", /*data-alt-path="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js"*/
    "underscore.string": "bower_components/underscore.string/dist/underscore.string.min", /*data-alt-path="//cdnjs.cloudflare.com/ajax/libs/underscore.string/2.3.3/underscore.string.min.js"*/
    "reactive-coffee": "bower_components/reactive-coffee/dist/reactive-coffee.min", /*data-alt-path="//www.chicagogrooves.com/js/reactive-coffee.min.js"*/
    /* Loader plugins */
    "css": "bower_components/require-css/css", /*data-alt-path="//www.chicagogrooves.com/js/require-css.min.js"*/
    "coffee": "bower_components/require-cs/cs", /*data-alt-path="//cdnjs.cloudflare.com/ajax/libs/require-cs/0.4.2/cs.js"*/
    "coffee-script": "bower_components/coffee-script/index", /*data-alt-path="//cdnjs.cloudflare.com/ajax/libs/coffee-script/1.6.3/coffee-script.min.js"*/
    "domReady": "bower_components/requirejs-domready/domReady", /*data-alt-path="//cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.js"*/
    "hbs": "bower_components/require-handlebars-plugin/hbs", /*data-alt-path="//cdnjs.cloudflare.com/ajax/libs/requirejs-handlebars/0.0.2/hbars.min.js"*/
    "text": "bower_components/requirejs-text/text" /*data-alt-path="//www.chicagogrooves.com/js/requirejs-text.js"*/
  },
  shim: {
    "bootstrap": ["jquery"],
    "reactive-coffee": {
      deps: ["jquery", "underscore", "underscore.string"],
      exports: "rx"
    },
    "underscore": {
      exports: "_"
    },
    "underscore.string": {
      exports: "_.str"
    }
  },
  map: {
    "*": {
    }
  }
};

if(typeof requirejs !== "undefined"){
  requirejs(require);
}

if(typeof exports !== "undefined"){
  exports.config = require;
}
