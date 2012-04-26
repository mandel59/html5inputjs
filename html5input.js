/*
  html5input.js
*/

(function(window, document) {

function setMembers(left, right) {
  for (var k in right) {
    left[k] = right[k];
  }
}

function elementOverlap(slaveElement, masterElement) {
  setMembers(slaveElement.style, {
    "position": "absolute",
    "top": (masterElement.offsetTop - slaveElement.clientTop) + "px",
    "left": (masterElement.offsetLeft - slaveElement.clientLeft) + "px",
    "width": masterElement.offsetWidth + "px",
    "height": masterElement.offsetHeight + "px",
  });
}

function inputRange(masterElement) {
  var delegateElement = document.createElement("div");
  var sliderElement = document.createElement("div");
  delegateElement.appendChild(sliderElement);
  document.body.appendChild(delegateElement);

  setMembers(masterElement, {
    "min": masterElement.getAttribute("min"),
    "max": masterElement.getAttribute("max"),
    "step": masterElement.getAttribute("step"),
  });
  function roundValue(value) {
    if (typeof step === "string" && step.toLowerCase() === "any") {
      return value;
    }
    var minimum = masterElement.min;
    var minNum = minimum ? parseFloat(minimum) : 0;
    var step = masterElement.step;
    var stepNum = step ? parseFloat(step) : 1;
    return Math.round((value - minNum) / stepNum) * stepNum + minNum;
  }
  var minNum = masterElement.min ? parseFloat(masterElement.min) : 0;
  var maxNum = masterElement.max ? parseFloat(masterElement.max) : 100;
  masterElement.value = roundValue((minNum + maxNum) / 2);
  elementOverlap(delegateElement, masterElement);
  setMembers(sliderElement.style, {
    "backgroundColor": "black",
  });

  function moveSlider() {
    var value = parseFloat(masterElement.value);
    var minNum = masterElement.min ? parseFloat(masterElement.min) : 0;
    var maxNum = masterElement.max ? parseFloat(masterElement.max) : 100;
    var croppedValue = Math.min(maxNum, Math.max(minNum, value));
    var rate = (croppedValue - minNum) / (maxNum - minNum);
    setMembers(sliderElement.style, {
      "height": (delegateElement.clientHeight * 0.875) + "px",
      "width": (delegateElement.clientHeight * 0.4375) + "px",
    });
    var sh = 0.5 * sliderElement.offsetHeight;
    var sw = 0.5 * sliderElement.offsetWidth;
    var top = 0.5 * delegateElement.clientHeight;
    var left = rate * (delegateElement.clientWidth - 2 * sw) + sw;
    setMembers(sliderElement.style, {
      "position": "absolute",
      "top": (top - sh) + "px",
      "left": (left - sw) + "px",
    });
  }
  moveSlider();
  function changeValue(event) {
    var x = event.clientX - delegateElement.clientLeft - delegateElement.offsetLeft;
    var sw = 0.5 * sliderElement.offsetWidth;
    var rate = (x - sw) / (delegateElement.clientWidth - 2 * sw);
    var minNum = masterElement.min ? parseFloat(masterElement.min) : 0;
    var maxNum = masterElement.max ? parseFloat(masterElement.max) : 100;
    var value = roundValue((maxNum - minNum) * rate);
    var newValue = Math.min(maxNum, Math.max(minNum, value)).toString();
    var prevValue = masterElement.value;
    if (newValue !== prevValue) {
      var changeEvent = document.createEvent("MutationEvent");
      changeEvent.initMutationEvent("change", true, false, masterElement, prevValue, newValue, "value", MutationEvent.MODIFICATION);
      masterElement.value = newValue;
      masterElement.dispatchEvent(changeEvent);
    }
  }
  masterElement.addEventListener("change", moveSlider);
  var mousedown = false;
  delegateElement.addEventListener("mousedown", function(event) {
    event.preventDefault();
  }, false);
  delegateElement.addEventListener("mousedown", function(event) {
    masterElement.focus();
    changeValue(event);
    moveSlider();
    mousedown = true;
  }, false);
  document.addEventListener("mousemove", function(event) {
    if (mousedown) {
      changeValue(event);
      moveSlider();
    }
  }, false);
  document.addEventListener("mouseup", function(event) {
    mousedown = false;
  }, false);
  masterElement.addEventListener("focus", function(event) {
    delegateElement.style.border = "solid thin orange";
    elementOverlap(delegateElement, masterElement);
    moveSlider();
  }, false);
  masterElement.addEventListener("blur", function(event) {
    delegateElement.style.border = "none";
    elementOverlap(delegateElement, masterElement);
    moveSlider();
  }, false);
}

function onload() {
  var inputElements = document.getElementsByTagName("input");
  for (var i = 0; i < inputElements.length; i++) {
    var inputElement = inputElements[i];
    if (inputElement.type !== "text") continue;
    var inputType = inputElement.attributes.getNamedItem("type").value.toLowerCase();
    if (inputType === "range") {
      inputRange(inputElement);
    }
  }
}

window.addEventListener("load", onload, false);

}(window, document));

