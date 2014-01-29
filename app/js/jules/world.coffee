define [
  'coffee!js/jules/jules',
  'coffee!js/templates/world-ui',
  'coffee!js/templates/factors-ui'], (Jules, WorldUi, FactorsUi) ->
  current_event = rx.cell(0)
  tempo = rx.cell(80)

  cycle_length = Jules.cycle_length
  current_cycle = Jules.current_cycle
  factors = Jules.current_factors

  interval = null
  timer =
    start: (-> interval = setTimeout(doTick, 1000/(tempo.get()/60)))
    stop: (-> interval = clearTimeout(interval) )
    toggle: (-> if interval? then @stop() else @start() )

  implTick = ->
    i = current_event.get()
    newidx = if i==cycle_length-1 then 0 else i+1
    current_event.set(newidx)

  doTick = ->
    implTick()
    interval = setTimeout doTick, 1000/(tempo.get()/60)

  timer: timer
  ui: div [
    WorldUi.create(tempo, timer, current_event, current_cycle, cycle_length)
    FactorsUi.create(factors)
  ]
