// --- UTILITIES ---
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
    let el = document.getElementById(id); if(el) el.addEventListener(eventType, callback); 
}

// --- DATA ---
var drinkNamesList = ["Light Beer","Regular Beer","Micro Brew", "White Wine","Red Wine","80 Proof (A Shot)","Vodka","Whiskey","Tequila","Gin","Rum"];
var drinkSizeList = [12, 12, 12, 5, 5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5];
var alchololPercentage = [4.2, 5, 7, 12, 15, 40, 40, 40, 40, 40, 40];
var bloodAlchoholLevel = 0;
var text = "";

// --- NAVIGATION ---
onEvent("BACcalculator", "click", function() { setScreen("screen1"); });
onEvent("DesignatedDriverPicker", "click", function() { setScreen("screen4"); });
onEvent("home", "click", function() { setScreen("screen3"); });
onEvent("toHome", "click", function() { setScreen("screen3"); });
onEvent("toHome4", "click", function() { setScreen("screen3"); });

onEvent("BAC?", "click", function() {
  setText("questionmark", "Our BAC calculator will estimate your blood alcohol content, how long to wait, and symptoms. This is not medical advice.");
});
onEvent("driverPicker?", "click", function() {
  setText("questionmark", "Our Designated Driver Picker is a fair way to choose who stays sober.");
});

// --- DESIGNATED DRIVER PICKER ---
var listOfPeople = [];
onEvent("add", "click", function() {
    var name = getText("text_input1");
    if(name != "") {
        listOfPeople.push(name);
        setText("people", "In the draw is:\n" + listOfPeople.join("\n"));
        document.getElementById("text_input1").value = "";
    }
});
onEvent("Choose", "click", function() {
    if(listOfPeople.length > 0) {
        var pick = listOfPeople[Math.floor(Math.random() * listOfPeople.length)];
        setText("driverName", pick);
    } else {
        setText("driverName", "Please enter names first");
    }
});
onEvent("restart", "click", function() {
    listOfPeople = [];
    setText("people", "No names yet");
    setText("driverName", "None selected");
});

// --- BAC LOGIC ---
onEvent("Go!", "click", function() {
    var weight = getNumber("weight");
    var drinks = getNumber("drinkNumber");
    var hours = getNumber("hours");
    var gender = getText("sex");
    var selection = getText("drinkNameDropdown");

    var pureAlcohol = 0;
    for (var i = 0; i < drinkNamesList.length; i++) {
        if (drinkNamesList[i] === selection) {
            pureAlcohol = (drinks * drinkSizeList[i] * alchololPercentage[i]) / 100;
        }
    }

    var r = (gender === "Male") ? 0.73 : 0.66;
    bloodAlchoholLevel = ((pureAlcohol * 5.14) / (weight * r)) - (0.015 * hours);
    bloodAlchoholLevel = Math.max(0, Math.round(bloodAlchoholLevel * 100) / 100);

    setText("estimatedBAC", bloodAlchoholLevel);
    setTextReport();
    setBACDescription();
    setScreen("screen2");
});

function setTextReport() {
    var age = getText("ageDropdown");
    if (bloodAlchoholLevel < 0.01) {
        text = "Our Recommendation: If you feel good, you should be good to drive.";
        setImageURL("image1", "go.png");
    } else if (bloodAlchoholLevel < 0.055) {
        if (age == "Under 21") {
            text = "Our Recommendation: Because you are underage, anything above 0.01 is considered legally impaired. Call a cab or wait at least " + Math.round(bloodAlchoholLevel/0.015) + " hours before driving.";
            setImageURL("image1", "stop.png");
        } else {
            text = "Our Recommendation: The legal limit is 0.08, so if you feel good, you should be good to drive.";
            setImageURL("image1", "go.png");
        }
    } else if (bloodAlchoholLevel < 0.08) {
        if (age == "Under 21") {
            text = "Our Recommendation: Because you are underage, anything above 0.01 is considered legally impaired. Call a cab or wait at least " + Math.round(bloodAlchoholLevel/0.015) + " hour(s) before driving.";
            setImageURL("image1", "stop.png");
        } else {
            text = "Our Recommendation: This is relatively close to the legal limit of 0.08. Be cautious of driving.";
            setImageURL("image1", "moderate.png");
        }
    } else {
        if (age == "Under 21") {
            text = "Our Recommendation: This is at or above the general legal limit of 0.08 and 0.01 for those underage. Call a cab or wait at least " + Math.round(bloodAlchoholLevel/0.015) + " hours before driving.";
        } else {
            text = "Our Recommendation: This is at or above the legal limit of 0.08. Call a cab or wait at least " + Math.round((bloodAlchoholLevel-0.07)/0.015) + " hours before driving.";
        }
        setImageURL("image1", "stop.png");
    }
}

function setBACDescription() {
    if (bloodAlchoholLevel == 0) {
        text += "\n\nA blood alcohol level of 0% shows there is no alcohol in your blood (you are sober).";
    } else if (bloodAlchoholLevel <= 0.02) {
        text += "\n\nAt a BAC of 0.01%-0.02% you may experience an altered mood, relaxation and a slight loss of judgment.";
    } else if (bloodAlchoholLevel <= 0.05) {
        text += "\n\nAt a BAC of 0.03%-0.05% you may feel uninhibited and have lowered alertness and impaired judgment.";
    } else if (bloodAlchoholLevel <= 0.08) {
        text += "\n\nAt a BAC of 0.06%-0.08%, you may have reduced muscle coordination, find it more difficult to detect danger and have impaired judgment and reasoning.";
    } else if (bloodAlchoholLevel <= 0.1) {
        text += "\n\nAt a BAC of 0.09%-0.1%, you may have a reduced reaction time, slurred speech and slowed thinking.";
    } else if (bloodAlchoholLevel <= 0.15) {
        text += "\n\nAt a BAC of 0.11%-0.15%, you may experience an altered mood, nausea and vomiting and loss of balance and some muscle control.";
    } else if (bloodAlchoholLevel <= 0.3) {
        text += "\n\nAt a BAC of 0.16% - 0.3%, you may experience confusion, vomiting and drowsiness. If these symptoms worsen, consider getting medical attention.";
    } else if (bloodAlchoholLevel < 0.4) {
        text += "\n\nAt a BAC of 0.31%-0.39%, you will likely have alcohol poisoning, a potentially life-threatening condition, and experience loss of consciousness. Consider getting medical attention.";
    } else {
        text += "\n\nA BAC of 0.4% or higher is a potentially fatal blood alcohol level. You are at risk of coma and death from respiratory arrest (absence of breathing). Consider getting medical attention.";
    }
    setText("advice", text);
}
