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
function prepareVerbs(array) {
  shuffleArray(array);
  construct(array);
}
function hintHandler() {
  if (hintCounter === 0) {
    pastTense.value = "";
    pastTense.setAttribute("placeholder", verbs[counter].pastTense);
    hintCounter = 1;
  } else if (hintCounter === 1) {
    presentPerfect.value = "";
    presentPerfect.setAttribute("placeholder", verbs[counter].presentPerfect);
    hintCounter = 0;
  }
  console.log(hintCounter);
}
function isolatedHintHandler(event) {
  if (event.altKey && event.shiftKey) {
    hintHandler();
  }
}

window.onload = () => {
  counter = 0;
  hintCounter = 0;
  pastTense.value = "";
  presentPerfect.value = "";
};

function build(lang) {
  var request = new XMLHttpRequest();

  request.open(
    "GET",
    `https://raw.githubusercontent.com/d-ivashchuk/misc/master/verbs${lang}.json`,
    false
  );

  request.onload = function() {
    verbs = JSON.parse(request.responseText);

    shuffleArray(verbs);

    const easyVerbs = verbs.filter(item => {
      return item.frequency == "frequent";
    });
    const hardVerbs = verbs.filter(item => {
      return item.frequency === "infrequent";
    });

    construct(verbs);

    pastTense.addEventListener("input", function() {
      if (pastTense.value.toLowerCase() === verbs[counter].pastTense) {
        presentPerfect.focus();
        hintCounter = 1;
      }
    });

    presentPerfect.addEventListener("input", function() {
      if (
        presentPerfect.value.toLowerCase() === verbs[counter].presentPerfect
      ) {
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
    console.log(verbs);
    hint.addEventListener("click", hintHandler);
    document.addEventListener("keydown", isolatedHintHandler);
    easy.addEventListener("click", item => {
      verbs = easyVerbs;
      prepareVerbs(verbs);
    });
    hard.addEventListener("click", item => {
      verbs = hardVerbs;
      prepareVerbs(verbs);
    });
    allVerbs.addEventListener("click", item => {
      verbs = JSON.parse(request.responseText);
      prepareVerbs(verbs);
    });
  };
  request.send();
}

build("De");

en.addEventListener("click", test => {
  counter = 0;
  build("En");
});
de.addEventListener("click", test => {
  counter = 0;
  build("De");
});
