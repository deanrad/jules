define ['domReady!'], (doc)->
  doc.body.appendChild (div {id: 'audio-files'}, [
    audio {id: 'beep-1', src: '/audio/beep-1.wav', preload: 'auto'}
    audio {id: 'beep-2', src: '/audio/beep-2.wav', preload: 'auto'}
  ])[0]
  
  [doc.getElementById('beep-1'), doc.getElementById('beep-2')]