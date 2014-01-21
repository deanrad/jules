define ['coffee!js/jules/world'], (Jules) ->
  describe 'Jules', ->
    it 'should not be nil', ->
      expect(Jules).to.not.eq(undefined)
    it 'should have a current cycle', ->
      expect(Jules.current_cycle).to.not.eq(undefined)
