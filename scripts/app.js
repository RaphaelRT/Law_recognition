var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let intent, communication, danger, law_enforcement, action, obstacle, identification, place, vehicule

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;


var diagnostic = document.querySelector('.output');
const $start = document.querySelector('.start')

$start.addEventListener('click', () => {
  recognition.start();
  console.log('Ready');
})

recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var result = event.results[last][0].transcript;
  diagnostic.textContent = 'MOI : ' + result + '.';
  console.log('Confidence: ' + event.results[0][0].confidence);

  recognition.onspeechend = function() {
    recognition.stop();
  }

  const q = result;
  const uri = 'https://api.wit.ai/message?q=' + q;
  const auth = 'Bearer ' + '3MZJGW3Y6XFUAIEH3BEIDMCHF6S4OCBG';

  fetch(uri, {
      headers: {
        Authorization: auth
      }
    })
    .then(res => res.json())
    .then(res => {
      console.log(res)
      // console.log(res.entities.Intent[0].value)
      // console.log(res.entities.action[0].value)
      // console.log(res.entities.obstacle[0].value)
      // console.log(res.entities.vehicule[0].value)
      intent = res.entities.Intent[0].value
      action = res.entities.action[0].value
      obstacle = res.entities.obstacle[0].value
      vehicule = res.entities.vehicule[0].value
      init()
    })
  const init = () => {
    console.log(intent);
  }

}
