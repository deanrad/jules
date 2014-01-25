define ['coffee!js/jules/jules'], (Jules) ->
  create: () ->
    div [
      h3 'Factors:'
      ul {class: 'sortable'}, Jules.current_factors.map (factor) ->
        li factor
    ]