let matrixA = [], matrixB = [], currentOperation = '';

const rowsInput = document.getElementById("rows");
const colsInput = document.getElementById("cols");
const operationSelect = document.getElementById("operation");
const generateBtn = document.getElementById("generate-btn");
const calculateBtn = document.getElementById("calculate-btn");
const matrixAContainer = document.getElementById("matrixA");
const matrixBContainer = document.getElementById("matrixB");
const resultContent = document.getElementById("result-content");
const errorBox = document.getElementById("error");

operationSelect.addEventListener("change", handleOperationChange);
generateBtn.addEventListener("click", generateMatrices);
calculateBtn.addEventListener("click", calculate);
document.getElementById("dark-mode-toggle").addEventListener("change", toggleDarkMode);

function handleOperationChange() {
  const op = operationSelect.value;
  document.getElementById("matrixB-wrapper").style.display = op === "add" || op === "subtract" || op === "multiply" ? "block" : "none";
}

function generateMatrices() {
  errorBox.textContent = "";
  resultContent.innerHTML = "";
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);
  const op = operationSelect.value;

  if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
    errorBox.textContent = "Invalid matrix size";
    return;
  }

  matrixAContainer.innerHTML = "";
  matrixBContainer.innerHTML = "";
  createMatrixInputs(matrixAContainer, rows, cols, 'A');

  const matrixBWrapper = document.getElementById("matrixB-wrapper");
  if (op === 'add' || op === 'subtract' || op === 'multiply') {
    matrixBWrapper.style.display = "block";
    createMatrixInputs(matrixBContainer, rows, cols, 'B');
  } else {
    matrixBWrapper.style.display = "none";
  }

  document.getElementById("matrix-section").style.display = "block";
  calculateBtn.disabled = false;
}

function createMatrixInputs(container, rows, cols, prefix) {
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < cols; j++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.id = `${prefix}_${i}_${j}`;
      input.value = Math.floor(Math.random() * 10);
      td.appendChild(input);
      tr.appendChild(td);
    }
    container.appendChild(tr);
  }
}

function calculate() {
  const rows = parseInt(rowsInput.value);
  const cols = parseInt(colsInput.value);
  const op = operationSelect.value;
  matrixA = readMatrix('A', rows, cols);
  let result;
  try {
    if (op === 'add' || op === 'subtract' || op === 'multiply') {
      matrixB = readMatrix('B', rows, cols);
    }
    switch (op) {
      case 'add': result = addMatrices(matrixA, matrixB); break;
      case 'subtract': result = subtractMatrices(matrixA, matrixB); break;
      case 'multiply': result = multiplyMatrices(matrixA, matrixB); break;
      case 'transpose': result = transposeMatrix(matrixA); break;
      case 'determinant': result = [[calculateDeterminant(matrixA)]]; break;
      case 'inverse': result = calculateInverse(matrixA); break;
      case 'adjoint': result = calculateAdjoint(matrixA); break;
      case 'rank': result = calculateRank(matrixA); break;
      case 'lu':
        result = luDecomposition(matrixA);
        break;
      case 'eigen':
        result = [calculateEigenvalues(matrixA)];
        break;
      default:
        throw new Error("Unsupported operation");
    }
    displayResult(result);
  } catch (err) {
    errorBox.textContent = err.message;
  }
}

function readMatrix(prefix, rows, cols) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const val = parseFloat(document.getElementById(`${prefix}_${i}_${j}`).value);
      if (isNaN(val)) throw new Error("Matrix contains invalid numbers");
      row.push(val);
    }
    matrix.push(row);
  }
  return matrix;
}

function displayResult(result) {
  resultContent.innerHTML = '';
  const table = document.createElement("table");

  result.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    if (Array.isArray(row) && row.includes('—')) {
      const td = document.createElement("td");
      td.textContent = "—————";
      td.colSpan = row.length;
      td.style.textAlign = "center";
      tr.appendChild(td);
    } else {
      const valuesToDisplay = Array.isArray(row) ? row : [row];
      valuesToDisplay.forEach(val => {
        const td = document.createElement("td");
        td.textContent = typeof val === 'number' ?
          (Number.isInteger(val) ? val : val.toFixed(2)) :
          val;
        tr.appendChild(td);
      });
    }
    table.appendChild(tr);
  });

  resultContent.appendChild(table);
  document.getElementById("result").style.display = "block";
}

function toggleDarkMode(e) {
  document.body.classList.toggle("dark-mode", e.target.checked);
}