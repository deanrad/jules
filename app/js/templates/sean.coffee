define ["jquery"], ($) -> 
  window.viewmodel = rx.cell("Sean C")
  div {class: "sean"}, rx.bind -> " #{viewmodel.get()} sees #{ $("h2").length } h2s"
  