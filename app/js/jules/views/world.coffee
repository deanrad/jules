define ['coffee!js/jules/jules'], (Jules) ->
  _interval = null
  _current_event = rx.cell(0)
  _tempo = rx.cell(80)
  refresh = rx.bind

  implTick = ->
    c=_current_event.get()
    cnew = if c==Jules.current_cycle.length()-1 then 0 else c+1
    _current_event.set(cnew)

  doTick = ->
    implTick()
    _interval = setTimeout doTick, 1000/(_tempo.get()/60)

  window.Jules = Jules
  window.Tempo = _tempo

  # move to partial world-ui
  ui = div {class: 'jules-world'}, [
    h2 "Jules keeps the beat."
    button {class: 'btn', click: -> w.timer.start() }, "Start"
    button {class: 'btn', click: -> w.timer.stop() }, "Stop"
    span refresh -> "#{_current_event.get()+1}/#{Jules.current_cycle.length()}"
    span refresh -> "Tempo: #{_tempo.get()} bpm"
    div {class: 'current-cycle'}, Jules.current_cycle.map (evt, idx)->
      pwidth = refresh -> 100/Jules.current_cycle.length()
      event_atts = 
        class: refresh -> "event " + if _current_event.get()==idx then "current-event" else ""
        style: refresh -> "width: #{pwidth.get()}%"
      div event_atts, refresh -> evt.handedness
  ]

  w = {
    timer: 
      start: (-> _interval = setTimeout(doTick, 1000/(_tempo.get()/60)))
      stop: (-> clearTimeout(_interval) || console.log('stopped timer'))
    ui: ui
  }

  