# Note: this renders only the 'inner content' of an event, it probably 
# ought to take care of duration/the whole div as a domelement
define [], () ->
  renderers = [
    ({handedness}) -> @+handedness
    ({accent}) -> @+(if accent? then '´' else '')
  ]

  bonsai = (data, templates...) ->
    do(str = "") ->
      for t in templates
        str = t.call(str, data)
      str


  classes: (evt) ->
    ("#{p}-#{v}" for p,v of evt).join(' ')

  content: (evt) ->
    bonsai(evt, renderers...)
