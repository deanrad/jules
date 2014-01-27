define [], () ->
  create: (factors) ->
    div [
      h3 'Factors:'
      ul {class: 'sortable'}, factors.map (factor) ->
        li factor
    ]