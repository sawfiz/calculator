const btnEls = Array.from(document.querySelectorAll(".btn"));
const numEls = Array.from(document.querySelectorAll(".num"));
const opEls = Array.from(document.querySelectorAll(".op"));
const displayEl = document.querySelector(".display");
const clearEl = document.querySelector("#clear");
const deleteEl = document.querySelector("#delete");

let display = "0";
displayEl.innerText = display;

let a = undefined;
let b = undefined;
let input = "";
let newNum = true;
let operation = "";
let decimal = false;
let state = "waitForA";

btnEls.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        animateButtonPress(e);
    });
});

numEls.forEach((num) => {
    num.addEventListener("click", () => {
        if (newNum === true) {
            input = num.innerText;
            newNum = false;
        } else {
            if (num.innerText === ".") {
                if (decimal === false) {
                    decimal = true;
                    input = input + num.innerText;
                }
            } else {
                input = input + num.innerText;
            }
        }
        console.log("input: ", input);
        console.log(typeof input);
        displayEl.innerText = input;
    });
});

opEls.forEach((op) => {
    op.addEventListener("click", () => {
        switch (state) {
            case "waitForA":
                if (input !== "") {
                    a = +input;
                    if (op.innerText !== "=") {
                        operation = op.innerText;
                        input = "";
                        newNum = true;
                        state = "waitForB";
                    }
                }
                animateDisplayBlink();
                break;
            case "waitForB":
                if (input !== "") {
                    b = +input;
                    input = "";
                    result = calculate();
                    a = result;
                    displayEl.innerText = result;
                    state = "gotResult";
                }
                break;
            case "gotResult":
                if (op.innerText === "=") {
                    result = calculate();
                    a = result;
                    displayEl.innerText = result;
                } else {
                    if (input === "") {
                        state = "waitForB";
                        operation = op.innerText;
                    } else {
                        a = +input;
                        operation = op.innerText;
                        input = ""
                        b = undefined;
                        state = "waitForB"
                    }
                }
                break;
            default:
                break;
        }
        console.log(`state: ${state}  a: ${a}  b: ${b}  input: ${input}`);
    });
});

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

clearEl.addEventListener("click", () => {
    a = 0;
    b = 0;
    newNum = true;
    display = "0";
    displayEl.innerText = display;
    decimal = false;
});

deleteEl.addEventListener("click", () => {
    if (input.length === 1) {
        input = "0";
    } else {
        if (input[input.length - 1] === ".") {
            decimal = false;
        }
        input = input.substring(0, input.length - 1);
    }
    displayEl.innerText = input;
});

async function animateButtonPress(e) {
    e.target.classList.add("active");
    await delay(100);
    e.target.classList.remove("active");
}

async function animateDisplayBlink() {
    displayEl.classList.add("active");
    await delay(100);
    displayEl.classList.remove("active");
}

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
