/*globals mocha:true */

/* These tests are the 'dependencies' of mocha.run() and so add yours accordingly */
var all_tests = [
];
var browser_tests = [
  'coffee!js/test/jules/jules',
  'coffee!js/test/jules/world'
]

function isBrowser(){
 return (typeof window === "object");
}

if(isBrowser()){
  all_tests = all_tests.concat(browser_tests);
  rxt.importTags();
}

/* In the browser, we load the config as 'var require', then requirejs picks it up.
   In node, loading is trickier, and repurposing the config that works for the browser
   with least redundancy is trickier still. Thus this eyebrow-raising loading code.
   Suggestions always welcome :) */
if(!isBrowser()){
  console.log("Running tests in node");
  var requirejs = require('requirejs');
  var Mocha = require('mocha');
  var mocha = new Mocha;

  ///globals expect:true define:true it:true
  expect = (typeof window !== "undefined" && window !== null) && (window.expect != null)
          ? window.expect : require('chai').expect;

  var rconfig = require("./js/requirejs-config.js").config;

  //override this to the jquery-less version
  rconfig.paths['reactive-coffee'] = '';

  var node_rjsconf = {
    baseUrl : __dirname,
    nodeRequire : require,
    paths: rconfig.paths,
    shim: rconfig.shim,
    map: rconfig.map
  };
  requirejs.config(node_rjsconf);
}

requirejs(all_tests, function(){
  if (typeof mocha !== 'undefined') {
    mocha.run();
  }
});
