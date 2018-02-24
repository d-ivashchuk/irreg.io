const infinitive = document.querySelector(".infinitive");
const translation = document.querySelector(".translation");
const pastTense = document.querySelector(".pastTense");
const presentPerfect = document.querySelector(".presentPerfect");
const hint = document.querySelector(".hint");
const difficulty = {
  easy: true,
  hard: false
};
let counter = 0;
let hintCounter = 0;

window.onload = () => {
  counter = 0;
  hintCounter = 0;
  pastTense.value = "";
  presentPerfect.value = "";
};

var request = new XMLHttpRequest();
request.open(
  "GET",
  //The right url
  "https://raw.githubusercontent.com/d-ivashchuk/misc/master/verbs.json",
  false
);
request.onload = function() {
  var verbs = JSON.parse(request.responseText);
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(verbs);

  const construct = () => {
    infinitive.innerHTML = verbs[counter].infinitive;
    translation.innerHTML = verbs[counter].translation;
    if (counter == 0) {
      pastTense.setAttribute("placeholder", verbs[counter].pastTense);
      presentPerfect.setAttribute("placeholder", verbs[counter].presentPerfect);
    }
  };

  construct();

  pastTense.addEventListener("input", function() {
    if (pastTense.value.toLowerCase() === verbs[counter].pastTense) {
      presentPerfect.focus();
      hintCounter = 1;
    }
  });

  presentPerfect.addEventListener("input", function() {
    if (presentPerfect.value.toLowerCase() === verbs[counter].presentPerfect) {
      pastTense.value = "";
      presentPerfect.value = "";
      pastTense.removeAttribute("placeholder");
      presentPerfect.removeAttribute("placeholder");
      pastTense.focus();
      counter += 1;
      hintCounter = 0;
      construct();
    }
  });
  function hintHandler() {
    if (hintCounter === 0) {
      pastTense.value = "";
      pastTense.setAttribute("placeholder", verbs[counter].pastTense);
      hintCounter = 1;
    } else {
      presentPerfect.value = "";
      presentPerfect.setAttribute("placeholder", verbs[counter].presentPerfect);
      hintCounter = 0;
    }
  }

  hint.addEventListener("click", hintHandler);
  document.addEventListener("keydown", event => {
    if (event.altKey && event.shiftKey) {
      hintHandler();
    }
  });
};
request.send();
