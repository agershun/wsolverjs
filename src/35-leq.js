wsolver.solveLeqGauss = function solveLeqGauss(a,b) {

	// Prepare matrix for Gauss mathod

	let A = new Matrix(a.rsize, a.csize+1);
	A.copyFrom(a,0,0);

	for(let i=0;i<A.rsize;i++) {
		A.data[i][a.csize] = b.data[i];
	}

	// Solve
    let unfeasible = false;

    for (var i=0; i<A.rsize; i++) {
        // Search for maximum in this column
        var maxEl = Math.abs(A.data[i][i]);
        var maxRow = i;
        for(var k=i+1; k<A.rsize; k++) {
            if (Math.abs(A.data[k][i]) > maxEl) {
                maxEl = Math.abs(A.data[k][i]);
                maxRow = k;
            }
        }

        // Swap maximum row with current row (column by column)
        for (var k=i; k<A.rsize+1; k++) {
            var tmp = A.data[maxRow][k];
            A.data[maxRow][k] = A.data[i][k];
            A.data[i][k] = tmp;
        }

        // Make all rows below this one 0 in current column
        for (k=i+1; k<A.rsize; k++) {
            if(A.data[i][i] == 0) {
                unfeasible = true;
                break;
            }
            var c = -A.data[k][i]/A.data[i][i];
            for(var j=i; j<A.rsize+1; j++) {
                if (i==j) {
                    A.data[k][j] = 0;
                } else {
                    A.data[k][j] += c * A.data[i][j];
                }
            }
        }
        if(unfeasible) break;
    }

    if(unfeasible) return -1;

    // Solve equation Ax=b for an upper triangular matrix A
    var x = new Vector(A.rsize);
    for (var i=A.rsize-1; i>-1; i--) {
        x.data[i] = A.data[i][A.rsize]/A.data[i][i];
        for (var k=i-1; k>-1; k--) {
            A.data[k][A.rsize] -= A.data[k][i] * x.data[i];
        }
    }
    return x;
}
