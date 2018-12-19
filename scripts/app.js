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
// var constraints = {
//   audio: true
// }
// navigator.mediaDevices.getUserMedia(constraints)
//   .then(function(stream) {
//     /* use the stream */
if( screen.width <= 480 ) {
    console.log('coucou bande couille');
}
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    let intent, communication, danger, law_enforcement, action, obstacle, identification, place, vehicule

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const $container = document.querySelector('.container')
    var $talk = document.querySelector('.talk');
    const $micro = document.querySelector('.micro_img')
    var $response = document.querySelector('.response')
    const $micro_img = document.querySelector('.micro')
    var $form_send = document.querySelector('.form_send')
    const $information = document.querySelector('.information')
    const $dialogue_container = document.querySelector('.dialogue_container')
    const $cross = document.querySelector('.cross')
    const $pop_up = document.querySelector(".information_popup");



    const resize = () =>{
      if (screen.width > 1025) {
        var bounding = $response.getBoundingClientRect()
        console.log(bounding);
        const response_innerss =  bounding.bottom * 1
        console.log(response_innerss);
        $dialogue_container.style.width = response_innerss + 'px'
      }
    }
    resize()

window.addEventListener('resize', ()=>{
console.log(screen.width);
})


    $information.addEventListener('click', ()=>{
      $information.style.display="none"
      $pop_up.style.display = "block"
    })
    $cross.addEventListener('click', ()=>{
      $information.style.display="block"
      $pop_up.style.display = "none"
    })

    $form_send.addEventListener('submit', (_event) =>{
      _event.preventDefault()
      var submit = $talk.value
      const q = submit;
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
            console.log($response.offsetWidth);
            console.log($dialogue_container.offsetWidth);
            resize()
            responsiveVoice.speak("Je n'ai pas bien compris ce que vous avez dit, pouvez-vous répéter ?", "French Female", {
              rate: 1.2
            });
          } else {
            intent = res.entities.Intent[0].value
            // action = res.entities.action[0].value
            // obstacle = res.entities.obstacle[0].value
            // vehicule = res.entities.vehicule[0].value
            const dbRef = firebase.database().ref().child('Intent')
            dbRef.on('value', snap => {
              var json_string = JSON.stringify(snap.val(), null, 3)
              obj = JSON.parse(json_string)
              console.log(obj[intent]);
              var whatToSay = obj[intent]
              $response.innerHTML = whatToSay
              resize()
              responsiveVoice.speak(whatToSay, "French Female", {
                rate: 1.2
              });
            })
          }
        })



    })
    // document.onkeydown = function() {
    //   if (window.event.keyCode == '13') {
    //   console.log('test');
    //   }
    //    }

    window.addEventListener('load', () => {

      })
        var has_started = 0
        recognition.onspeechstart = function() {
          console.log(has_started);
          has_started = 1
          $micro.style.filter = "invert(0.5) sepia(1) saturate(5) hue-rotate(310deg) "
        };

        recognition.onspeechend = function() {
          console.log(has_started);
          has_started = 0
        };
        if (has_started == 0) {
          $micro.addEventListener('click', () => {
            recognition.stop()
              recognition.start();
              console.log('stopped');
          })

        }
        if (has_started == 1) {
          $micro.addEventListener('click', () => {
              recognition.stop();
              recognition.start();
              console.log('started');
          })
        }












    window.addEventListener('load', () => {
      console.log('loaded');
    })

    //
    // $micro.addEventListener('touchstart', (_event) => {
    //     _event.preventDefault()
    //     recognition.start();
    // })
    //

    recognition.onresult = function(event) {

      $micro.style.filter = "none"
      var last = event.results.length - 1;
      var result = event.results[last][0].transcript;
      $talk.value = result + '.';
      console.log('Confidence: ' + event.results[0][0].confidence);
      console.log();
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
            resize()
            responsiveVoice.speak("Je n'ai pas bien compris ce que vous avez dit, pouvez-vous répéter ?", "French Female", {
              rate: 1.2
            });
          }
          // else if (res.entities.Intent == undefined && !res.entities.insult_word == undefined) {
          //   $response.innerHTML = "C'est vulgaire ce que vous me dites!"
          //   responsiveVoice.speak("C'est vulgaire ce que vous me dites!", "French Female", {
          //     rate: 1.2
          //   });
          // }
          else {
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
          $dialogue_container.style.width = $response.offsetWidth * 1.2+ 'px'
          resize()
          responsiveVoice.speak(whatToSay, "French Female", {
          });
        })
      }

    }
  // })
