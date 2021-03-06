wsolver.solveLpBrute = function solveLpBrute(c,A,b,opt) {
	// Prepare data
	c = Vector.init(c);
	A = Matrix.init(A);
	b = Vector.init(b);

	// console.log(7,A.rank(),A.trans().rref().pivots);

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		// console.log(10);
		A = A.selectRows(A.trans().rref().pivots);
	}

	// console.log(13,A);

	let csize = A.csize;
	let rsize = A.rsize;

	let optVal = Infinity;
	let optBasis;
	let optX_b;
	let iteration = 0;

// console.log(24,A.csize, A.rsize);
// console.log(25,utils.range(A.csize));
// console.log(26,utils.combinations(utils.range(A.csize),A.rsize);

	for(let basicIndices of utils.combinations(utils.range(A.csize),A.rsize)) {
// console.log(25,iteration,basicIndices);
		iteration++;
		let B = A.selectCols(basicIndices);
		if(B.rank()!=rsize) continue;

		let x_b = B.inv().dot(b);


		if(x_b.data.some(x=>x<0)) continue;
		// let obj = c.dot(x_b);
		// console.log(30,iteration,obj);
		// console.log(31,c,x_b);

		let obj = 0;
		for(let i=0;i<x_b.size;i++) {
			obj += c.data[basicIndices[i]]*x_b.data[i];
		}
		if(obj<optVal) {
			optVal = obj;
			optBasis = basicIndices;
			optX_b = x_b;
		}
	}

	if(!optBasis) return -1;

	let x = Vector.zeros(csize);

	for(let i=0;i<x.size;i++) {
		if(optBasis.includes(i)) {
			x.data[i] = optX_b.data[optBasis.indexOf(i)];
		}
	}
	return x;
}

