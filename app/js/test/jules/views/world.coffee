define ['coffee!js/jules/views/world'], (worldWindow) ->
  describe 'Jules World', ->
    it 'should have a header', ->
      $header = worldWindow.ui.find "h2"
      expect($header.length).to.eq(1)
      expect($header.text()).to.eq("Jules is here.")

    it 'should have a timer with start/stop methods', ->
      expect(typeof worldWindow.timer?.start).to.eq("function")
      expect(typeof worldWindow.timer?.stop).to.eq("function")

    it 'should have a tempo', ->
      expect(worldWindow.tempo).to.be.a("number")

    it 'should have a current cycle', ->
      $cycle = worldWindow.ui.find ".current-cycle"
      expect($cycle.length).to.eq(1)

    # DOH unattached dom nodes dont have width yet so cant yet test
    it 'should have the first child of the cycle have width 1/cycle_length'