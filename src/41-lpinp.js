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

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		A = A.selectRows(A.trans().rref().pivots);
	}

	let rsize = A.rsize;
	let csize = A.csize;

	let x = Vector.ones(csize);
	let l = Vector.ones(rsize);
	let s = Vector.ones(csize);

	let iteration = 0;

	while(Math.abs(x.dot(s))>opt.EPSILON) {
		iteration++;
		if(iteration > opt.MAX_ITERATIONS) break;

		let primalObj = c.dot(x);
		let dualObj = b.dot(l);

		let sigma = 0.4;
		let mu = x.dot(s)/csize;

		let A_ = Matrix.zeros(rsize+csize*2, rsize+csize*2);

		// Create tableau
		A_.copyFrom(A,0,0);
		A_.copyFrom(A.trans(),rsize,csize);
		A_.copyFrom(Matrix.eye(csize),rsize,csize+rsize);
		A_.copyFrom(s.diag(),rsize+csize,0);
		A_.copyFrom(x.diag(),rsize+csize,rsize+csize);

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

		let b_ = new Vector(rsize+2*csize);
		b_.copyFrom(b.sub(A.dot(x)),0);
		b_.copyFrom(c.sub(A.trans().dot(l)).sub(s),0,rsize);
		b_.copyFrom(x.diag().dot(s.diag()).dot(Matrix.ones(csize)).add(-sigma*mu).neg(),rsize+csize);
		
		let delta = wsolver.solveLeqGauss(A_,b_);
		let delta_x = delta.slice(0,csize);
		let delta_l = delta.slice(csize,csize+rsize);
		let delta_s = delta.slice(csize+rsize,csize+rsize+csize);

		let alphaMax = 1.0;
		for(let i=0;i<csize;i++) {
			if(delta_x.data[i] < 0) {
				alphaMax = Math.min(alphaMax, -x.data[i]/delta_x.data[i]);
			}
			if(delta_s.data[i] < 0) {
				alphaMax = Math.min(alpha_max, -s.data[i]/delta_s.data[i]);
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

