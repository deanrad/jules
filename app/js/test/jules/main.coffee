define ['coffee!js/jules/main'], (Jules) ->
  describe 'Jules', ->
    it 'should not be nil', ->
      expect(Jules.foo).to.eq('bar')