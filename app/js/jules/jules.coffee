define [], () ->
  events = rx.array([
    rx.array([
      duration: 0.5
      handedness: 'R'
     ,
      duration: 0.5
      handedness: 'R'
     ,
      duration: 0.5
      handedness: 'R'
     ,
      duration: 0.5
      handedness: 'R'
    ])
   ,
    rx.array([
      duration: 1
      rest: true
     ,
      duration: 1
      handedness: 'L'
    ])
  ])

  do(elapsed=0) ->
    for evt in events.at(0).xs
      evt.elapsed = elapsed
      elapsed += evt.duration

  Jules = 
    current_factors: [
      ["Repeat (R)", "Double"]
      ["Repeat (L)", "Space 1:2", "Shift 2:4"]
    ]
    cycle_length: 2
    current_cycle: events.at(0)

