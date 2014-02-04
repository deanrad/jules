/* REPL test */
var src = rx.array([1,2]);

var doubler = function(a){
  return _.flatten(
    a.map( function(e){
      return [e,e];
    })
  )
};

var Filters = {
  "doubler": doubler
};

var filters = rx.array([]);

var net = rx.bind(function(){
  return _.reduce( filters.all(), 
            function(memo, filter){ 
              return filter(memo);
            }, src.all() );
});

net.onSet.sub( function(e){
  console.log("Net has changed")
  console.log(e);
});
