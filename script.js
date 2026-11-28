const display = document.getElementById("display")
const board = document.getElementById("board")
const pen = board.getContext("2d");
const color_picker = document.getElementById("pen_colour");
const pen_sizing = document.getElementById("pen_size");

let drawing = false;
let erasing = false;
let latestAnswer = "";

function appendToDisplay(input) {
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function calculate() {
    try {
        const result = evaluate(display.value);
        if (!isFinite(result)) {
            display.value = "Error"
            return;
        }
        display.value = String(result);
        latestAnswer = String(result);
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
        const value = Number(evaluate(display.value));
        
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

function evaluate(expression) {
    // for percentage: 200 + 10% = 220, 200 - 10% = 180, 200 * 10% = 20, 200*5+10% = 1100

    const number = "(\\d+\\.?\\d*)";

    const percent = new RegExp("^(.*?[\\d)])([+-])" + number + "%")
    while (percent.test(expression)) {
        expression = expression.replace(percent, "($1)$2(($1)*$3/100)");
    }
    expression = expression.replace(new RegExp(number + "%", "g"), "($1/100)");
    expression = expression.replace(/\^/g, "**");
    expression = expression.replace(new RegExp(number + "√" + number, "g"), "($2**(1/$1))");
    expression = expression.replace(new RegExp("√" + number, "g"), "($1**(1/2))");
    
    const result = eval(expression);
    return typeof result === "number" ? parseFloat(result.toPrecision(12)) : result;
}

document.addEventListener("keydown", function(event) {
    if (event.key.length == 1 && "^.+-*/0123456789".includes(event.key)) {
        appendToDisplay(event.key);
    } else if (event.key === "Enter") {
        event.preventDefault();
        calculate()
    } else if (event.key === "Backspace") {
        backspace();
    } else if (event.key == "Escape") {
        clearDisplay()
    } else if (event.key === "a") {
        answer();
    } else if (event.key === "f") {
        fraction();
    } else if (event.key === "r") {
        appendToDisplay("√")
    }
});

function saveimage() {
    const saveImage = document.createElement("a")
    saveImage.href = board.toDataURL("image/png");
    saveImage.download = "working-out.png";
    saveImage.click()
}

function applyErase() {
    pen.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    document.getElementById("eraser_btn").textContent = erasing ? "Draw" : "Eraser";
}

function erase() {
    erasing = !erasing;
    applyErase()
} 

function changepencolour() {
    pen.strokeStyle = color_picker.value
}

function slider() {
    pen.lineWidth = pen_sizing.value;
}

function resize_board() {
    board.width = window.innerWidth;
    board.height = window.innerHeight;
    pen.lineCap = "round";
    slider()
    changepencolour()
    applyErase()
}
resize_board();
window.addEventListener("resize", resize_board)

board.addEventListener("pointerdown", function(event) {
    drawing = true;
    pen.beginPath()
    pen.moveTo(event.clientX, event.clientY);
});

board.addEventListener("pointermove", function(event) {
    if (!drawing) return;
    pen.lineTo(event.clientX, event.clientY);
    pen.stroke();
});

window.addEventListener("pointerup", function() {
    drawing = false;
});

function clear_Board() {
    pen.clearRect(0, 0, board.width, board.height)
}

