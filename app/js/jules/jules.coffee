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

  for s in [0..1]
    do(elapsed=0) ->
      for evt in events.at(s).xs
        evt.elapsed = elapsed
        elapsed += evt.duration

  Jules = 
    current_factors: rx.array([
      rx.array(["Repeat (R)", "Double"])
      rx.array(["Repeat (L)", "Space 1:2", "Shift 2:4"])
    ])
    cycle_length: 4
    resolution: 1
    current_cycle: events

