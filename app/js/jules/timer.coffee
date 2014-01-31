define ['coffee!js/jules/beeps'], (beeps) ->
  create: (this_beat, cycle_length)->
    default_inc = 2
    timer =
      tempo: rx.cell(80)
      interval: rx.cell(null)
      mute: rx.cell(true)
      toggleMute: -> @mute.set( !@mute.get() )
      beep: (beat) ->
        unless @mute.get()
          (if beat is 0 then beeps[0] else beeps[1]).play() 
      start: (-> 
        @beep(this_beat.get()) 
        @interval.set(setTimeout(@doTick, 1000/(timer.tempo.get()/60))))
      stop: (-> 
        #second stop resets to 0
        this_beat.set(0) unless @interval.get()
        clearTimeout(@interval.get()) 
        @interval.set(null)
      )
      incTempo: () -> timer.tempo.set(timer.tempo.get() + default_inc)
      decTempo: () -> timer.tempo.set(timer.tempo.get() - default_inc)
      doTick: (->
        timer.implTick()
        timer.interval.set(setTimeout(timer.doTick, 1000/(timer.tempo.get()/60))))
      implTick: (->
        i = this_beat.get()
        newidx = if i is cycle_length-1 then 0 else i+1
        this_beat.set(newidx))
      togglePlay: (-> if @interval.get() then @stop() else @start() )

    this_beat.onSet.sub ([old, beat]) ->
      timer.beep(beat) if timer.interval.get() and beeps and beeps.length is 2

    timer
