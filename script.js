const display = document.getElementById("display")

function appendToDisplay(input) {
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function calculate() {
    try {
        const result = String(eval(display.value));
        display.value = result;
        latestAnswer = result;
    }
    catch(error) {
        display.value = "Error";
    }
}

function backspace() {
    if (display.value === "Error") {
        display.value = "";
    } else {
    display.value = display.value.slice(0, -1)
    }
}

function answer() {
    appendToDisplay(latestAnswer);
}