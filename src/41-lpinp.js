wsolver.solveLpIntPoint = function solveLpIntPoint(c,A,b,opt) {
	// Prepare data
	c = Vector.init(c);
	A = Matrix.init(A);
	b = Vector.init(b);

	if(A.csize != c.size) {
		throw "The first dimension of A and c must match.";
	}
	if(A.rsize != b.size) {
		throw "The second dimension of A and b must match.";
	}

	if(!opt) opt = {};
	if(!opt.MAX_ITERATIONS) opt.MAX_ITERATIONS = wsolver.MAX_ITERATIONS;
	if(!opt.EPSILON) opt.EPSILON = wsolver.EPSILON;

console.log(18,A.rsize,A.csize);
console.log(19,b.size);

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		let pivots = A.trans().rref().pivots;
		A = A.selectRows(pivots);
		b = b.selectVals(pivots);
	}

console.log(24,A.rsize,A.csize);
console.log(24,b.size);

	let rsize = A.rsize;
	let csize = A.csize;

	let x = Vector.ones(csize);
	let l = Vector.ones(rsize);
	let s = Vector.ones(csize);

	let iteration = 0;

	while(Math.abs(x.dot(s))>opt.EPSILON) {
		iteration++;
		if(iteration > opt.MAX_ITERATIONS) break;
		// if(iteration > 2) break;

		let primalObj = c.dot(x);
		let dualObj = b.dot(l);

		// console.log(39, iteration, x.dot(s), primalObj,dualObj)

		let sigma = 0.4;
		let mu = x.dot(s)/csize;

		let A_ = Matrix.zeros(rsize+csize*2, rsize+csize*2);

		// Create tableau
		A_.copyFrom(A,0,0);
		A_.copyFrom(A.trans(),rsize,csize);
		A_.copyFrom(Matrix.eye(csize),rsize,csize+rsize);
		A_.copyFrom(s.diag(),rsize+csize,0);
		A_.copyFrom(x.diag(),rsize+csize,rsize+csize);


// console.log(A_.data.map(x=>x.join(',')).join('\n'));
		// for(let i=0;i<rsize;i++) {
		// 	for(let j=0;j<csize;j++) {
		// 		A_.data[i][j] = A.data[i][j];
		// 	}
		// }

		// TODO - make a copy of matrix into the matrix
		// let AT = A.trans();
		// for(let i=0;i<csize;i++) {
		// 	for(let j=0;j<rsize;j++) {
		// 		A_.data[m+i][n+j] = AT.data[i][j];
		// 	}
		// }


		// for(let i=0;i<csize;i++) {
		// 	A_.data[rsize+i][rsize+csize+i] = 1.0;
		// 	A_.data[rsize+csize+i][i] = s.data[i];
		// 	A_.data[rsize+csize+i][rsize+csize+i] = x.data[i];
		// }

console.log(84,A.rsize,A.csize);
console.log(85,b.size);
console.log(86,x.size);
console.log(87,A.dot(x));


		let b_ = new Vector(rsize+2*csize);
		b_.copyFrom(b.sub(A.dot(x)),0);
		b_.copyFrom(c.sub(A.trans().dot(l)).sub(s),rsize);
		b_.copyFrom(x.diag().dot(s.diag()).dot(Vector.ones(csize)).add(-sigma*mu).neg(),rsize+csize);
		
// console.log(79,Matrix.ones(csize,csize));
// console.log(80,x.diag().dot(s.diag()).dot(Matrix.ones(csize,csize)).add(-sigma*mu).neg());
// console.log(81,x.diag().dot(s.diag()).dot(Matrix.ones(csize,csize)).add(-sigma*mu).neg())

// console.log(83,b_);

		let delta = wsolver.solveLeqGauss(A_,b_);
		// console.log(89,delta);

		if(delta == -1) {
			return -1; // Equation is unfeasible
		}

		let delta_x = delta.slice(0,csize);
		let delta_l = delta.slice(csize,csize+rsize);
		let delta_s = delta.slice(csize+rsize,csize+rsize+csize);

		let alphaMax = 1.0;
		for(let i=0;i<csize;i++) {
			if(delta_x.data[i] < 0) {
				alphaMax = Math.min(alphaMax, -x.data[i]/delta_x.data[i]);
			}
			if(delta_s.data[i] < 0) {
				alphaMax = Math.min(alphaMax, -s.data[i]/delta_s.data[i]);
			}
		}

		let eta = 0.99;
		let alpha = Math.min(1.0, eta * alphaMax);

		x = x.add(delta_x.mul(alpha));
		s = s.add(delta_s.mul(alpha));
		l = l.add(delta_l.mul(alpha));

	}

	return x;
}

