const display = (() => {
  const displayEl = document.querySelector('.display');

  // Utility function to create a delay
  function delay(time) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // Utility function to animate a display blink to indicate a key's been pressed
  async function animateDisplayBlink() {
    displayEl.classList.add('active');
    await delay(100);
    displayEl.classList.remove('active');
  }

  function updateDisplay(string) {
    if (string === '') {
      displayEl.innerText = '0';
      return;
    }

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

export default display;
