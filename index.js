const btnEls = Array.from(document.querySelectorAll(".btn"));
const numEls = Array.from(document.querySelectorAll(".num"));
const opEls = Array.from(document.querySelectorAll(".op"));
const displayEl = document.querySelector(".display");
let display = "0";
displayEl.innerText = display;
let a = 0;
let b = 0;
let newNum = true;
let operation = "";

btnEls.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        animateButtonPress(e);
    });
});

numEls.forEach((num) => {
    num.addEventListener("click", () => {
        if (newNum === true) {
            display = num.innerText;
            newNum = false;
        } else {
            display = +(display + num.innerText);
        }
        console.log("display: ", display);
        displayEl.innerText = display;
    });
});

opEls.forEach((op) => {
    op.addEventListener("click", () => {
        switch (operation) {
            case "+":
                b = +display;
                display = +(a + b);
                break;
            case "-":
                b = +display;
                display = +(a - b);
                break;
            case "*":
                b = +display;
                display = +(a * b);
                break;
            case "/":
                b = +display;
                display = +(a / b);
                break;
            default:
                a = +display;
                break;
        }
        a = +display;
        displayEl.innerText = display;
        animateDisplayBlink();
        operation = op.innerText;
        console.log("a:", a, "operation: ", operation);
        newNum = true;
    });
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
