define ['coffee!js/jules/world'], (Jules) ->
  _interval = null

  w = {
    timer: 
      start: (-> _interval = setInterval( (->console.log('tick')), 1000/(w.tempo/60)))
      stop: (-> clearInterval(_interval) || console.log('stopped timer'))
    tempo: 50
    ui: div {class: 'jules-world'}, [
      h2 "Jules is here."
      a {click: -> w.timer.start() }, "Start"
      a {click: -> w.timer.stop() }, "Stop"
      div {class: 'current-cycle'}, Jules.current_cycle.map (evt)->
        pwidth = 100/Jules.current_cycle.length
        div {class: 'event', style: "width: #{pwidth}%"}, evt.handedness
    ]
  }

  