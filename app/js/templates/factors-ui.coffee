define ['jquery'], ($) ->
  create: (all_factors) ->
    new_order = (ul) ->
      ($(ul).find("li").map ->
        @.textContent).get()

    div {class: 'factor-list'}, [
      h3 'Factors:'
      div {class: 'all-factors'}, all_factors.map (factor) ->
        filters = ul {class: 'factors sortable'}, factor.filters.map (filter) ->
            li filter
        
        filters.on('sortupdate', ((e)->
          console.log(new_order(e.target))
          factor.filters.replace(new_order(e.target))))

        # when rx updates, the new nodes need to be remade sortable
        factor.filters.onChange.sub -> filters.sortable()

        div [
          h4 factor.generator.get()
          filters
        ]
    ]
