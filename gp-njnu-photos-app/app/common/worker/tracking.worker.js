// tracking.worker.js

postMessage("I\'m working before postMessage(\'ali\').");

onmessage = function (oEvent) {
  postMessage("Hi " + oEvent.data);
};
