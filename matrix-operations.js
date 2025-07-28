// Matrix operations library

function addMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error("Matrices must have the same dimensions for addition");
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < a[0].length; j++) {
            row.push(a[i][j] + b[i][j]);
        }
        result.push(row);
    }
    return result;
}

function subtractMatrices(a, b) {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error("Matrices must have the same dimensions for subtraction");
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < a[0].length; j++) {
            row.push(a[i][j] - b[i][j]);
        }
        result.push(row);
    }
    return result;
}

function multiplyMatrices(a, b) {
    if (a[0].length !== b.length) {
        throw new Error("Number of columns in Matrix A must match number of rows in Matrix B for multiplication");
    }
    
    const result = [];
    for (let i = 0; i < a.length; i++) {
        const row = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < a[0].length; k++) {
                sum += a[i][k] * b[k][j];
            }
            row.push(sum);
        }
        result.push(row);
    }
    return result;
}

function calculateDeterminant(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("Matrix must be square to calculate determinant");
    }
    
    const n = matrix.length;
    
    if (n === 1) return matrix[0][0];
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < n; i++) {
        const minor = [];
        for (let j = 1; j < n; j++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                if (k !== i) row.push(matrix[j][k]);
            }
            minor.push(row);
        }
        det += matrix[0][i] * Math.pow(-1, i) * calculateDeterminant(minor);
    }
    
    return det;
}

function calculateAdjoint(matrix) {
    if (matrix.length !== matrix[0].length) {
        throw new Error("Matrix must be square to calculate adjoint");
    }
    
    const n = matrix.length;
    if (n === 1) return [[1]];
    
    const adjoint = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            const minor = [];
            for (let k = 0; k < n; k++) {
                if (k === i) continue;
                const minorRow = [];
                for (let l = 0; l < n; l++) {
                    if (l === j) continue;
                    minorRow.push(matrix[k][l]);
                }
                minor.push(minorRow);
            }
            const cofactor = Math.pow(-1, i + j) * calculateDeterminant(minor);
            row.push(cofactor);
        }
        adjoint.push(row);
    }
    
    return transposeMatrix(adjoint);
}

function calculateInverse(matrix) {
    const det = calculateDeterminant(matrix);
    if (det === 0) {
        return "Matrix is singular (determinant is 0), inverse does not exist";
    }
    
    const adjoint = calculateAdjoint(matrix);
    const inverse = [];
    
    for (let i = 0; i < adjoint.length; i++) {
        const row = [];
        for (let j = 0; j < adjoint[0].length; j++) {
            row.push(adjoint[i][j] / det);
        }
        inverse.push(row);
    }
    
    return inverse;
}

function calculateRank(matrix) {
    const m = matrix.length;
    const n = matrix[0].length;
    let rank = Math.min(m, n);
    
    const mat = matrix.map(row => [...row]);
    
    for (let row = 0; row < rank; row++) {
        if (mat[row][row] !== 0) {
            for (let col = 0; col < m; col++) {
                if (col !== row) {
                    const mult = mat[col][row] / mat[row][row];
                    for (let i = 0; i < rank; i++) {
                        mat[col][i] -= mult * mat[row][i];
                    }
                }
            }
        } else {
            let reduce = true;
            for (let i = row + 1; i < m; i++) {
                if (mat[i][row] !== 0) {
                    [mat[row], mat[i]] = [mat[i], mat[row]];
                    reduce = false;
                    break;
                }
            }
            
            if (reduce) {
                rank--;
                for (let i = 0; i < m; i++) {
                    mat[i][row] = mat[i][rank];
                }
            }
            
            row--;
        }
    }
    
    return rank;
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}