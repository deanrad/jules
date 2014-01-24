# Note: this renders only the 'inner content' of an event, it probably 
# ought to take care of duration/the whole div as a domelement
define [], () ->
  render_handedness = ({handedness}) -> @+handedness
  render_accent = ({accent}) -> "#{@}#{if accent? then '´' else ''}"

  renderers = [
    render_handedness
    render_accent
  ]

  bonsai = (data, templs...) ->
    do(str = "") ->
      for t in templs
        str = t.bind(str)(data)
        #console.log("Templ: " + str)
      str

  render: (evt) ->
    bonsai(evt, renderers...)
    

