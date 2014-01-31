define [
  'coffee!js/jules/jules',
  'coffee!js/templates/world-ui',
  'coffee!js/templates/factors-ui',
  'coffee!js/jules/beeps'], (Jules, WorldUi, FactorsUi, beeps) ->
  create: () ->
    current_event = rx.cell(0)
    tempo = rx.cell(80)

    cycle_length = Jules.cycle_length
    current_cycle = Jules.current_cycle
    factors = Jules.current_factors

    timer =
      interval: rx.cell(null)
      mute: rx.cell(false)
      beep: (beat) ->
        unless @mute.get()
          (if beat is 0 then beeps[0] else beeps[1]).play() 
      start: (-> 
        @beep(current_event.get()) 
        @interval.set(setTimeout(@doTick, 1000/(tempo.get()/60))))
      stop: (-> 
        #second stop resets to 0
        current_event.set(0) unless @interval.get()
        clearTimeout(@interval.get()) 
        @interval.set(null)
      )
      doTick: (->
        timer.implTick()
        timer.interval.set(setTimeout(timer.doTick, 1000/(tempo.get()/60))))
      implTick: (->
        i = current_event.get()
        newidx = if i is cycle_length-1 then 0 else i+1
        current_event.set(newidx))
      toggle: (-> if @interval.get() then @stop() else @start() )


    # hook into beeping (maybe)
    current_event.onSet.sub ([old, beat])->
      timer.beep(beat) if timer.interval.get() and beeps and beeps.length is 2

    timer: timer
    ui: div [
      WorldUi.create(tempo, timer, current_event, current_cycle, cycle_length)
      FactorsUi.create(factors)
    ]
