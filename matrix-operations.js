function addMatrices(a, b) {
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

function subtractMatrices(a, b) {
  return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

function multiplyMatrices(a, b) {
  if (a[0].length !== b.length) throw new Error("Matrix dimensions do not allow multiplication");
  return a.map((row, i) =>
    b[0].map((_, j) => row.reduce((sum, _, k) => sum + a[i][k] * b[k][j], 0))
  );
}

function transposeMatrix(m) {
  return m[0].map((_, i) => m.map(row => row[i]));
}

function calculateDeterminant(m) {
  const n = m.length;
  if (n !== m[0].length) throw new Error("Matrix must be square for determinant");
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0]*m[1][1] - m[0][1]*m[1][0];
  let det = 0;
  for (let i = 0; i < n; i++) {
    const minor = m.slice(1).map(row => row.filter((_, j) => j !== i));
    det += m[0][i] * Math.pow(-1, i) * calculateDeterminant(minor);
  }
  return det;
}

function calculateAdjoint(m) {
  const n = m.length;
  if (n !== m[0].length) throw new Error("Matrix must be square");
  const adj = Array(n).fill().map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor = m.filter((_, x) => x !== i).map(row => row.filter((_, y) => y !== j));
      adj[j][i] = Math.pow(-1, i + j) * calculateDeterminant(minor);
    }
  }
  return adj;
}

function calculateInverse(m) {
  const det = calculateDeterminant(m);
  if (det === 0) throw new Error("Matrix is singular; inverse doesn't exist");
  const adj = calculateAdjoint(m);
  return adj.map(row => row.map(val => val / det));
}

function calculateRank(matrix) {
  const clone = matrix.map(row => row.slice());
  let rank = matrix[0].length;
  for (let row = 0; row < rank; row++) {
    if (clone[row][row]) {
      for (let col = 0; col < matrix.length; col++) {
        if (col !== row) {
          const mult = clone[col][row] / clone[row][row];
          for (let i = 0; i < rank; i++) clone[col][i] -= mult * clone[row][i];
        }
      }
    } else {
      let reduce = true;
      for (let i = row + 1; i < matrix.length; i++) {
        if (clone[i][row]) {
          [clone[row], clone[i]] = [clone[i], clone[row]];
          reduce = false;
          break;
        }
      }
      if (reduce) {
        for (let i = 0; i < matrix.length; i++) clone[i][row] = clone[i][rank - 1];
        rank--;
        row--;
      }
    }
  }
  return [[rank]];

function luDecomposition(matrix) {
  const n = matrix.length;
  const L = Array(n).fill().map(() => Array(n).fill(0));
  const U = Array(n).fill().map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let k = i; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) sum += L[i][j] * U[j][k];
      U[i][k] = matrix[i][k] - sum;
    }

    for (let k = i; k < n; k++) {
      if (i === k) L[i][i] = 1;
      else {
        let sum = 0;
        for (let j = 0; j < i; j++) sum += L[k][j] * U[j][i];
        L[k][i] = (matrix[k][i] - sum) / U[i][i];
      }
    }
  }

  // Return as a single array with L, separator, and U for display
  return [...L, new Array(n).fill('—'), ...U];
}
function luDecomposition(matrix) {
  const n = matrix.length;
  const L = Array(n).fill().map(() => Array(n).fill(0));
  const U = Array(n).fill().map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let k = i; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) sum += (L[i][j] * U[j][k]);
      U[i][k] = matrix[i][k] - sum;
    }
    for (let k = i; k < n; k++) {
      if (i === k) L[i][i] = 1;
      else {
        let sum = 0;
        for (let j = 0; j < i; j++) sum += (L[k][j] * U[j][i]);
        L[k][i] = (matrix[k][i] - sum) / U[i][i];
      }
    }
  }
  return [...L, ['---'], ...U];
}

function calculateEigenvalues(matrix) {
  if (matrix.length !== matrix[0].length) throw new Error("Eigenvalues require a square matrix");
  // Dummy approximation using trace and determinant for 2x2 only
  if (matrix.length === 2) {
    const a = 1;
    const b = -(matrix[0][0] + matrix[1][1]);
    const c = matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
    const discriminant = b*b - 4*a*c;
    if (discriminant < 0) return ["Complex roots"];
    const lambda1 = (-b + Math.sqrt(discriminant)) / (2*a);
    const lambda2 = (-b - Math.sqrt(discriminant)) / (2*a);
    return [lambda1, lambda2];
  }
  throw new Error("Eigenvalue calculation supported only for 2x2 matrices.");
}
}
