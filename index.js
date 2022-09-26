const btnEls = Array.from(document.querySelectorAll(".btn"));
const numEls = Array.from(document.querySelectorAll(".num"));
const opEls = Array.from(document.querySelectorAll(".op"));
const displayEl = document.querySelector(".display");
const clearEl = document.querySelector("#clear");
const deleteEl = document.querySelector("#delete");

let display = "0";
displayEl.innerText = display;

let a = undefined; // Operand A
let b = undefined; // Operand B
let input = ""; // Keypad input
let operation = ""; // Operator
let decimal = false; // Flag for indicating if decimal point has been used in a number
let state = "waitForA"; // State indicator for the state machine

// For each button, when click, animate a button press
btnEls.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        animateButtonPress(e);
    });
});

// Getting number inputs from keypad
numEls.forEach((num) => {
    num.addEventListener("click", () => {
        if (num.innerText === ".") {
            if (decimal === false) {
                decimal = true;
                input = input + num.innerText;
            }
        } else {
            input = input + num.innerText;
        }
        console.log("input: ", input);
        displayEl.innerText = input;
    });
});

// Get operand input from keypad
opEls.forEach((op) => {
    op.addEventListener("click", () => {
        // State machine of the calculator
        switch (state) {
            // waitForA, wait for a valid Operand A to be entered
            case "waitForA":
                if (input !== "") {
                    a = +input;
                    if (op.innerText !== "=") {
                        operation = op.innerText;
                        resetInput();
                        state = "waitForB";
                    }
                }
                animateDisplayBlink();
                break;

            // waitForB, already received a valid Operand A and an operator, wait for a valid operand B
            case "waitForB":
                if (input !== "") {
                    b = +input;
                    resetInput();
                    result = calculate();
                    a = result;
                    displayEl.innerText = result;
                    state = "gotResult";
                }
                if (op.innerText !== "=") {
                    operation = op.innerText;
                }
                break;

            // gotResult, got a valid calculation result.  Thress things can happen here:
            // 1. a new number is entered with an new operator, this should be treated as Operand A
            // 2. a "=" received, this should result a repeat of last calculation, with the last result as new Operand A
            // 3. a "+ - * /" received, the last result should become the new Operand A, and go wait for B for calculation
            case "gotResult":
                if (input !== "") {
                    // Received a new number, record it as A, go wait for B
                    a = +input;
                    b = undefined;
                    resetInput();
                    operation = op.innerText;
                    state = "waitForB";
                } else {
                    // Received only an operator
                    if (op.innerText === "=") {
                        // Received =, repeat last calculation, stay in this state
                        result = calculate();
                        a = result;
                        displayEl.innerText = result;
                    } else {
                        // Received + - * /, use current result as A, and go wait for B
                        state = "waitForB";
                        operation = op.innerText;
                    }
                }
                break;
            default:
                break;
        }
        console.log(`state: ${state}  a: ${a}  b: ${b}  input: ${input}`);
    });
});

// Utility function to consistently reset the input
function resetInput() {
    input = "";
    decimal = false;
}

// Utility function to perform the calculations
function calculate() {
    switch (operation) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            return a / b;
        default:
            break;
    }
}

// The Clear button event listener
clearEl.addEventListener("click", () => {
    a = 0;
    b = 0;
    resetInput();
    displayEl.innerText = display;
});

// The Delete button event listener
deleteEl.addEventListener("click", () => {
    if (input === "" || input.length === 1) {
        resetInput();
        displayEl.innerText = "0";
    } else {
        if (input[input.length - 1] === ".") {
            decimal = false;
        }
        input = input.substring(0, input.length - 1);
        displayEl.innerText = input;
    }
});

// Utility function to animate a button press
async function animateButtonPress(e) {
    e.target.classList.add("active");
    await delay(100);
    e.target.classList.remove("active");
}

// Utility function to animate a display blink
async function animateDisplayBlink() {
    displayEl.classList.add("active");
    await delay(100);
    displayEl.classList.remove("active");
}

// Utility function to create a delay
function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
