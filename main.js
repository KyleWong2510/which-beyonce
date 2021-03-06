var completed1 = document.querySelector('#completed-1');
var completed2 = document.querySelector('#completed-2');
var completed3 = document.querySelector('#completed-3');
var completed4 = document.querySelector('#completed-4');
var completed5 = document.querySelector('#completed-5');
var completedMatchesArray = [completed1, completed2, completed3, completed4, completed5];
var gameSection = document.querySelector('.game-section');
var playerOneName = document.getElementById('player1');
var playerTwoName = document.getElementById('player2');
var container = document.getElementById('container');
var matchCountNum = document.querySelector('.match-counter-number');
var matchedCardDisplayArray;
var timerDisplay = document.querySelector('#total-time')
var playerInfoPage = document.querySelector('.player-info-page');
var gamePage = document.querySelector('.game-page');
var winPage = document.querySelector('.win-page');
var startGameTime;
//initialize counter
matchCountNum.innerHTML = 0;
var playerScore = [];
var scores = [];

var card1 = new Card(1, 1);
var card2 = new Card(2, 1);
var card3 = new Card(3, 2);
var card4 = new Card(4, 2);
var card5 = new Card(5, 3);
var card6 = new Card(6, 3);
var card7 = new Card(7, 4);
var card8 = new Card(8, 4);
var card9 = new Card(9, 5);
var card10 = new Card(10, 5);
var cardArray = [
  card1, card2, card3, card4, card5, card6, card7, card8, card9, card10
];
var deck1 = new Deck(cardArray);

window.onload = retrieve;

function store(data) {
  var storeDataString = JSON.stringify(data);
  var storedString = localStorage.setItem('topScores', storeDataString);
};

function retrieve() {
  var retrieveString = localStorage.getItem('topScores');
  scores = JSON.parse(retrieveString);
  displayTopTimes();
  return scores
};

function newGame() {
  if (!player1.value) {
    alert('Must have at least Player One input');
    return
  };
  startGame();
  playerInfoPage.classList.add('hide-page');
  gamePage.classList.remove('hide-page');
};

function startGame() {
  startGameTime = Date.now();
  cardArray = deck1.shuffle(cardArray);
  for (var i = 0; i < cardArray.length; i++) {
    var pictureUrl = getPictureUrl(cardArray[i].matchedInfo);
    document.querySelector('.game-section').innerHTML += `
    <div class='card-container' id='position${i}'>
      <div class='the-card'>
        <div class='guessing-cards front' data-cardid='${cardArray[i].cardId}' data-matchedInfo='${cardArray[i].matchedInfo}' data-matched='${cardArray[i].matched}' data-location='${i}'>
          KW
        </div>
        <div class='guessing-cards back' data-cardid='${cardArray[i].cardId}' data-matchedInfo='${cardArray[i].matchedInfo}' data-matched='${cardArray[i].matched}' data-location='${i}' style='background-image: url("${pictureUrl}");'>
        </div>
      </div>
    </div>`;
  };
};

function getPictureUrl(num) {
  switch (num) {
    case 1:
      return "./kyleimages/kylewii1.png";
      break;
    case 2:
      return "./kyleimages/kylewii2.png";
      break;
    case 3:
      return "./kyleimages/kylewoo1.png";
      break;
    case 4:
      return "./kyleimages/kylewoo2.png";
      break;
    case 5:
      return "./kyleimages/waitthatsamegan.jpg";
      break;
    default:
      console.log('aint no numbers here yo');
  };
};

function updateCounter() {
  matchCountNum.innerHTML = (deck1.matchedArray.length / 2);
  if (deck1.matchedArray.length === 10) {
    setTimeout(function() {
      endGame()
    }, 1500);
  };
};

function endGame() {
  playerScore.push(findElapsedTime());
  if (!player2.value) {
    gamePage.classList.add('hide-page');
    winPage.classList.remove('hide-page');
    timerDisplay.innerHTML = formatTime(findElapsedTime());
    topTimes(findElapsedTime());
  } else if (playerScore.length === 1) {
    replay();
  } else if (playerScore.length === 2) {
    twoPlayerWinPage();
  };
};

function topTimes(score) {
  if (scores === null) {
    scores = [];
  };
  scores.push(score);
  scores.sort(function(a, b) {
    return a - b
  });
  displayTopTimes();
};

function displayTopTimes() {
  if (scores === null) {
    scores = [];
  };
  var firstScore = formatTime(scores[0]);
  var secondScore = formatTime(scores[1]);
  var thirdScore = formatTime(scores[2]);
  if (scores.length === 1) {
    document.getElementById('first').innerHTML = firstScore;
    store(scores);
  } else if (scores.length === 2) {
    document.getElementById('first').innerHTML = firstScore;
    document.getElementById('second').innerHTML = secondScore;
    store(scores);
  } else if (scores.length === 3) {
    document.getElementById('first').innerHTML = firstScore;
    document.getElementById('second').innerHTML = secondScore;
    document.getElementById('third').innerHTML = thirdScore;
    store(scores);
  } else if (scores.length > 3) {
    document.getElementById('first').innerHTML = firstScore;
    document.getElementById('second').innerHTML = secondScore;
    document.getElementById('third').innerHTML = thirdScore;
    scores.pop();
    store(scores);
  } else {
    scores = [];
  };
};

function returnToStart() {
  if (playerOneName.value && playerTwoName.value) {
    newGame();
    document.querySelector('.game-section').innerHTML = ``;
    matchCountNum.innerHTML = 0;
    clearMatchedIcons(matchedCardDisplayArray);
    deck1.matchedArray = [];
    gamePage.classList.add('hide-page');
    winPage.classList.add('hide-page');
    playerInfoPage.classList.remove('hide-page');
    return
  };
  document.querySelector('.game-section').innerHTML = ``;
  matchCountNum.innerHTML = 0;
  clearMatchedIcons(matchedCardDisplayArray);
  deck1.matchedArray = [];
  gamePage.classList.add('hide-page');
  winPage.classList.add('hide-page');
  playerInfoPage.classList.remove('hide-page');
};

function twoPlayerWinPage() {
  winPage.classList.remove('hide-page');
  gamePage.classList.add('hide-page');
  if (playerScore[0] < playerScore[1]) {
    timerDisplay.innerHTML = formatTime(playerScore[0]);
  } else {
    timerDisplay.innerHTML = formatTime(playerScore[1]);
  };
  playerScore = [];
};

function replay() {
  document.querySelector('.game-section').innerHTML = ``;
  matchCountNum.innerHTML = 0;
  clearMatchedIcons(matchedCardDisplayArray);
  deck1.matchedArray = [];
  startGame();
  playerInfoPage.classList.add('hide-page');
  winPage.classList.add('hide-page');
  gamePage.classList.remove('hide-page');
};

function findElapsedTime() {
  var elapsedTime = Date.now() - startGameTime;
  return elapsedTime;
};

function formatTime(elapsedTime) {
  var minutes = Math.floor((elapsedTime / 1000) / 60);
  var seconds = (elapsedTime / 1000) % 60;
  if (seconds < 10) {
    return `${minutes}:0${seconds.toFixed(2)}`;
  } else {
    return `${minutes}:${seconds.toFixed(2)}`;
  };
};

container.onclick = function flipCard(event) {
  var closest = event.target.closest('.the-card');
  var currentSelected = event.target.dataset.location;
  if (deck1.selectedCards.length === 1 && deck1.cards[currentSelected].isSelected === true) {
    return
  } else if (deck1.selectedCards.length < 2) {
    closest.classList.toggle('flip');
    grabCards();
    hideMatched();
  };
};

function grabCards() {
  var currentSelected = event.target.dataset.location;
  if (deck1.selectedCards.length < 2) {
    deck1.addSelected(currentSelected);
  };
  if (deck1.selectedCards.length === 2) {
    deck1.checkSelectedCards();
  };
  autoFlip();
};

function autoFlip() {
  if (deck1.selectedCards.length == 2) {
    var flipDelay = window.setTimeout(flipClass, 1000)
  };
};

function flipClass() {
  deck1.selectedCards[0].isSelected = false;
  deck1.selectedCards[1].isSelected = false;
  var selected1 = findLocation(0);
  var selected2 = findLocation(1);
  var referenceDiv = document.querySelector('.game-section').childNodes;
  var divSelector1 = (2 * selected1) + 1;
  var divSelector2 = (2 * selected2) + 1;
  var div1 = referenceDiv[divSelector1].children;
  div1[0].classList.toggle('flip');
  var div2 = referenceDiv[divSelector2].children;
  div2[0].classList.toggle('flip');
  deck1.selectedCards = [];
};

function findSelectedLocation(idNum) {
  for (var i = 0; i < 10; i++) {
    if (idNum === deck1.cards[i].cardId) {
      var location = i;
    };
  };
  return location;
};

function findLocation(sCIndex) {
  var selected = deck1.selectedCards[sCIndex].cardId;
  var selectedLoc = findSelectedLocation(selected);
  return selectedLoc;
};

function hideMatched() {
  var matchedCounter = deck1.matchedArray.length;
  if (matchedCounter < 2) {
    return
  };
  var match1 = deck1.matchedArray[matchedCounter - 2].cardId;
  var match2 = deck1.matchedArray[matchedCounter - 1].cardId;
  var matchedLoc1 = findMatchedLocation(match1);
  var matchedLoc2 = findMatchedLocation(match2);
  var c = document.querySelector('.game-section').childNodes;
  childSelector1 = (2 * matchedLoc1) + 1;
  childSelector2 = (2 * matchedLoc2) + 1;
  c[childSelector1].classList.add('hide');
  c[childSelector2].classList.add('hide');
  addMatchedImage();
  updateCounter();
};

function findMatchedLocation(match) {
  for (var i = 0; i < 10; i++) {
    if (deck1.cards[i].cardId === match) {
      var matchedLoc = i;
      return matchedLoc;
    };
  };
};

function addMatchedImage() {
  matchedCardDisplayArray = [];
  for (var i = 0; i < deck1.matchedArray.length; i = i + 2) {
    (matchedCardDisplayArray.push(deck1.matchedArray[i].matchedInfo));
  };
  completedMatches(matchedCardDisplayArray);
};

function completedMatches(arr) {
  for (var i = 0; i < arr.length; i++) {
    var pictureUrl = getPictureUrl(arr[i]);
    completedMatchesArray[i].style = `background-image:url("${pictureUrl}"); background-position: center bottom;background-size: cover;`;
  };
};

function clearMatchedIcons(arr) {
  for (var i = 0; i < arr.length; i++) {
    var pictureUrl = getPictureUrl(arr[i]);
    completedMatchesArray[i].style = ``;
  };
};
