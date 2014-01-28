define [], () ->
  create: (all_factors) ->
    div {class: 'factor-list'}, [
      h3 'Factors:'
      div {class: 'all-factors'}, all_factors.map (factors) ->
        ul {class: 'factors sortable'}, factors.map (factor) ->
          li factor
    ]
