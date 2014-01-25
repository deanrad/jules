define [], () ->
  events = rx.array([
    duration: 1
    handedness: 'R'
   ,
    duration: 1
    handedness: 'L'
   ,
    duration: 1
    handedness: 'R'
    accent: true
   ,
    duration: 1
    handedness: 'L'
    accent: true
  ])

  Jules = 
    current_cycle: events
