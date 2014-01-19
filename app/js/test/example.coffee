define ['coffee!js/example'], (example)->
  describe "best practices", ->
    it "you should practice writing passing tests", ->
      expect( example.coolestNumber ).to.eql 42
