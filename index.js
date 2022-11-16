const display = (() => {
  const displayEl = document.querySelector('.display');

  // Utility function to create a delay
  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // Utility function to animate a display blink to indicate a key's been pressed
  async function animateDisplayBlink() {
    displayEl.classList.add('active');
    await delay(100);
    displayEl.classList.remove('active');
  }

  function updateDisplay(string) {
    const value = +string;

    // Limit number to display within 10 digits
    if (value > 9999999999) {
      displayEl.innerText = 'Too Large';
      return;
    }
    if (value < -999999999) {
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

  return { updateDisplay, animateDisplayBlink };
})();
display.updateDisplay('0');

const core = (() => {
  let a; // Operand A
  let b; // Operand B
  let operation; // Operator for calculation
  let state = 'waitForA'; // State indicator for the state machine
  let result;

  // Declare and initialize these variables
  let input = ''; // Keypad input
  let decimal = false; // Flag for indicating if decimal point has been used in a number

  // Utility function to consistently reset the input
  function resetInput() {
    input = '';
    decimal = false;
  }

  function convertOp(op) {
    operation = op.innerText;
    if (op.id === 'divide') operation = '/'; // Convert ÷ to /
    if (op.id === 'multiply') operation = '*'; // Conver ᳵ to *
  }

  // Utility function to perform the calculations
  function calculate() {
    console.log(a, operation, b);

    switch (operation) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return Math.round(a * b * 100000000) / 100000000;
      case '/':
        return Math.round((a / b) * 100000000) / 100000000;
      default:
        return null;
    }
  }

  function processOp(op) {
    display.animateDisplayBlink();
    console.log(
      `Got operator: ${op.innerText} state: ${state}  a: ${a}  b: ${b}  input: ${input}`
    );

    // State machine of the calculator
    switch (state) {
      // waitForA, wait for a valid Operand A to be entered
      case 'waitForA':
        // Recived an operator, but there is no input, stay in waiForA
        if (input === '') {
          display.animateDisplayBlink();
          state = 'waitForA';
          break;
        }
        if (input !== '') {
          // Received an operator, and there is an input
          if (op.innerText === '=') {
            // The operator is '=', stay in waitForA
            display.animateDisplayBlink();
            state = 'waitForA';
            break;
          } else {
            // The operator is one of '+-*/', register A and op, move to waitForB
            a = +input;
            convertOp(op);
            resetInput();
            state = 'waitForB';
          }
        }
        break;

      // waitForB, already received a valid Operand A and an operator, wait for a valid operand B
      case 'waitForB':
        // Recived an operator, but there is no input, stay in waiForA
        if (input === '') {
          convertOp(op);
          display.animateDisplayBlink();
          break;
        }
        // Received an operator and there is an input, calculate
        if (input !== '') {
          b = +input;
          result = calculate();
          display.updateDisplay(result.toString());
          resetInput();
          a = result;
          if (op.innerText === '=') {
            state = 'gotResult';
            break;
          } else {
            convertOp(op);
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
            display.updateDisplay(result.toString());
            break;
          } else {
            // There is an input, go to waitForA for user to complete the input
            state = 'waitForA';
            break;
          }
        } else if (input === '') {
          // Recived '+-*/'
          // Got no input, register the operator, use current result as A, go to waitForB
          convertOp(op);
          state = 'waitForB';
          break;
        } else {
          // Got an input, register as A, register the operator, go to waitForB
          a = +input;
          convertOp(op);
          resetInput();
          state = 'waitForB';
        }
        break;

      default:
        break;
    }
    // console.log(`state: ${state}  a: ${a}  b: ${b}  input: ${input}`);
  }

  //
  function processNum(number) {
    if (number === '.') {
      if (decimal === false) {
        // A decimal number that starts with ., add 0 in front
        decimal = true;
        // eslint-disable-next-line prefer-template
        input = input ? input + number : '0' + number;
      } else {
        // Ignore if the number already had a decimal point
        display.animateDisplayBlink();
      }
    } else if (input === '0' || input === undefined) {
      // Ignore 0 if it is the first char of a number
      input = number;
    } else {
      input += number;
    }
    console.log('input: ', input);
    display.updateDisplay(input);
  }

  function processDel() {
    // Special case: there is nothing to delete
    if (input === '' || input.length === 1) {
      resetInput();
      display.updateDisplay('0');
    } else {
      // Normal case: there is something to delete
      // Special case: last character is a decimal point
      if (input[input.length - 1] === '.') {
        decimal = false;
      }
      // Delete the last character of the input
      input = input.substring(0, input.length - 1);
      display.updateDisplay(input);
    }
  }

  function processClear() {
    a = 0;
    b = 0;
    resetInput();
    display.updateDisplay('0');
  }
  
  function processMinus() {
    input = (+input * (-1)).toString();
    display.updateDisplay(input);
  }


  return {
    processNum,
    processOp,
    processClear,
    processDel,
    processMinus,
  };
})();

const clickHandler = (() => {
  const numEls = Array.from(document.querySelectorAll('.num'));
  const opEls = Array.from(document.querySelectorAll('.op'));
  const clearEl = document.getElementById('clear');
  const deleteEl = document.getElementById('delete');
  const minusEl = document.getElementById('plus-minus');

  // Getting number inputs from keypad
  numEls.forEach((num) => {
    num.addEventListener('click', () => {
      core.processNum(num.innerText);
    });
  });

  // Get operand input from keypad
  opEls.forEach((op) => {
    op.addEventListener('click', () => {
      core.processOp(op);
    });
  });

  // The Clear button event listener
  clearEl.addEventListener('click', () => {
    core.processClear();
  });

  // The Delete button event listener
  deleteEl.addEventListener('click', () => {
    core.processDel();
  });

  // The plus/minus button event listener
  minusEl.addEventListener('click', () => core.processMinus());
})();
