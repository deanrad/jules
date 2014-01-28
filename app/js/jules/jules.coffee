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

  Jules = 
    current_factors: [
      ["Repeat (R)", "Double"]
      ["Repeat (L)", "Space 1:2", "Shift 2:4"]
    ]
    current_cycle: events.at(0)
