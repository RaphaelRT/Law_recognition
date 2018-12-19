
//INITIALIZE FIREBASE
const talk = document.querySelector('.talk')
var config = {
  apiKey: "AIzaSyARbIXRJp5Ra4ug1IRm8Pw52Ghtuy2VhZQ",
  authDomain: "speechrecognition-cac63.firebaseapp.com",
  databaseURL: "https://speechrecognition-cac63.firebaseio.com",
  projectId: "speechrecognition-cac63",
  storageBucket: "speechrecognition-cac63.appspot.com",
  messagingSenderId: "826890476546"
};
firebase.initializeApp(config);

//INITIALIZE SPEECH RECOGNITION
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
let intent, communication, danger, law_enforcement, action, obstacle, identification, place, vehicule

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
recognition.lang = 'fr-FR';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//GET ELEMENTS FROM THE DOM
const $container = document.querySelector('.container')
var $talk = $container.querySelector('.talk');
const $micro = $container.querySelector('.micro_img')
var $response = $container.querySelector('.response')
const $micro_img = $container.querySelector('.micro')
var $form_send = $container.querySelector('.form_send')
const $information = $container.querySelector('.information')
const $dialogue_container = $container.querySelector('.dialogue_container')
const $cross = $container.querySelector('.cross')
const $pop_up = $container.querySelector(".information_popup");

//RESIZE DIALOGUE BUBBLE
window.addEventListener('load', () => {
  resize()
})

const resize = () => {
  if (screen.width > 1025) {
    var bounding = $response.getBoundingClientRect()
    const response_innerss = bounding.bottom * 1
    $dialogue_container.style.width = response_innerss + 'px'
  }
}

//CLICK ON INFORMATION MENU
$information.addEventListener('click', () => {
  $information.style.display = "none"
  $pop_up.style.display = "block"
})
$cross.addEventListener('click', () => {
  $information.style.display = "block"
  $pop_up.style.display = "none"
})

//WRITE AND PRESS ENTER TO SUBMIT THE QUESTION
$form_send.addEventListener('submit', (_event) => {
  //Remove the default function of the input
  _event.preventDefault()
  //send to wit.ai
  var submit = $talk.value
  const q = submit;
  const uri = 'https://api.wit.ai/message?q=' + q;
  const auth = 'Bearer ' + '3MZJGW3Y6XFUAIEH3BEIDMCHF6S4OCBG';

  fetch(uri, {
      headers: {
        Authorization: auth
      }
    })
    //create a json with the request and analyse
    .then(res => res.json())
    .then(res => {
      if (res.entities.Intent == undefined) {
        $response.innerHTML = "Je n'ai pas bien compris ce que vous avez dit, pouvez-vous répéter ?"
        resize()
        responsiveVoice.speak("Je n'ai pas bien compris ce que vous avez dit, pouvez-vous répéter ?", "French Female", {
          rate: 1.2
        });
      }
      else {
        //fill a DOM element with the result
        intent = res.entities.Intent[0].value
        const dbRef = firebase.database().ref().child('Intent')
        dbRef.on('value', snap => {
          var json_string = JSON.stringify(snap.val(), null, 3)
          obj = JSON.parse(json_string)
          var whatToSay = obj[intent]
          $response.innerHTML = whatToSay
          resize()
          //tell the result
          responsiveVoice.speak(whatToSay, "French Female", {
            rate: 1.2
          });
        })
      }
    })
})


//RECOGNIZE IF THE SPEECH START
var has_started = 0
recognition.onspeechstart = function() {
  has_started = 1
  $micro.style.filter = "invert(0.5) sepia(1) saturate(5) hue-rotate(310deg) "
};

//RECOGNIZE IF THE SPEECH END
recognition.onspeechend = function() {
  has_started = 0
};
//CLICK TO START OR RESTART
if (has_started == 0) {
  $micro.addEventListener('click', () => {
    recognition.stop()
    recognition.start();
  })
}
if (has_started == 1) {
  $micro.addEventListener('click', () => {
    recognition.stop();
    recognition.start();
  })
}


//LISTEN IF THE SPEECH IS GOING ON
recognition.onresult = function(event) {
  $micro.style.filter = "none"
  //take the last element and put it in the bar when you talk
  var last = event.results.length - 1;
  var result = event.results[last][0].transcript;
  $talk.value = result + '.';
  //if the speech has stop, stop the recognition
  recognition.onspeechend = function() {
    recognition.stop();
  }
//DO A REQUEST TO WIT.AI
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
      if (res.entities.Intent == undefined) {
        $response.innerHTML = "Je n'ai pas bien compris ce que vous avez dit, pouvez-vous répéter ?"
        resize()
        responsiveVoice.speak("Je n'ai pas bien compris ce que vous avez dit, pouvez-vous répéter ?", "French Female", {
          rate: 1.2
        });
      }
      else {
        intent = res.entities.Intent[0].value
        init()
      }
    })
  const init = () => {
    // Initialize Firebase
    const dbRef = firebase.database().ref().child('Intent')
    dbRef.on('value', snap => {
      var json_string = JSON.stringify(snap.val(), null, 3)
      obj = JSON.parse(json_string)
      var whatToSay = obj[intent]
      $response.innerHTML = whatToSay
      $dialogue_container.style.width = $response.offsetWidth * 1.2 + 'px'
      resize()
      responsiveVoice.speak(whatToSay, "French Female", {});
    })
  }
}
