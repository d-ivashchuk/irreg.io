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
const hintsLabel = document.querySelector(".hintsTaken");
const redo = document.querySelector(".redo");
const progressBar = $(".progress");
const progressBarSmall = $(".progress__small");
let language = "De";
let translationLang = "translationEn";
let counter = 0;
let hintCounter = 0;
let array = [];
let currentProgress = 0;
let hintsTaken = 0;

$(document).ready(function() {
  $("#fullpage").fullpage({
    sectionsColor: ["#ED605E", "#FFEE58", "#00AEFE", "whitesmoke", "#ccddff"],
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
  hintsTaken += 1;
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
function progress() {
  step = 100 / verbs.length;
  if (currentProgress === 0) {
    currentProgress += step;
  } else if (currentProgress > 100) {
    currentProgress = 100;
  }
  progressBar.animate({ width: `${currentProgress}%` });
  progressBarSmall.animate({ width: `${currentProgress}%` });
  currentProgress += step;
}
function resetProgress() {
  pastTense.value = "";
  presentPerfect.value = "";
  counter = 0;
  hintsTaken = 0;
  currentProgress = 0;
  progressBar.animate({ width: `${currentProgress}%` });
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

    verbs = easyVerbs;

    construct(verbs);

    pastTense.addEventListener("input", function() {
      if (pastTense.value.toLowerCase() === verbs[counter].pastTense) {
        presentPerfect.select();
        hintCounter = 1;
        // translation.classList.add("hidden");
      }
    });

    presentPerfect.addEventListener("input", function() {
      if (
        presentPerfect.value.toLowerCase() === verbs[counter].presentPerfect
      ) {
        if (counter != verbs.length - 1) {
          pastTense.value = "";
          presentPerfect.value = "";
          pastTense.removeAttribute("placeholder");
          presentPerfect.removeAttribute("placeholder");
          translation.classList.remove("hidden");
          pastTense.select();
          counter += 1;
          hintCounter = 0;
          construct(verbs);
          progress();
        } else {
          progress();
          hintsLabel.innerHTML = hintsTaken;
          $(".trainer")
            .fadeOut(1000)
            .promise()
            .done(function() {
              $(".congrats").fadeIn(1000);
            });
        }
      }
    });

    hint.addEventListener("click", hintHandler);

    document.addEventListener("keydown", isolatedHintHandler);

    easy.addEventListener("click", item => {
      verbs = easyVerbs;
      prepareVerbs(verbs);
      hard.classList.add("inactive");
      allVerbs.classList.add("inactive");
      resetProgress();
    });
    hard.addEventListener("click", item => {
      verbs = hardVerbs;
      prepareVerbs(verbs);
      hard.classList.remove("inactive");
      allVerbs.classList.add("inactive");
      resetProgress();
    });
    allVerbs.addEventListener("click", item => {
      verbs = JSON.parse(request.responseText);
      prepareVerbs(verbs);
      hard.classList.remove("inactive");
      allVerbs.classList.remove("inactive");
      resetProgress();
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
  resetProgress();
});
de.addEventListener("click", lang => {
  counter = 0;
  language = "De";
  build(language);
  en.classList.add("inactive");
  de.classList.remove("inactive");
  resetProgress();
});
translateRus.addEventListener("click", lang => {
  counter = 0;
  translationLang = "translationRus";
  build(language);
  translateEn.classList.add("inactive");
  translateRus.classList.remove("inactive");
  resetProgress();
});
translateEn.addEventListener("click", lang => {
  counter = 0;
  translationLang = "translationEn";
  build(language);
  translateRus.classList.add("inactive");
  translateEn.classList.remove("inactive");
  resetProgress();
});

redo.addEventListener("click", fun => {
  resetProgress();
  build("De");
  $(".congrats")
    .fadeOut(1000)
    .promise()
    .done(function() {
      $(".trainer").fadeIn(1000);
    });
});
