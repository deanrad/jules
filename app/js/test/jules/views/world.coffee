define ['coffee!js/jules/views/world'], (world) ->
  describe 'Jules World', ->
    it 'should have a timer with start/stop methods', ->
      expect(typeof world.timer?.start).to.eq("function")
      expect(typeof world.timer?.stop).to.eq("function")

    it 'should have a tempo', ->
      expect(world.tempo.get()).to.be.a("number")

    describe 'UI', ->
      it 'should have a header', ->
        $header = world.ui.find "h2"
        expect($header.length).to.eq(1)
        expect($header.text()).to.eq("Jules keeps the beat.")

      it 'should have a current cycle element', ->
        $cycle = world.ui.find ".current-cycle"
        expect($cycle.length).to.eq(1)

    # DOH unattached dom nodes dont have width yet so cant yet test
    it 'should have the first child of the cycle have width 1/cycle_length'