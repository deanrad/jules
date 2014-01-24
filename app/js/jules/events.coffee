# Note: this renders only the 'inner content' of an event, it probably 
# ought to take care of duration/the whole div as a domelement
define [], () ->
  renderers = [
    ({handedness}) -> handedness
    ({accent}) -> @+(if accent? then '´' else '')
  ]

  bonsai = (data, templs...) ->
    do(str = "") ->
      for t in templs
        str = t.bind(str)(data)
      str

  render: (evt) ->
    bonsai(evt, renderers...)
    

