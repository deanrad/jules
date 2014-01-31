define ['jquery'], ($) ->
  create: (all_factors) ->
    new_order = (ul) ->
      ($(ul).find("li").map ->
        @.textContent).get()

    div {class: 'factor-list'}, [
      h3 'Factors:'
      div {class: 'all-factors'}, all_factors.map (factor) ->
        filters = ul {class: 'factors sortable'}, factor.filters.map (filter) ->
            li {dblclick: -> factor.filters.remove(filter)}, filter
        
        filters.on('sortupdate', ((e)->
          console.log(new_order(e.target))
          factor.filters.replace(new_order(e.target))
        ))

        # if we replace all the filters we need to make them sortable again
        # every time, whereas a splice or push we could just set and forget
        factor.filters.onChange.sub -> filters.sortable()

        div [
          h4 factor.generator.get()
          filters
        ]
    ]
