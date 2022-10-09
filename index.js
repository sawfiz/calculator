const btnEls = Array.from(document.querySelectorAll('.btn'));
const numEls = Array.from(document.querySelectorAll('.num'));
const opEls = Array.from(document.querySelectorAll('.op'));
const displayEl = document.querySelector('.display');
const clearEl = document.querySelector('#clear');
const deleteEl = document.querySelector('#delete');

let a; // Operand A
let b; // Operand B
let input = ''; // Keypad input
let operation; // Operator
let decimal = false; // Flag for indicating if decimal point has been used in a number
let state = 'waitForA'; // State indicator for the state machine
let result;

// Utility function to create a delay
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Utility function to animate a button press
async function animateButtonPress(e) {
  e.target.classList.add('active');
  await delay(100);
  e.target.classList.remove('active');
}

// Utility function to animate a display blink
async function animateDisplayBlink() {
  displayEl.classList.add('active');
  await delay(100);
  displayEl.classList.remove('active');
}

// Utility function to consistently reset the input
function resetInput() {
  input = '';
  decimal = false;
}

// Utility function to perform the calculations
function calculate() {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      return null;
  }
}

function updateDisplay(string) {
  const value = +string;

  if (value > 999999999) {
    displayEl.innerText = 'Too Large';
    return;
  }
  if (value < -99999999) {
    displayEl.innerText = 'Too Small';
    return;
  }
  if (value > 0 && value < 0.000001) {
    displayEl.innerText = '0.00000000';
    return;
  }
  if (value < 0 && value > -0.000001) {
    displayEl.innerText = '0.00000000';
    return;
  }
  displayEl.innerText = string.substring(0, 10);
}

// Start of the main program
updateDisplay('0');

// For each button, when click, animate a button press
btnEls.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    animateButtonPress(e);
  });
});

// Getting number inputs from keypad
numEls.forEach((num) => {
  num.addEventListener('click', () => {
    if (num.innerText === '.') {
      if (decimal === false) {
        decimal = true;
        input = input ? input + num.innerText : '0' + num.innerText;
      } else {
        animateDisplayBlink();
      }
    } else if (input === '0' || input === undefined) {
      input = num.innerText;
    } else {
      input += num.innerText;
    }
    // console.log('input: ', input);
    updateDisplay(input);
  });
});

// Get operand input from keypad
opEls.forEach((op) => {
  op.addEventListener('click', () => {
    // console.log(
    //   `Got operator: ${op.innerText} state: ${state}  a: ${a}  b: ${b}  input: ${input}`
    // );
    animateDisplayBlink();
    // State machine of the calculator
    switch (state) {
      // waitForA, wait for a valid Operand A to be entered
      case 'waitForA':
        // Recived an operator, but there is no input, stay in waiForA
        if (input === '') {
          animateDisplayBlink();
          state = 'waitForA';
          break;
        }
        if (input !== '') {
          // Received an operator, and there is an input
          if (op.innerText === '=') {
            // The operator is '=', stay in waitForA
            animateDisplayBlink();
            state = 'waitForA';
            break;
          } else {
            // The operator is one of '+-*/', register A and op, move to waitForB
            a = +input;
            operation = op.innerText;
            resetInput();
            state = 'waitForB';
          }
        }
        break;

      // waitForB, already received a valid Operand A and an operator, wait for a valid operand B
      case 'waitForB':
        // Recived an operator, but there is no input, stay in waiForA
        if (input === '') {
          operation = op.innerText;
          animateDisplayBlink();
          break;
        }

        // console.log(
        //   `Got operator: ${op.innerText} state: ${state}  a: ${a}  b: ${b}  input: ${input}`
        // );
        // Received an operator and there is an input, calculate
        if (input !== '') {
          b = +input;
          resetInput();
          result = calculate();
          a = result;
          updateDisplay(result.toString());
          if (op.innerText === '=') {
            state = 'gotResult';
            break;
          } else {
            operation = op.innerText;
            state = 'waitForB';
          }
        }
        break;

      case 'gotResult':
        if (op.innerText === '=') {
          // Received a '='
          if (input === '') {
            // No input, repeat last calculation, stay in this state
            result = calculate();
            a = result;
            updateDisplay(result.toString());
            break;
          } else {
            // There is an input, go to waitForA for user to complete the input
            state = 'waitForA';
            break;
          }
        } else if (input === '') {
          // Recived '+-*/'
          // Got no input, register the operator, use current result as A, go to waitForB
          operation = op.innerText;
          state = 'waitForB';
          break;
        } else {
          // Got an input, register as A, register the operator, go to waitForB
          a = +input;
          operation = op.innerText;
          resetInput();
          state = 'waitForB';
        }
        break;

      default:
        break;
    }
    // console.log(`state: ${state}  a: ${a}  b: ${b}  input: ${input}`);
  });
});

// The Clear button event listener
clearEl.addEventListener('click', () => {
  a = 0;
  b = 0;
  resetInput();
  updateDisplay('0');
});

// The Delete button event listener
deleteEl.addEventListener('click', () => {
  if (input === '' || input.length === 1) {
    resetInput();
    updateDisplay('0');
  } else {
    if (input[input.length - 1] === '.') {
      decimal = false;
    }
    input = input.substring(0, input.length - 1);
    updateDisplay(input);
  }
});
