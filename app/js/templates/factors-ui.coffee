define [], () ->
  class TreeNode
    constructor: (value, children) ->
      @value = rx.cell(value)
      @children = rx.array(children)

  factor_tree = new TreeNode('root', [
    new TreeNode('alpha', [])
    new TreeNode('beta', [
      new TreeNode('gamma', [])
      new TreeNode('delta', [])
    ])
  ])

  recurse = (node) ->
    li [
      span {click: ->  }, rx.bind -> node.value.get()
      ul {class: 'sortable'}, node.children.map recurse
    ]

  create: (ignored) ->
    div {class: 'factor-list'}, [
      ul {class: 'sortable'}, [recurse(factor_tree)]
    ]
  # create: (all_factors) ->
  #   div {class: 'factor-list'}, [
  #     h3 'Factors:'
  #     div {class: 'all-factors'}, all_factors.map (factors) ->
  #       ul {class: 'factors sortable'}, factors.map (factor) ->
  #         li factor
  #   ]
