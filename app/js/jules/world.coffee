define [
  'coffee!js/jules/jules',
  'coffee!js/templates/world-ui',
  'coffee!js/templates/factors-ui'], (Jules, WorldUi, FactorsUi) ->
  current_event = rx.cell(0)
  tempo = rx.cell(80)
  current_cycle = Jules.current_cycle

  interval = null
  timer =
    start: (-> interval = setTimeout(doTick, 1000/(tempo.get()/60)))
    stop: (-> clearTimeout(interval) || console.log('stopped timer'))

  implTick = ->
    i = current_event.get()
    newidx = if i==current_cycle.length()-1 then 0 else i+1
    current_event.set(newidx)

  doTick = ->
    implTick()
    interval = setTimeout doTick, 1000/(tempo.get()/60)

  div [
    WorldUi.create(tempo, timer, current_event, current_cycle)
    FactorsUi.create()
  ]
