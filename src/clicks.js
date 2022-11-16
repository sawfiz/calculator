import core from './core';

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

export default clickHandler;
