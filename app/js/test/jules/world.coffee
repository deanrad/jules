define ['coffee!js/jules/world'], (world) ->
  describe 'Jules World', ->
    it 'should have a timer with start/stop methods'

    it 'should have a tempo'

    describe 'UI', ->
      it 'should have a header'

      it 'should have an .current-cycle element', ->
        $cycle = world.find ".current-cycle"
        expect($cycle.length).to.eq(1)

    # DOH unattached dom nodes dont have width yet so cant yet test
    it 'should have the first child of the cycle have width 1/cycle_length'
