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
var constraints = {
  audio: true
}
navigator.mediaDevices.getUserMedia(constraints)
  .then(function(stream) {
    /* use the stream */

    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    let intent, communication, danger, law_enforcement, action, obstacle, identification, place, vehicule

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;


    var $talk = document.querySelector('.talk');
    const $micro = document.querySelector('.micro_img')
    var $response = document.querySelector('.response')
    const $micro_img = document.querySelector('.micro')

    // document.onkeydown = function() {
    //   if (window.event.keyCode == '13') {
    //     console.log($talk.value);
    //   }
    // }


    var count = 0
    $micro.addEventListener('mousedown', () => {
      recognition.start();
      count++
      console.log('start');
    })



    window.addEventListener('load', () => {
      console.log('loaded');
    })

    $micro.addEventListener('touchstart', () => {
      recognition.start();
      console.log('Ready');
    })
    $micro.addEventListener('touchend', () => {
      recognition.stop();
      console.log('Not Ready');
    })

    recognition.onresult = function(event) {
      var last = event.results.length - 1;
      var result = event.results[last][0].transcript;
      $talk.value = result + '.';
      console.log('Confidence: ' + event.results[0][0].confidence);
      console.log(count);
      recognition.onspeechend = function() {
        recognition.stop();
      }
      //   var press_enter = false
      //   document.onkeydown=function(){
      //     if(window.event.keyCode=='13'){
      //         press_enter = true
      //     }
      // }
      //   if (press_enter = false) {
      //     const q = result;
      //
      //   }
      //   else {
      //     const q = $talk.value;
      //   }
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
          console.log(res.entities.Intent);

          if (res.entities.Intent == undefined) {
            $response.innerHTML = "Je n'ai pas bien compris ce que vous avez dit, pouvez-vous répéter ?"
            responsiveVoice.speak("Je n'ai pas bien compris ce que vous avez dit, pouvez-vous répéter ?", "French Male", {
              rate: 1.2
            });
          } else {
            intent = res.entities.Intent[0].value
            // action = res.entities.action[0].value
            // obstacle = res.entities.obstacle[0].value
            // vehicule = res.entities.vehicule[0].value
            init()
          }
        })
      const init = () => {
        // Initialize Firebase
        const dbRef = firebase.database().ref().child('Intent')
        dbRef.on('value', snap => {
          var json_string = JSON.stringify(snap.val(), null, 3)
          obj = JSON.parse(json_string)
          console.log(obj[intent]);
          var whatToSay = obj[intent]
          $response.innerHTML = whatToSay
          responsiveVoice.speak(whatToSay, "French Male", {
            rate: 1.2
          });
        })
      }

    }
  })
