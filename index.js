const btnEls = Array.from(document.querySelectorAll(".btn"))
const numEls = Array.from(document.querySelectorAll(".num"))
const opEls = Array.from(document.querySelectorAll(".op"))
const displayEl = document.querySelector(".display")
let display = "0"
displayEl.innerText = display
let a = 0;
let b = 0;

btnEls.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        animateButtonPress(e);
    })
})

numEls.forEach((num) => {
    num.addEventListener("click", () => {
        display = +(display + num.innerText);
        console.log(display);
        displayEl.innerText = display;
        
    })
})



async function animateButtonPress(e) {
    e.target.classList.add("active")
    await delay(100)
    e.target.classList.remove("active")

}

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}