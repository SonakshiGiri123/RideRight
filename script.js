// --- 1. THE CODE.ORG TRANSLATOR ---
function setScreen(screenId) {
    document.getElementById("screen1").style.display = "none";
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen3").style.display = "none";
    document.getElementById("screen4").style.display = "none";
    document.getElementById(screenId).style.display = "block";
}
function getText(id) { return document.getElementById(id).value || document.getElementById(id).innerText; }
function getNumber(id) { return parseFloat(document.getElementById(id).value) || 0; }
function setText(id, text) { document.getElementById(id).innerText = text; }
function setImageURL(id, url) { document.getElementById(id).src = url; }
function onEvent(id, eventType, callback) { 
    let element = document.getElementById(id);
    if(element) { element.addEventListener(eventType, callback); }
}
function appendItem(list, item) { list.push(item); }
function randomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// --- 2. YOUR RIDERIGHT CODE ---
setScreen("screen3");

// NOTE: You will need to upload these images to your GitHub repository for them to show up!
var stopSign = "stop.png";//stop
var moderate = "moderate.png";//mid
var go = "go.png"; //go

onEvent("BAC?", "click", function() {
  setText("questionmark", "Our BAC calculator will estimate your blood alcohol content & how long to wait, and symptoms. This is not medical advice.");
});
onEvent("driverPicker?", "click", function() {
  setText("questionmark", "Our Designated Driver Picker is a fair way to choose who stays sober! :).");
});
onEvent("BACcalculator", "click", function() {
  setScreen("screen1");
});
onEvent("DesignatedDriverPicker", "click", function() {
  setScreen("screen4");
});

// Using a querySelectorAll trick here since you used the ID "home" in multiple places
document.querySelectorAll("#home").forEach(btn => {
    btn.addEventListener("click", function() { setScreen("screen3"); });
});

onEvent("Go!", "click", function() {
  updateScreen();
  setScreen("screen2");
});

var listOfPeople = [];
var peopleText = "In the draw is...";

onEvent("add", "click", function() {
  appendItem(listOfPeople, getText("text_input1"));
  peopleText = (peopleText+"\n")+getText("text_input1");
  setText("people", peopleText);
  document.getElementById("text_input1").value = ""; // Clears the input box
});

var designatedDriverText = "The designated driver is:";
onEvent("Choose", "click", function() {
  designatedDriverText = "The designated driver is:";
  if (listOfPeople.length==0) {
    designatedDriverText = (designatedDriverText+"\n")+"Please enter atleast one name.";
  } else {
    designatedDriverText = designatedDriverText+"\n"+listOfPeople[(randomNumber(0, listOfPeople.length-1))];
  }
  setText("label6", designatedDriverText);
});

onEvent("restart", "click", function() {
  listOfPeople = [];
  peopleText = "People:";
  setText("people", peopleText);
  designatedDriverText = "The designated driver is:";
  setText("label6", "The designated driver is:");
});

onEvent("toHome", "click", function() {
  setScreen("screen3");
});

var text = "";
var bloodAlchoholLevel = 0;
var pureAlchoholOuncesNumber = 0;

function pureAlchoholOunces(drinkName, ouncesOfAlcholinADrink, percentage) {
  if (getText("drinkNameDropdown")==drinkName) {
    if (getText("ouncesDropdown")!="") {
      ouncesOfAlcholinADrink = getNumber("ouncesDropdown");
    }
    pureAlchoholOuncesNumber = ((getNumber("drinkNumber")*ouncesOfAlcholinADrink)*percentage)/100;
  }
}

var drinkNamesList = ["Light Beer","Regular Beer","Micro Brew", "White Wine","Red Wine","80 Proof (A Shot)","Vodka","Whiskey","Tequila","Gin","Rum"];
var drinkSizeList = [14,12,9,5,4,1.5,1.5,1.5,1.5,1.5,1.5];
var alchololPercentage = [4.2,5,6.7,12,15,40, 75, 40, 50, 40, 43];

function bloodAlchoholLevelCalculation(coefficent) {
  for (var i = 0; i < drinkNamesList.length; i++) {
    if (drinkNamesList[i]==getText("drinkNameDropdown")) {
      pureAlchoholOunces(drinkNamesList[i],drinkSizeList[i],alchololPercentage[i]);
    }
  }
  bloodAlchoholLevel = ((pureAlchoholOuncesNumber * 5.14) / (getNumber("weight")*coefficent)-0.015*getNumber("hours"));
  bloodAlchoholLevel = Math.round(bloodAlchoholLevel*100)/100;
}

function updateScreen() {
  if (getText("sex")=="Female") {
    bloodAlchoholLevelCalculation(0.66 );
  } else {
    bloodAlchoholLevelCalculation(0.73);
  }
  if (bloodAlchoholLevel<=0) {
    bloodAlchoholLevel = 0;
  }
  setText("estimatedBAC", bloodAlchoholLevel);
  setTextReport();
  setBACDescription();
}

function setTextReport() {
  if (bloodAlchoholLevel<0.01) {
    text = "Our Recommendation: If you feel good, you should be good to drive!";
    setImageURL("image1", go);
  } else if ((bloodAlchoholLevel<0.055)) {
    if (getText("ageDropdown") == "I'm under 21") {
      text = ("Our Recommendation: Because you're underage, anything above 0.01 is considered 'legally impaired'. Call a cab or wait atleast " + Math.round(bloodAlchoholLevel/(0.015)+0)) + " hours before driving.";
      setImageURL("image1", stopSign);
    } else {
      setImageURL("image1", go);
      text = "Our Recommendation: The legal limit is 0.08, so If you feel good, you should be good to drive!";
    }
  } else if ((bloodAlchoholLevel<0.08)) {
    if (getText("ageDropdown") == "I'm under 21") {
      text = ("Our Recommendation: Because you're underage, anything above 0.01 is considered 'legally impaired'. Call a cab or wait atleast "+ Math.round(bloodAlchoholLevel/(0.015)+0)) + " hour(s) before driving.";
      setImageURL("image1", stopSign);
    } else {
      text = "Our Recommendation: This is relatively close to the legal limit of 0.08, be cautious of driving.";
      setImageURL("image1", moderate);
    }
  } else if((bloodAlchoholLevel>0.08)) {
    if (getText("ageDropdown")=="I'm under 21") {
    text = ("Our Recommendation: This is at or above the general legal limit of 0.08 and 0.01 for those underage. Call a cab or wait atleast "+ Math.round((bloodAlchoholLevel)/(0.015)+0)) + " hours before driving!";
    } else {
      text = ("Our Recommendation: This is at or above the legal limit of 0.08. Call a cab or wait atleast "+ Math.round((bloodAlchoholLevel-0.07)/(0.015)+0)) + " hours before driving!";
    }
    setImageURL("image1", stopSign);
  }
  setText("advice", text);
}

function setBACDescription() {
  if (bloodAlchoholLevel==0) {
    text = text+"\n\nA blood alcohol level of 0% shows there’s no alcohol in your blood (you’re sober).";
  } else if ((bloodAlchoholLevel<=0.02)) {
    text = text+"\n\nAt a BAC of 0.01%-0.02% you may experience an altered mood, 'relaxation' and a slight loss of judgment.";
  } else if ((bloodAlchoholLevel<=0.05)) {
    text = text+"\n\nAt a BAC of 0.03%-0.05% you may feel uninhibited and have lowered alertness and impaired judgment." ;
  } else if ((bloodAlchoholLevel<=0.08)) {
    text = text+"\n\nAt a BAC of 0.06%-0.08%, you may have reduced muscle coordination, find it more difficult to detect danger and have impaired judgment and reasoning.";
  } else if ((bloodAlchoholLevel<=0.1)) {
    text = text+"\n\nAt a BAC of 0.09%-0.1%, you may have a reduced reaction time, slurred speech and slowed thinking.";
  } else if ((bloodAlchoholLevel<=0.15)) {
    text = text+"\n\nAt a BAC of 0.11%-0.15%, you may experience an altered mood, nausea and vomiting and loss of balance and some muscle control.";
  } else if ((bloodAlchoholLevel<=0.3)) {
    text = text+"\n\nAt a BAC of 0.16% - 0.3%, you may experience confusion, vomiting and drowsiness. If these symptoms worsen, consider getting medical attention!";
  } else if ((bloodAlchoholLevel<0.4)) {
    text = text+"\n\nAt a BAC of 0.31%-0.39%, you’ll likely have alcohol poisoning, a potentially life-threatening condition, and experience loss of consciousness, consider getting medical attention!";
  } else if (bloodAlchoholLevel>0.4) {
    text = text+"\n\nA BAC of 0.4+% is a potentially fatal blood alcohol level. You’re at risk of coma and death from respiratory arrest (absence of breathing), consider getting medical attention!" ;
  }
  setText("advice", text);
}

// This makes the house icon on the REPORT screen work
onEvent("toHome", "click", function() {
  setScreen("screen3");
});

// This makes the house icon on the DRIVER PICKER screen work
onEvent("toHome4", "click", function() {
  setScreen("screen3");
});

// --- Navigation Connections ---

onEvent("toHome", "click", function() {
  setScreen("screen3");
});

onEvent("toHome4", "click", function() {
  setScreen("screen3");
});

onEvent("home", "click", function() {
  setScreen("screen3");
});

// Ensure your 'Go!' button points to screen2
onEvent("Go!", "click", function() {
  setScreen("screen2");
});

onEvent("toHome", "click", function() {
  setScreen("screen3");
});

onEvent("toHome4", "click", function() {
  setScreen("screen3");
});

onEvent("home", "click", function() {
  setScreen("screen3");
});

onEvent("restart", "click", function() {
  setText("people", "No names yet...");
  setText("label6", "The driver is: ...");
  // If you have a list variable for names, clear it here too!
});

// Navigation
onEvent("toVision", "click", function() { setScreen("screen5"); });
onEvent("toHome5", "click", function() { setScreen("screen3"); });

var hits = 0;
var totalMoves = 0;

onEvent("startScan", "click", function() {
  hideElement("scanOverlay");
  showElement("eyeDot");
  hits = 0;
  totalMoves = 0;
  
  // High-speed tracking sequence
  var scanInterval = setInterval(function() {
    var x = Math.random() * 80 + 5; 
    var y = Math.random() * 80 + 5; 
    setPosition("eyeDot", x + "%", y + "%");
    totalMoves++;
    
    if (totalMoves >= 12) { 
      clearInterval(scanInterval);
      endVisionScan();
    }
  }, 750); // Moves every 0.75 seconds
});

onEvent("eyeDot", "click", function() {
  hits++;
  // Visual feedback for a "hit"
  setProperty("eyeDot", "background-color", "#5AC8FA");
  setTimeout(function() { setProperty("eyeDot", "background-color", "#007AFF"); }, 100);
});

function endVisionScan() {
  hideElement("eyeDot");
  showElement("scanOverlay");
  showElement("scanResults");
  setText("scanStatus", "Assessment Complete");
  
  var accuracy = Math.round((hits / 12) * 100);
  setText("visionScore", "Stability Score: " + accuracy + "%");
  
  if (accuracy < 75) {
    setText("visionAdvice", "Result: Impairment likely. Significant gaze instability detected. Do not operate a vehicle.");
    setProperty("visionScore", "color", "#FF3B30"); // System Red
  } else {
    setText("visionAdvice", "Result: Normal range. Visual tracking appears stable. Please remain cautious.");
    setProperty("visionScore", "color", "#34C759"); // System Green
  }
}
