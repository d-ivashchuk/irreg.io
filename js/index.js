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
const translateRus = document.querySelector(".translationRus");
const translateEn = document.querySelector(".translationEn");
let language = "De";
let translationLang = "translationEn";
let counter = 0;
let hintCounter = 0;
let array = [];
$(document).ready(function() {
  $("#fullpage").fullpage({
    sectionsColor: ["#ED605E", "#FAFAFA", "#00AEFE", "whitesmoke", "#ccddff"],
    anchors: ["title", "settings", "trainer"],
    menu: "#menu",
    scrollingSpeed: 1000
  });
});
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function construct(array) {
  infinitive.innerHTML = array[counter].infinitive;
  translation.innerHTML = array[counter][translationLang];
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
        translation.classList.add("hidden");
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
        translation.classList.remove("hidden");
        pastTense.focus();
        counter += 1;
        hintCounter = 0;
        construct(verbs);
      }
    });

    hint.addEventListener("click", hintHandler);

    document.addEventListener("keydown", isolatedHintHandler);

    easy.addEventListener("click", item => {
      verbs = easyVerbs;
      prepareVerbs(verbs);
      hard.classList.add("inactive");
      allVerbs.classList.add("inactive");
    });
    hard.addEventListener("click", item => {
      verbs = hardVerbs;
      prepareVerbs(verbs);
      hard.classList.remove("inactive");
      allVerbs.classList.add("inactive");
    });
    allVerbs.addEventListener("click", item => {
      verbs = JSON.parse(request.responseText);
      prepareVerbs(verbs);
      hard.classList.remove("inactive");
      allVerbs.classList.remove("inactive");
    });
  };
  request.send();
}

build("De");

en.addEventListener("click", lang => {
  counter = 0;
  language = "En";
  build(language);
  de.classList.add("inactive");
  en.classList.remove("inactive");
});
de.addEventListener("click", lang => {
  counter = 0;
  language = "De";
  build(language);
  en.classList.add("inactive");
  de.classList.remove("inactive");
});
translateRus.addEventListener("click", lang => {
  counter = 0;
  translationLang = "translationRus";
  build(language);
  translateEn.classList.add("inactive");
  translateRus.classList.remove("inactive");
});
translateEn.addEventListener("click", lang => {
  counter = 0;
  translationLang = "translationEn";
  build(language);
  translateRus.classList.add("inactive");
  translateEn.classList.remove("inactive");
});
