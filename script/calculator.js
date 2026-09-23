// Layout tombol sesuai PRD (5 baris x 4 kolom)
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

const exprEl = document.getElementById("expr");
const resultEl = document.getElementById("result");
const padEl = document.getElementById("pad");

let current = "0";
let previous = null;
let operator = null;
let fresh = false;
let exprText = "";

const format = (n) => (isFinite(n) ? String(parseFloat(n.toPrecision(12))) : "Error");

function render() {
  exprEl.textContent = exprText;
  resultEl.textContent = current;
}

function compute() {
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (operator === "÷" && b === 0) return "Error";
  return format(OPS[operator](a, b));
}

function press(key) {
  if (current === "Error" && key !== "AC") key = "AC";

  if (key === "AC") {
    current = "0"; previous = null; operator = null; exprText = ""; fresh = false;
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
    current = compute();
    exprText = full; previous = null; operator = null; fresh = true;
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

// Bangun tombol
KEYS.forEach(([label, type]) => {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.className = `calc-btn ${STYLE[type]}`;
  btn.addEventListener("click", () => press(label));
  padEl.appendChild(btn);
});

// Dukungan keyboard
document.addEventListener("keydown", (e) => {
  const map = { "*": "×", "/": "÷", Enter: "=", "=": "=", Backspace: "DEL", Escape: "AC", Delete: "AC" };
  const key = map[e.key] || e.key;
  if (/^[0-9.+\-%]$/.test(key) || ["×", "÷", "=", "DEL", "AC"].includes(key)) {
    e.preventDefault();
    press(key);
  }
});

render();
