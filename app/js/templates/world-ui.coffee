define ['coffee!js/jules/events'], (Events) ->
  create: (tempo, timer, current_event, current_cycle) ->
    refresh = rx.bind
    div {class: 'jules-world'}, [
      h2 "Jules keeps the beat."

      button {class: 'btn', click: -> timer.start() }, "Start"
      button {class: 'btn', click: -> timer.stop() }, "Stop"

      span refresh -> "#{current_event.get()+1}/#{current_cycle.length()}"
      span refresh -> "Tempo: #{tempo.get()} bpm"

      button {class: 'btn', click: -> tempo.set(tempo.get()+2) }, "+"
      button {class: 'btn', click: -> tempo.set(tempo.get()-2) }, "-"

      div {class: 'current-cycle'}, current_cycle.map (evt, idx)->
        pwidth = refresh -> 100/current_cycle.length()
        event_atts =
          class: refresh -> "event " + if current_event.get()==idx then "current-event" else ""
          style: refresh -> "width: #{pwidth.get()}%"
        div event_atts, refresh -> Events.render(evt)
    ]
