// Configuration & Keys
const KEYS = [
  ["AC", "fn"], ["DEL", "fn"], ["%", "n"], ["÷", "op"],
  ["7", "n"], ["8", "n"], ["9", "n"], ["×", "op"],
  ["4", "n"], ["5", "n"], ["6", "n"], ["-", "op"],
  ["1", "n"], ["2", "n"], ["3", "n"], ["+", "op"],
  ["+/-", "n"], ["0", "n"], [".", "n"], ["=", "op"],
];

const STYLE = {
  fn: "bg-blue-950 hover:bg-blue-900 text-blue-400",
  n: "bg-slate-800 hover:bg-slate-700 text-slate-100",
  op: "bg-blue-600 hover:bg-blue-500 text-white",
};

const OPS = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
};

// DOM Elements
const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const padEl = document.getElementById("pad");

// Application States
let current = "0";
let previous = null;
let operator = null;
let fresh = false;
let exprText = "";
let historyList = [];

const format = (n) => (isFinite(n) ? String(parseFloat(n.toPrecision(12))) : "Error");

// Render Display
function render() {
  if (exprEl) exprEl.textContent = exprText;
  if (resultEl) resultEl.textContent = current;
}

// Math Computation
function compute() {
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (operator === "÷" && b === 0) return "Error";
  return format(OPS[operator](a, b));
}

// History Functions
function addToHistory(expr, result) {
  historyList.unshift(`${expr} ${result}`);
  renderHistory();
}

function renderHistory() {
  const historyEl = document.getElementById("historyList");
  if (!historyEl) return;
  
  historyEl.innerHTML = historyList
    .slice(0, 3)
    .map(item => `<li class="text-xs text-slate-400 py-0.5 border-b border-slate-800/50">${item}</li>`)
    .join("");
}

// Button Key Press Logic
function press(key) {
  if (current === "Error" && key !== "AC") key = "AC";

  if (key === "AC") {
    current = "0"; 
    previous = null; 
    operator = null; 
    exprText = ""; 
    fresh = false;

    // Reset input dan hasil konversi
    const unitInput = document.getElementById("unitInput");
    const unitResult = document.getElementById("unitResult");
    if (unitInput) unitInput.value = "";
    if (unitResult) unitResult.textContent = "";

  } else if (key === "DEL") {
    if (fresh) return;
    const short = current.length === 1 || (current.length === 2 && current[0] === "-");
    current = short ? "0" : current.slice(0, -1);
  } else if (key === "+/-") {
    if (current !== "0") current = current[0] === "-" ? current.slice(1) : "-" + current;
  } else if (key === "%") {
    current = format(parseFloat(current) / 100);
    fresh = true;
  } else if (key === ".") {
    if (fresh) { current = "0"; fresh = false; }
    if (!current.includes(".")) current += ".";
  } else if (/^\d$/.test(key)) {
    if (fresh || current === "0") { current = key; fresh = false; }
    else if (current.replace(/[-.]/g, "").length < 15) current += key;
  } else if (key === "=") {
    if (operator === null || previous === null) return;
    const full = `${previous} ${operator} ${current} =`;
    const res = compute();
    
    if (res !== "Error") {
      addToHistory(full, res);
    }

    current = res;
    exprText = full; 
    previous = null; 
    operator = null; 
    fresh = true;
  } else {
    if (operator !== null && !fresh) {
      const r = compute();
      if (r === "Error") { current = r; previous = null; operator = null; exprText = ""; render(); return; }
      previous = r;
    } else {
      previous = current;
    }
    operator = key; fresh = true; current = previous;
    exprText = `${previous} ${operator}`;
  }
  render();
}

// Fitur Konversi Satuan
function convertUnit() {
  const inputEl = document.getElementById("unitInput");
  const resultUnitEl = document.getElementById("unitResult");
  if (!inputEl || !resultUnitEl) return;
  
  const val = parseFloat(inputEl.value);
  if (isNaN(val)) {
    resultUnitEl.textContent = "Masukkan angka meter yang valid!";
    return;
  }
  const km = val / 1000;
  resultUnitEl.textContent = `${val} m = ${km} km`;
}

// Render Keypad Buttons
if (padEl) {
  padEl.innerHTML = "";
  KEYS.forEach(([label, type]) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = `calc-btn p-4 text-xl font-medium rounded-2xl transition-all duration-150 active:scale-95 ${STYLE[type]}`;
    btn.addEventListener("click", () => press(label));
    padEl.appendChild(btn);
  });
}

// Keyboard Support
document.addEventListener("keydown", (e) => {
  const map = { "*": "×", "/": "÷", Enter: "=", "=": "=", Backspace: "DEL", Escape: "AC", Delete: "AC" };
  const key = map[e.key] || e.key;
  if (/^[0-9.+\-%]$/.test(key) || ["×", "÷", "=", "DEL", "AC"].includes(key)) {
    e.preventDefault();
    press(key);
  }
});

HEAD
render();

render();

function convertUnit() {
  const inputEl = document.getElementById("unitInput");
  const resultUnitEl = document.getElementById("unitResult");
  const val = parseFloat(inputEl.value);

  if (isNaN(val)) {
    resultUnitEl.textContent = "Masukkan angka meter yang valid!";
    return;
  }
  const km = val / 1000;
  resultUnitEl.textContent = `${val} m = ${km} km`;
}
