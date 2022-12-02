import core from './core';
import display from './display';

const clickHandler = (() => {
  const numEls = document.querySelectorAll('.num');
  const opEls = document.querySelectorAll('.op');
  const clearEl = document.getElementById('clear');
  const deleteEl = document.getElementById('delete');
  const minusEl = document.getElementById('plus-minus');

  // Getting number inputs from keypad
  numEls.forEach((num) => {
    num.addEventListener('click', () => {
      display.animateDisplayBlink();
      display.updateDisplay(core.processNum(num.innerText));
    });
  });

  // Get operand input from keypad
  opEls.forEach((op) => {
    op.addEventListener('click', () => {
      display.animateDisplayBlink();
      const result = core.processOp(op);
      // Only update display if there's a calculation result
      if (result !== undefined) {
        display.updateDisplay(result);
      }
    });
  });

  // The Clear button event listener
  clearEl.addEventListener('click', () => {
    core.processClear();
    display.updateDisplay('0');
  });

  // The Delete button event listener
  deleteEl.addEventListener('click', () => {
    display.updateDisplay(core.processDel());
  });

  // The plus/minus button event listener
  minusEl.addEventListener('click', () => {
    display.animateDisplayBlink();
    display.updateDisplay(core.processMinus());
  });
})();

export default clickHandler;
