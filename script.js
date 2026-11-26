const display = document.getElementById("display")
let latestAnswer = "";

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

function fraction() {
    try {
        const value = Number(eval(display.value));
        
        if (isNaN(value) || Number.isInteger(value)) return;

        const [numerator, demominator] = decimaltofraction(value);
        display.value = numerator + "/" + demominator;
    }
    catch(error) {
        display.value = "Error";
    }
}

function decimaltofraction(decimal, maxDenominator = 1000) {
    const sign = decimal < 0 ? -1 : 1;
    const absolute_decimal = Math.abs(decimal);

    let previous_Numerator = 0;
    let current_Numerator = 1;

    let previous_denominator = 1;
    let current_denominator = 0;

    let remainder = absolute_decimal;

    do {
        const whole = Math.floor(remainder);
        const next_numerator = whole * current_Numerator + previous_Numerator;
        const next_denominator = whole * current_denominator + previous_denominator;

        if (next_denominator > maxDenominator) break;

        previous_Numerator = current_Numerator;
        current_Numerator = next_numerator;

        previous_denominator = current_denominator;
        current_denominator = next_denominator;

        remainder = 1 / (remainder - whole);
    } while (
        Math.abs(absolute_decimal - current_Numerator / current_denominator) > 1e-9 && isFinite(remainder)
    );

    return [sign * current_Numerator, current_denominator]
}