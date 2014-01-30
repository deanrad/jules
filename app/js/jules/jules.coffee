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
  class TreeNode
    constructor: (value, children) ->
      @value = rx.cell(value)
      @children = rx.array(children)

  factors = rx.array([
    new TreeNode('R hand', [
      new TreeNode('double', [])
      new TreeNode('space 1:2', [])
      new TreeNode('accent 1:2', [])
      new TreeNode('shift 2:4', [])
    ])
    new TreeNode('Bass Drum', [])
  ])

  # return
  Jules = 
    current_factors: factors
    cycle_length: 4
    resolution: 1
    current_cycle: events
