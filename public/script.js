const currentEl = document.getElementById('current');
const historyEl = document.getElementById('history');
const keys = document.querySelector('.keys');

let currentValue = '0';   // what is shown on the big display
let storedValue = null;   // the first number, saved when you press an operator
let operator = null;      // + - * /
let waitingForNext = true; // true when the next digit should start a new number

const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function calculate(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;
  }
}

// Avoids ugly results like 0.30000000000000004
function formatResult(n) {
  return String(parseFloat(n.toPrecision(12)));
}

function updateDisplay() {
  currentEl.textContent = currentValue;
}

function showError() {
  currentValue = 'Error';
  historyEl.textContent = '';
  storedValue = null;
  operator = null;
  waitingForNext = true;
  updateDisplay();
}

function inputNumber(digit) {
  if (waitingForNext) {
    currentValue = digit;
    waitingForNext = false;
  } else if (currentValue.replace(/[-.]/g, '').length < 12) {
    currentValue = currentValue === '0' ? digit : currentValue + digit;
  }
  updateDisplay();
}

function inputDecimal() {
  if (waitingForNext) {
    currentValue = '0.';
    waitingForNext = false;
  } else if (!currentValue.includes('.')) {
    currentValue += '.';
  }
  updateDisplay();
}

function chooseOperator(op) {
  if (currentValue === 'Error') return;
  const input = parseFloat(currentValue);

  if (operator && !waitingForNext) {
    // chained calculation, like 5 + 3 then pressing ×
    const result = calculate(storedValue, input, operator);
    if (result === null) return showError();
    storedValue = result;
    currentValue = formatResult(result);
  } else {
    storedValue = input;
  }

  operator = op;
  waitingForNext = true;
  historyEl.textContent = `${formatResult(storedValue)} ${symbols[op]}`;
  updateDisplay();
}

function equals() {
  if (operator === null || waitingForNext) return;
  const input = parseFloat(currentValue);
  const result = calculate(storedValue, input, operator);
  if (result === null) return showError();

  historyEl.textContent =
    `${formatResult(storedValue)} ${symbols[operator]} ${formatResult(input)} =`;
  currentValue = formatResult(result);
  storedValue = null;
  operator = null;
  waitingForNext = true;
  updateDisplay();
}

function percent() {
  if (currentValue === 'Error') return;
  currentValue = formatResult(parseFloat(currentValue) / 100);
  updateDisplay();
}

function toggleSign() {
  if (currentValue === 'Error' || currentValue === '0') return;
  currentValue = currentValue.startsWith('-')
    ? currentValue.slice(1)
    : '-' + currentValue;
  updateDisplay();
}

function clearAll() {
  currentValue = '0';
  storedValue = null;
  operator = null;
  waitingForNext = true;
  historyEl.textContent = '';
  updateDisplay();
}

// One listener for all buttons: checks which button was clicked
keys.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  const { action, value } = button.dataset;

  switch (action) {
    case 'number': inputNumber(value); break;
    case 'decimal': inputDecimal(); break;
    case 'operator': chooseOperator(value); break;
    case 'equals': equals(); break;
    case 'percent': percent(); break;
    case 'sign': toggleSign(); break;
    case 'clear': clearAll(); break;
  }
});

updateDisplay();