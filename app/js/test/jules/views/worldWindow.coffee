define ['coffee!js/jules/views/worldWindow'], (world) ->
  describe 'Jules Window on the world', ->
    it 'should have a header', ->
      expect(world.find("h2").length).to.eq(1)