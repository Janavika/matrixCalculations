// Main application logic
let currentOperation = 'add';

function updateMatrixInputs() {
    const operation = document.getElementById('operation').value;
    const matrixBDims = document.getElementById('matrix-b-dims');
    const matrixBContainer = document.getElementById('matrix-b-container');
    const opSymbol = document.getElementById('op-symbol');
    
    currentOperation = operation;
    
    switch(operation) {
        case 'add':
            opSymbol.textContent = '+';
            matrixBDims.style.display = 'block';
            matrixBContainer.style.display = 'block';
            break;
        case 'subtract':
            opSymbol.textContent = '-';
            matrixBDims.style.display = 'block';
            matrixBContainer.style.display = 'block';
            break;
        case 'multiply':
            opSymbol.textContent = '×';
            matrixBDims.style.display = 'block';
            matrixBContainer.style.display = 'block';
            break;
        default:
            opSymbol.textContent = '';
            matrixBDims.style.display = 'none';
            matrixBContainer.style.display = 'none';
    }
    
    document.getElementById('matrix-inputs').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById('error').textContent = '';
    document.getElementById('calculate-btn').disabled = true;
}

function createMatrices() {
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    const operation = document.getElementById('operation').value;
    
    let rowsB = rowsA, colsB = colsA;
    if (operation === 'add' || operation === 'subtract' || operation === 'multiply') {
        rowsB = parseInt(document.getElementById('rowsB').value);
        colsB = parseInt(document.getElementById('colsB').value);
    }
    
    document.getElementById('matrixA').innerHTML = '';
    document.getElementById('matrixB').innerHTML = '';
    document.getElementById('error').textContent = '';
    document.getElementById('result').style.display = 'none';
    
    // Create Matrix A
    for (let i = 0; i < rowsA; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < colsA; j++) {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.value = Math.floor(Math.random() * 10);
            input.id = `A_${i}_${j}`;
            td.appendChild(input);
            tr.appendChild(td);
        }
        document.getElementById('matrixA').appendChild(tr);
    }
    
    if (operation === 'add' || operation === 'subtract' || operation === 'multiply') {
        for (let i = 0; i < rowsB; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < colsB; j++) {
                const td = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'number';
                input.value = Math.floor(Math.random() * 10);
                input.id = `B_${i}_${j}`;
                td.appendChild(input);
                tr.appendChild(td);
            }
            document.getElementById('matrixB').appendChild(tr);
        }
    }
    
    document.getElementById('matrix-inputs').style.display = 'block';
    document.getElementById('calculate-btn').disabled = false;
}

function calculate() {
    const operation = document.getElementById('operation').value;
    const rowsA = parseInt(document.getElementById('rowsA').value);
    const colsA = parseInt(document.getElementById('colsA').value);
    
    let rowsB = rowsA, colsB = colsA;
    if (operation === 'add' || operation === 'subtract' || operation === 'multiply') {
        rowsB = parseInt(document.getElementById('rowsB').value);
        colsB = parseInt(document.getElementById('colsB').value);
    }
    
    document.getElementById('error').textContent = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('result-content').innerHTML = '';
    
    try {
        const matrixA = [];
        for (let i = 0; i < rowsA; i++) {
            const row = [];
            for (let j = 0; j < colsA; j++) {
                const value = parseFloat(document.getElementById(`A_${i}_${j}`).value);
                row.push(isNaN(value) ? 0 : value);
            }
            matrixA.push(row);
        }
        
        let matrixB = [];
        if (operation === 'add' || operation === 'subtract' || operation === 'multiply') {
            for (let i = 0; i < rowsB; i++) {
                const row = [];
                for (let j = 0; j < colsB; j++) {
                    const value = parseFloat(document.getElementById(`B_${i}_${j}`).value);
                    row.push(isNaN(value) ? 0 : value);
                }
                matrixB.push(row);
            }
        }
        
        let result;
        switch(operation) {
            case 'add':
                result = addMatrices(matrixA, matrixB);
                break;
            case 'subtract':
                result = subtractMatrices(matrixA, matrixB);
                break;
            case 'multiply':
                result = multiplyMatrices(matrixA, matrixB);
                break;
            case 'determinant':
                result = calculateDeterminant(matrixA);
                break;
            case 'inverse':
                result = calculateInverse(matrixA);
                break;
            case 'adjoint':
                result = calculateAdjoint(matrixA);
                break;
            case 'rank':
                result = calculateRank(matrixA);
                break;
            default:
                throw new Error("Unknown operation");
        }
        
        displayResult(result, operation);
    } catch (error) {
        document.getElementById('error').textContent = error.message;
    }
}

function displayResult(result, operation) {
    const resultContent = document.getElementById('result-content');
    
    if (operation === 'determinant' || operation === 'rank') {
        resultContent.innerHTML = `<h3>${operation === 'determinant' ? 'Determinant' : 'Rank'}: ${result}</h3>`;
    } else if (typeof result === 'string') {
        resultContent.innerHTML = `<p>${result}</p>`;
    } else {
        const table = document.createElement('table');
        
        if (Array.isArray(result[0])) {
            for (let i = 0; i < result.length; i++) {
                const tr = document.createElement('tr');
                for (let j = 0; j < result[0].length; j++) {
                    const td = document.createElement('td');
                    const value = result[i][j];
                    td.textContent = Number.isInteger(value) ? value : value.toFixed(2);
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
        } else {
            const tr = document.createElement('tr');
            for (let j = 0; j < result.length; j++) {
                const td = document.createElement('td');
                const value = result[j];
                td.textContent = Number.isInteger(value) ? value : value.toFixed(2);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        
        resultContent.appendChild(table);
    }
    
    document.getElementById('result').style.display = 'block';
}

// Initialize the calculator
updateMatrixInputs();