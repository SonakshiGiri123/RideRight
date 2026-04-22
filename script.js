// --- 1. CORE TRANSLATOR FUNCTIONS ---
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
    let el = document.getElementById(id); 
    if(el) el.addEventListener(eventType, callback); 
}

// --- 2. DATA LISTS ---
var drinkNamesList = ["Light Beer","Regular Beer","Micro Brew", "White Wine","Red Wine","80 Proof (A Shot)","Vodka","Whiskey","Tequila","Gin","Rum"];
var drinkSizeList = [12, 12, 12, 5, 5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5];
var alcoholPercentage = [4.2, 5, 7, 12, 15, 40, 40, 40, 40, 40, 40];

// --- 3. NAVIGATION & HOME ---
onEvent("BACcalculator", "click", function() { setScreen("screen1"); });
onEvent("DesignatedDriverPicker", "click", function() { setScreen("screen4"); });
onEvent("home", "click", function() { setScreen("screen3"); });
onEvent("toHome", "click", function() { setScreen("screen3"); });
onEvent("toHome4", "click", function() { setScreen("screen3"); });

onEvent("BAC?", "click", function() {
  setText("questionmark", "Our BAC calculator will estimate your blood alcohol content and how long to wait. This is not medical advice.");
});
onEvent("driverPicker?", "click", function() {
  setText("questionmark", "Our Designated Driver Picker is a fair way to choose who stays sober.");
});

// --- 4. DESIGNATED DRIVER PICKER ---
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

// --- 5. BAC CALCULATION LOGIC ---
onEvent("Go!", "click", function() {
    var weight = getNumber("weight");
    var drinks = getNumber("drinkNumber");
    var hours = getNumber("hours");
    var gender = getText("sex");
    var age = getText("ageDropdown");
    var selection = getText("drinkNameDropdown");

    // Calculate Pure Alcohol Ounces
    var pureAlcohol = 0;
    for (var i = 0; i < drinkNamesList.length; i++) {
        if (drinkNamesList[i] === selection) {
            pureAlcohol = (drinks * drinkSizeList[i]) * (alcoholPercentage[i] / 100);
        }
    }

    var r = (gender === "Male") ? 0.73 : 0.66;
    var bac = ((pureAlcohol * 5.14) / (weight * r)) - (0.015 * hours);
    if (bac < 0) bac = 0;

    // Set text and images
    setText("estimatedBAC", bac.toFixed(3));
    var advice = "";
    var limit = (age === "Under 21") ? 0.01 : 0.08;

    if (bac === 0) {
        advice = "You are sober. No alcohol detected.";
        setImageURL("image1", "go.png");
    } else if (bac >= limit) {
        var wait = Math.ceil(bac / 0.015);
        advice = "DANGER: You are at or above the legal limit. Wait at least " + wait + " hour(s) or call a ride.";
        setImageURL("image1", "stop.png");
    } else if (bac > 0.02) {
        advice = "CAUTION: You have alcohol in your system. Reaction times are slowed.";
        setImageURL("image1", "moderate.png");
    } else {
        advice = "SAFE: You are currently under the limit. Drive carefully.";
        setImageURL("image1", "go.png");
    }

    setText("advice", advice);
    setScreen("screen2");
});
