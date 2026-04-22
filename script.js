// --- Navigation Logic ---
onEvent("BACcalculator", "click", function() { setScreen("screen1"); });
onEvent("DesignatedDriverPicker", "click", function() { setScreen("screen4"); });
onEvent("toVision", "click", function() { setScreen("screen5"); });

onEvent("toHome", "click", function() { setScreen("screen3"); });
onEvent("toHome4", "click", function() { setScreen("screen3"); });
onEvent("toHome5", "click", function() { setScreen("screen3"); });
onEvent("home", "click", function() { setScreen("screen3"); });

// --- VisionScan AI Logic ---
var hits = 0;
var totalMoves = 0;

onEvent("startScan", "click", function() {
  hits = 0;
  totalMoves = 0;
  hideElement("scanOverlay");
  showElement("eyeDot");
  
  // Moves the dot every 0.8 seconds
  var scanInterval = setInterval(function() {
    // Generate random positions within the black box (10% to 90% for safety)
    var xPos = Math.floor(Math.random() * 80) + 10;
    var yPos = Math.floor(Math.random() * 80) + 10;
    
    // Set the dot position
    setPosition("eyeDot", xPos, yPos);
    totalMoves++;
    
    // Test ends after 12 jumps
    if (totalMoves >= 12) { 
      clearInterval(scanInterval);
      finishVisionTest();
    }
  }, 800); 
});

// Capture hits on the moving dot
onEvent("eyeDot", "click", function() {
  hits++;
  // Feedback: Flash white quickly when hit
  setProperty("eyeDot", "background-color", "white");
  setTimeout(function() { 
    setProperty("eyeDot", "background-color", "#007AFF"); 
  }, 100);
});

function finishVisionTest() {
  hideElement("eyeDot");
  showElement("scanOverlay");
  showElement("scanResults");
  setText("scanStatus", "Assessment Complete");
  
  var accuracy = Math.round((hits / 12) * 100);
  setText("visionScore", "Stability Score: " + accuracy + "%");
  
  if (accuracy < 75) {
    setText("visionAdvice", "Warning: High gaze instability. Neural motor response is delayed. Do not drive.");
    setProperty("visionScore", "text-color", "#FF3B30"); 
  } else {
    setText("visionAdvice", "Normal range: Hand-eye coordination is stable. Use caution.");
    setProperty("visionScore", "text-color", "#34C759"); 
  }
}

// --- Driver Picker Logic ---
var nameList = [];

onEvent("add", "click", function() {
  var name = getText("text_input1");
  if(name !== "") {
    nameList.push(name);
    setText("people", nameList.join("\n"));
    setText("text_input1", ""); // Clear input
  }
});

onEvent("Choose", "click", function() {
  if(nameList.length > 0) {
    var pick = nameList[Math.floor(Math.random() * nameList.length)];
    setText("driverName", pick);
  }
});

onEvent("restart", "click", function() {
  nameList = [];
  setText("people", "No names yet...");
  setText("driverName", "...");
});

// --- BAC Calculator Logic ---
onEvent("Go!", "click", function() {
  // 1. Get User Input
  var gender = getText("sex");
  var weight = getNumber("weight");
  var drinks = getNumber("drinkNumber");
  var hours = getNumber("hours");
  
  // 2. Constants
  var r = (gender === "Male") ? 0.68 : 0.55;
  
  // 3. Widmark Formula: BAC = [ (Alcohol / (Weight * r)) * 100 ] - (0.015 * Hours)
  // Converting lbs to grams (1 lb = 453.59g) and drinks to grams (~14g per standard drink)
  var alcoholGrams = drinks * 14;
  var weightGrams = weight * 453.59;
  
  var bac = ((alcoholGrams / (weightGrams * r)) * 100) - (0.015 * hours);
  if (bac < 0) { bac = 0; } // Prevent negative numbers
  
  // 4. Update UI
  setText("estimatedBAC", bac.toFixed(3));
  setScreen("screen2");
  
  // 5. Set Advice and Images based on results
  if (bac >= 0.08) {
    setText("advice", "DANGER: You are over the legal limit. Do not drive. Call a ride-share or use the Driver Picker.");
    setImageURL("image1", "stop_sign.png"); // Ensure this file exists in your assets
  } else if (bac > 0.02) {
    setText("advice", "CAUTION: You have alcohol in your system. Impairment begins at any level. Consider waiting.");
    setImageURL("image1", "yellow_light.png");
  } else {
    setText("advice", "SAFE: You are currently under the limit. Always drive with caution.");
    setImageURL("image1", "green_light.png");
  }
});
