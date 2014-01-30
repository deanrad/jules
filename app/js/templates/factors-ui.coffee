define [], () ->
  recurse = (node) ->
    li [
      span {click: ->  }, rx.bind -> node.value.get()
      ul node.children.map recurse
    ]

  create: (factors) ->
    div {}, factors.map (factor_tree) ->
        div {class: 'factor-list'}, [
          ul [recurse(factor_tree)]
        ]
    
  # create: (all_factors) ->
  #   div {class: 'factor-list'}, [
  #     h3 'Factors:'
  #     div {class: 'all-factors'}, all_factors.map (factors) ->
  #       ul {class: 'factors sortable'}, factors.map (factor) ->
  #         li factor
  #   ]
