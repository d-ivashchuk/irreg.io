const infinitive = document.querySelector(".infinitive");
const translation = document.querySelector(".translation");
const pastTense = document.querySelector(".pastTense");
const presentPerfect = document.querySelector(".presentPerfect");
const de = document.querySelector(".de");
const en = document.querySelector(".en");
const hint = document.querySelector(".hint");
const easy = document.querySelector(".easy");
const hard = document.querySelector(".hard");
const allVerbs = document.querySelector(".all");
let language = "De";
let counter = 0;
let hintCounter = 0;
let array = [];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function construct(array) {
  infinitive.innerHTML = array[counter].infinitive;
  translation.innerHTML = array[counter].translation;
  if (counter == 0) {
    pastTense.setAttribute("placeholder", array[counter].pastTense);
    presentPerfect.setAttribute("placeholder", array[counter].presentPerfect);
  }
}

window.onload = () => {
  counter = 0;
  hintCounter = 0;
  pastTense.value = "";
  presentPerfect.value = "";
};

var request = new XMLHttpRequest();
request.open(
  "GET",
  `https://raw.githubusercontent.com/d-ivashchuk/misc/master/verbs${language}.json`,
  false
);
request.onload = () => {
  verbs = JSON.parse(request.responseText);
  const easyVerbs = verbs.filter(item => {
    return item.frequency == "frequent";
  });
  const hardVerbs = verbs.filter(item => {
    return item.frequency === "infrequent";
  });
  shuffleArray(verbs);
  construct(verbs);

  pastTense.addEventListener("input", function() {
    if (pastTense.value.toLowerCase() === verbs[counter].pastTense) {
      presentPerfect.focus();
      hintCounter = 1;
    }
  });

  presentPerfect.addEventListener("input", () => {
    if (presentPerfect.value.toLowerCase() === verbs[counter].presentPerfect) {
      pastTense.value = "";
      presentPerfect.value = "";
      pastTense.removeAttribute("placeholder");
      presentPerfect.removeAttribute("placeholder");
      pastTense.focus();
      counter += 1;
      hintCounter = 0;
      construct(verbs);
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
  easy.addEventListener("click", item => {
    verbs = easyVerbs;
    construct(verbs);
  });
  hard.addEventListener("click", item => {
    verbs = hardVerbs;
    construct(verbs);
  });
  allVerbs.addEventListener("click", item => {
    verbs = JSON.parse(request.responseText);
    construct(verbs);
  });
  en.addEventListener("click", () => {
    language = "En";
  });
};
request.send();
