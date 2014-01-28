define ['coffee!js/jules/events'], (Events) ->
  create: (tempo, timer, current_event, current_cycle, cycle_length) ->
    refresh = rx.bind
    div {class: 'jules-world'}, [
      h2 "Jules keeps the beat."

      button {class: 'btn', click: -> timer.start() }, "Start"
      button {class: 'btn', click: -> timer.stop() }, "Stop"

      span refresh -> "#{current_event.get()+1}/#{cycle_length}"
      span refresh -> "Tempo: #{tempo.get()} bpm"

      button {class: 'btn', click: -> tempo.set(tempo.get()+2) }, "+"
      button {class: 'btn', click: -> tempo.set(tempo.get()-2) }, "-"

      div {class: 'current-cycle'}, current_cycle.map (evt)->
        pwidth = refresh -> evt.duration*100/cycle_length
        event_atts =
          class: refresh -> 
            Events.classes(evt, current_event.get())
          style: refresh -> "width: #{pwidth.get()}%"
        div event_atts, refresh -> Events.content(evt)
    ]
