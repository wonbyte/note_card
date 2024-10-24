document.addEventListener("DOMContentLoaded", () => {
  const noteCard = document.getElementById("noteCard");
  const bpmInput = document.getElementById("bpmInput");
  const startStopButton = document.getElementById("startStopButton");
  const plusButton = document.getElementById("plusButton");
  const minusButton = document.getElementById("minusButton");

  const wholeNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const modifiers = ["", "#", "b"];

  let intervalId = null;
  let isRunning = false;

  function getRandomNote() {
    let note, modifier;
    while (true) {
      note = wholeNotes[Math.floor(Math.random() * wholeNotes.length)];
      modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
      if (
        (note === "B" && modifier === "#") ||
        (note === "C" && modifier === "b") ||
        (note === "E" && modifier === "#") ||
        (note === "F" && modifier === "b")
      ) {
        continue;
      }
      break;
    }
    return note + modifier;
  }

  function rotateNote() {
    const randomNote = getRandomNote();
    noteCard.textContent = randomNote;
  }

  function startRotation(bpm) {
    if (intervalId) clearInterval(intervalId);
    const interval = (60 / bpm) * 1000;
    rotateNote();
    intervalId = setInterval(rotateNote, interval);
    noteCard.classList.add("running");
  }

  function stopRotation() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    noteCard.classList.remove("running");
  }

  function getValidatedBPM(value) {
    return Math.max(1, Math.min(300, value)); // Constrain BPM between 25 and 200
  }

  startStopButton.addEventListener("click", () => {
    if (isRunning) {
      stopRotation();
      startStopButton.textContent = "Start";
    } else {
      let bpm = getValidatedBPM(parseInt(bpmInput.value, 10));
      bpmInput.value = bpm; // Ensure input is clamped
      if (!isNaN(bpm) && bpm > 0) {
        startRotation(bpm);
        startStopButton.textContent = "Stop";
      }
    }
    isRunning = !isRunning;
  });

  plusButton.addEventListener("click", () => {
    let bpm = getValidatedBPM(parseInt(bpmInput.value, 10) + 1);
    bpmInput.value = bpm;
    if (isRunning) startRotation(bpm);
  });

  minusButton.addEventListener("click", () => {
    let bpm = getValidatedBPM(parseInt(bpmInput.value, 10) - 1);
    bpmInput.value = bpm;
    if (isRunning) startRotation(bpm);
  });

  bpmInput.addEventListener("focus", () => {
    if (isRunning) {
      stopRotation();
      startStopButton.textContent = "Start";
      isRunning = false;
    }
  });

  bpmInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      let bpm = getValidatedBPM(parseInt(bpmInput.value, 10));
      bpmInput.value = bpm; // Ensure input is clamped
      if (!isNaN(bpm) && bpm > 0) {
        startRotation(bpm);
        startStopButton.textContent = "Stop";
        isRunning = true;
      }
    }
  });
});