# calculator

- [calculator](#calculator)
  - [Things I leaned](#things-i-leaned)
    - [HTML](#html)
    - [CSS](#css)
    - [JS](#js)
      - [Revisit in 2022-11](#revisit-in-2022-11)
  - [To do](#to-do)
  - [Resources](#resources)
  - [Live site](#live-site)

[Project: Calculator](https://www.theodinproject.com/lessons/foundations-calculator) from the [Foundations](https://www.theodinproject.com/paths/foundations/courses/foundations) course, [the Odin Project](https://www.theodinproject.com/).

## Things I leaned
### HTML

### CSS
- Adding grid
- Use transition to animate button press

### JS
- Using a state machine as an algorthm to handle the calculator operations
- Computers have issues with floating point calculations.  Use `Math.round(number * 10) / 10` to correct it. I use 10,000,000 because my calculator has a display of 9 digits
- ```js
  case '*':
    return Math.round(a * b * 100000000) / 100000000;
  case '/':
    return Math.round(a / b * 100000000) / 100000000;
  ```
- Creating a delay with
    ```js
    function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
    }
    ```
- Then use `await dalay(100)` in an `async function someFunction() { ... }`

#### Revisit in 2022-11
- Modularize code into 3 objects:
  - clickHandler
  - display
  - core
- Add the +/- button
- Dispkay ÷ and ᳵ on buttons and convert them to / and * in the js code for calculations
- Use webpack 


## To do
- How to add a favicon
- There may still be bugs in the calculations.  But the focus during the 2022-11 revisit is to modularize the code.

## Resources

## Live site
https://sawfiz.github.io/calculator/
