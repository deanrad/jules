define ['coffee!js/jules/jules'], (Jules) ->
  describe 'Jules', ->
    it 'should not be nil', ->
      expect(Jules).to.not.eq(undefined)
    it 'should have a current cycle', ->
      expect(Jules.current_cycle).to.not.eq(undefined)
    describe 'Cycle Events', ->
      it 'should have a first event', ->
        expect(Jules.current_cycle.at(0)).to.not.eq(undefined)
