define [
  'coffee!js/jules/jules',
  'coffee!js/templates/world-ui',
  'coffee!js/templates/factors-ui',
  'coffee!js/jules/timer'], (Jules, WorldUi, FactorsUi, timer) ->
  create: () ->
    current_event = rx.cell(0)

    cycle_length = Jules.cycle_length
    current_cycle = Jules.current_cycle
    factors = Jules.current_factors
    timer = timer.create(current_event, cycle_length)

    timer: timer
    ui: div [
      WorldUi.create(timer, current_event, current_cycle, cycle_length)
      FactorsUi.create(factors)
    ]
