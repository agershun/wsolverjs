wsolver.solveLpSimplex = function solveLpSimplex(c,A,b,opt) {
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
	if(!opt.max_iterations) opt.max_iterations = wsolver.MAX_ITERATIONS;
	if(!opt.epsilon) opt.epsilon = wsolver.EPSILON;

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		let pivots = A.trans().rref().pivots;
		A = A.selectRows(pivots);
		b = b.selectVals(pivots);
	}

	let basic_indices = lpSimplexFirstPhase(A,b,opt);
	if(basic_indices == -1) return -1;

	return lpSimplexSecondPhase(c,A,b,basic_indices,opt);
}

function lpSimplexFirstPhase(A1,b1,opt,phase) {
	let rsize = A1.rsize;
	let csize = A1.csize;

	let A_positive = A1.clone();
	let b = b1.clone();

	for(let i=0;i<rsize;i++) {
		if(b.data[i]<0) {
			b.data[i] = -b.data[i];
			for(let j=0;j<csize;j++) {
				A_positive.data[i][j] = -A_positive.data[i][j];
			}
		}
	}

	let A_ = new Matrix(rsize,csize+rsize);
	A_.copyFrom(A_positive,0,0);
	A_.copyFrom(Matrix.eye(rsize),0,csize);

	let c = Vector.zeros(rsize+csize);
	for(let i=csize;i<csize+rsize;i++) {
		c.data[i] = 1;
	}

	let indices = [ ...Array(csize+rsize).keys() ];
	let basic_indices = indices.slice(csize,csize+rsize);
	let B = A_.selectCols(basic_indices);
console.log(64,B.rsize,B.csize);
console.log(64,A_.rsize,A_.csize);
console.log(58,basic_indices);
console.log(59,rsize,csize);
console.log(60,A1.rsize,A1.csize,b1.size);
	let optimal = false;
	let opt_infinity = false;
	let iteration = 0;
	let obj_val = Infinity;

	while (!optimal) {
		console.log(63,'iter', iteration, 'obj_val',obj_val);

		iteration++;

		let B_inv = B.inv();
		let x_b = B_inv.dot(b);

		if(x_b.data.every(x=>x==0)) {
			// TODO: Think about this message
			console.log('get_init_bfs_aux: alert! this bfs is degenerate');
		}

		let c_b = c.selectVals(basic_indices);

		obj_val = 0;
		for(let i=0; i<basic_indices.length;i++) {
			obj_val += c.data[basic_indices[i]] * x_b.data[i];
		}

		// TODO: Can be replaced with Map
		let reduced_costs = {};
		for(let j=0;j<indices.length;j++) {
			if(!basic_indices.includes(j)) {
				reduced_costs[j] = c.data[j] - c_b.dot(B_inv.dot(A_.col(j)))
			}
		}

		if(Object.values(reduced_costs).every(x=>x>=0)) {	
			optimal = true;
			break;
		}

		let chosen_j;
		for(let j of Object.keys(reduced_costs)) {
			if(reduced_costs[j] < 0) {
				chosen_j = +j; // Convert to integer 
				break;
			}
		}

		let d_b = B_inv.dot(A_.col(chosen_j)).neg();

		if(d_b.data.every(x=>x>=0)) {
			opt_infinity = true;
			break;
		}

		let l, theta_star;

		for(let i=0;i<basic_indices.length;i++) {
			if(d_b.data[i] < 0) {
				if (typeof l == 'undefined') {
					l = i;
				}
				if( -x_b.data[i]/d_b.data[i] < -x_b.data[l]/d_b.data[l]) {
					l = i;
					theta_star = -x_b.data[i]/d_b.data[i];
				}
			}
		}

		basic_indices[l] = chosen_j;
		basic_indices = basic_indices.sort();

		B = A_.selectCols(basic_indices);

	}

	if(obj_val != 0) {
		//console.log('The original problem is infeasible!');
		return -1;
	}

	let contains_artifical = false;

	for(let x of basic_indices) {
		if(x >= csize) {
			// console.log(988,x,N);
			// exit();
			contains_artifical = true;
			break;
		}
	}

	// console.log('NOT TESTED FROM HERE!')// TEST BELOW
	// console.log(1009,'contains_artifical',contains_artifical);
	// console.log(1010,'basic_indices',basic_indices);

	// TODO: Rewrite with matrix notation

	if(!contains_artifical) {
		if(basic_indices.length != rsize) {
			throw 'assertion failed, please check this';
		}
		if(B.rank() != rsize) {
			throw 'this should have been equal, assertion failed';
		}
		let x_b = B.inv().dot(b);
		if(!x_b.data.every(x=>x>=0)) {
			throw 'this does not give a feasible solution, something is wrong, assertion failed';
		}
		// console.log('init_bfs_aux: assertions passed, no artificial vars in basis by chance! found a valid init bfs in iterations',iteration);
		basic_indices = basic_indices.sort();
		return basic_indices;
	}

	let basic_indices_no_artificial = [];
	for(let index of basic_indices) {
		if(index < csize) {
			basic_indices_no_artificial.push(index);	
		}
	}

	let counter = 0;
	while(basic_indices_no_artificial.length < rsize) {
		if(basic_indices_no_artificial.includes(counter)) {
			continue;
		}

		console.log('NOT TESTED FROM HERE!!!');
		exit(1);

		let B_small = Array(A1.rsize);
		for(let i = 0; i<A1.rsize;i++) {
			B_small.data[i] = Array(basic_indices_no_artificial.length);
			for(let j=0;j<basic_indices_no_artificial.length;j++) {
				B_small[i][j] = A.data[i][basic_indices_no_artificial[j]];
			}
		}

		let B_test = Array(B_small.length);
		for(let i = 0; i<A.length;i++) {
			B_test[i] = Array(B_small[i].length+1);
			for(let j=0;j<B_small[i].length;j++) {
				B_test[i][j] = B_small[i][j];
			}
			B_test[i][B_small[i].length] = A[i][counter];
		}

		if(matrix_rank(B_test) == Math.min(B_test.length, B_test[0].length)) {
			basic_indices_no_artificial.push(counter);
		}

		counter++;
	}

	basic_indices = basic_indices_no_artificial.sort();

	B = Array(A.length);
	for(let i=0;i<A.length;i++) {
		B[i] = Array(basic_indices.length);
		for(let j=0;j<basic_indices;j++) {
			B[i][j] = A[i][basic_indices[j]];
		}
	}

	if(basic_indices.length == rsize) {
		throw 'assertion failed, please check this';
	}
	if(matrix_rank(B) == rsize) {
		throw 'this should have been equal, assertion failed';
	}
	x_b = B_inv.dot(b);
	if(x_b.data.every(x=>x>0)) {
		throw 'this does not give a feasible solution, something is wrong, assertion failed';
	}
	// console.log('init_bfs_aux: assertions passed, no artificial vars in basis by chance! found a valid init bfs in iterations',iteration_number);
	basic_indices = basic_indices.sort();
	return basic_indices;

}

function lpSimplexSecondPhase(c,A,b,basic_indices,opt) {
	let rsize = A.rsize;
	let csize = A.csize;

	let B = A.selectCols(basic_indices);
	let x_b;

	let optimal = false;
	let opt_infinity = false;
	let iteration = 0;
	let obj_val = Infinity;

	while (!optimal) {
		iteration++;

		let B_inv = B.inv();
		x_b = B_inv.dot(b);

		if(x_b.data.every(x=>x==0)) {
			// console.log('Alert! the bfs is degenerate');
		}

		let c_b = c.selectVals(basic_indices);

		obj_val = 0;
		for(let i=0; i<basic_indices.length;i++) {
			obj_val += c.data[basic_indices[i]] * x_b.data[i];
		}
// console.log(261);
		// TODO: Can be replaced with Map
		let reduced_costs = {};
		for(let j=0;j<csize;j++) {
			if(!basic_indices.includes(j)) {
				reduced_costs[j] = c.data[j] - c_b.dot(B_inv.dot(A.col(j)))
			}
		}

// console.log(270,reduced_costs);
		if(Object.values(reduced_costs).every(x=>x>=0)) {	
			optimal = true;
			break;
		}
// console.log(274);
		let chosen_j;
		for(let j of Object.keys(reduced_costs)) {
			if(reduced_costs[j] < 0) {
				chosen_j = +j; // Convert to integer 
				break;
			}
		}

// console.log(283,typeof chosen_j,'>'+chosen_j+'<');

		let d_b = B_inv.dot(A.col(chosen_j)).neg();
// console.log(284);
		if(d_b.data.every(x=>x>=0)) {
			opt_infinity = true;
			break;
		}

		let l, theta_star;

		for(let i=0;i<basic_indices.length;i++) {
			if(d_b.data[i] < 0) {
				if (typeof l == 'undefined') {
					l = i;
				}
				if( -x_b.data[i]/d_b.data[i] < -x_b.data[l]/d_b.data[l]) {
					l = i;
					theta_star = -x_b.data[i]/d_b.data[i];
				}
			}
		}	
		
		basic_indices[l] = chosen_j;
		basic_indices = basic_indices.sort();

		B = A.selectCols(basic_indices);

	}	
// console.log(311);
	if (opt_infinity) {
		// console.log('Optimal is inifinity');
		return -1;
	}

	if(!optimal) {
		// console.log('optimal not found');
		return -1;
	}

	let x = Vector.zeros(csize);

	for(let i=0;i< csize;i++) {
		if(basic_indices.includes(i)) {
			x.data[i] = x_b.data[basic_indices.indexOf(i)];
		}
	}
// console.log(329,x);
	return x;

}
