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
    current_cycle: events.at(0)
    current_factors: ["Generator (R/L)", "Filter (Accents)[2]"]
