define [], () ->
  events = rx.array([
    rx.array([
      duration: 1.0
      handedness: 'R'
     ,
      duration: 1.0
      handedness: 'R'
     ,
      duration: 1.0
      handedness: 'R'
     ,
      duration: 1.0
      handedness: 'R'
    ])
   ,
    rx.array([
      duration: 2
      rest: true
     ,
      duration: 2
      handedness: 'L'
    ])
  ])

  #process events
  for s in [0..1]
    do(elapsed=0) ->
      for evt in events.at(s).xs
        evt.elapsed = elapsed
        elapsed += evt.duration

  # define factors
  class FactorChain
    constructor: (generator, filters) ->
      @generator = rx.cell(generator)
      @filters = rx.array(filters)

  factors = rx.array([
    new FactorChain("[R]", ["Doubler (1)", "Doubler (2)"])
    new FactorChain("[L]", ["Space", "Expand", "Shift"])
  ])

  # return
  Jules = 
    current_factors: factors
    cycle_length: 4
    resolution: 1
    current_cycle: events
