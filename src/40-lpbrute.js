wsolver.solveLpBrute = function solveLpBrute(c,A,b,opt) {
	// Prepare data
	c = Vector.init(c);
	A = Matrix.init(A);
	b = Vector.init(b);

	let csize = A.csize;
	let rsize = A.rsize;

console.log(10,A.rank());

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		A = A.selectRows(A.trans().rref().pivots);
	}

	let optVal = Infinity;
	let optBasis;
	let optX_b;
	let iteration = 0;

	for(let basicIndices of utils.combinations(utils.range(A.csize),A.rsize)) {
		let B = A.selectCols(basicIndices);
		console.log(21,B.rank());
		if(B.rank()!=csize) continue;

		let x_b = B.invert().dot(b);

		if(x_b.some(x=>x<0)) continue;
		let obj = 0;
		for(let i=0;i<xb.length;i++) {
			obj += c[basicIndices[i]]*xb[i];
		}
		if(obj<optVal) {
			optVal = obj;
			optBasis = basicIndices;
			optX_b = x_b;
		}
	}

	if(!optBasis) return -1;

	let x = Vector.zeros(rsize);

	for(let i=0;i<x.size;i++) {
		if(optBasis.includes(i)) {
			x.data[i] = optX_b[optBasis.indexOf(i)];
		}
	}
	return x;
}

