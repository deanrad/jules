define ['coffee!js/jules/views/worldWindow'], (world) ->
  describe 'Jules Window on the world', ->
    it 'should have a header', ->
      $header = world.find "h2"
      expect($header.length).to.eq(1)
      expect($header.text()).to.eq("Jules is here.")