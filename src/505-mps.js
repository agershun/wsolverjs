/*
	Class to read and parse MPS files.
*/

class LpMps {
	
	static async read(filename) {
		let data;
		if (typeof exports === 'object') {
			const fs = require('fs');
			data = fs.readFileSync(filename, {encoding: 'utf-8'})
		} else {
			let response = await fetch(url);
			if (response.ok) { 
	  			data = await response.text();
			} else {
	  			throw "Problem.readMps(): Can't fetch file";
			}
		}

		let p = new LpMps();
		p.filename = filename;
		p.mps = data;
		p.rows = {};
		p.cols = {};
		p.goal = {};
		p.dir = DIR_MIN;
		p.parse();
		// p.prepare();
		return p;
	}

	parse() {
		let g = this;
		let lines = g.mps.split(/\n/g);
		let ptr = 0;
		let words, newSection;
		function next() {
			while(lines[ptr].substr(0,1) == '*' || lines[ptr].trim() == ''){
				ptr++;
			};
			words = lines[ptr].trimRight().split(/\s+/g);
			// console.log(words);
			newSection = words[0] != '';
			ptr++;
		}
		next();
		if(words[0] == 'NAME') {
			g.name = words[1];
			next();
		}

		if(words[0] == 'ROWS') {
			next();
			while(!newSection) {
				if(words[1] == 'N') {
					g.goal = {name:words[2],coeffs:{}};
				} else if(words[1] == 'L' ) {
					g.rows[words[2]] = {name:words[2],type:'L', coeffs:{}};
				} else if(words[1] == 'E' ) {
					g.rows[words[2]] = {name:words[2],type:'E',coeffs:{}};
				} else if(words[1] == 'G' ) {
					g.rows[words[2]] = {name:words[2],type:'G',coeffs:{}};
				} else {
					throw 'paresMps(): Wrong row type in ROWS section at line '+ptr;
				}
				next();
			}
		}
		if(words[0] == 'COLUMNS') {
			next();
			while(!newSection) {
				let col = g.cols[words[1]];
				if(typeof col == 'undefined') {
					col = g.cols[words[1]]= {name:words[1]};
				}

				if(words.length == 4) {
					if(words[2] == g.goal.name) {
						g.goal.coeffs[words[1]] = +words[3];
					} else {
						g.rows[words[2]].coeffs[words[1]] = +words[3];
					}
				} else if(words.length == 6) {
					if(words[2] == g.goal.name) {
						g.goal.coeffs[words[1]] = +words[3];
					} else {
						g.rows[words[2]].coeffs[words[1]] = +words[3];
					}

					if(words[4] == g.goal.name) {
						g.goal.coeffs[words[1]] = +words[5];
					} else {
						g.rows[words[4]].coeffs[words[1]] = +words[5];
					}
				} else {
					throw "parseMps(): Wrong number of arguments in COLUMNS section at line "+ptr;
				}
				next();
			}
		}

		if(words[0] == 'RHS') {
			next();
			while(!newSection) {
				if(words.length == 4 || words.length == 6) {
					g.rows[words[2]].rhs = +words[3];
					if(words.length == 6) {
						g.rows[words[4]].rhs = +words[5];
					}
				} else if(words.length == 6) {
					throw "parseMps(): Wrong number of arguments in RHS section at line "+ptr;
				}
				next();
			}
		}

		if(words[0] == 'RANGES') {
			next();
			while(!newSection) {
				if(words.length == 4) {
					g.rows[words[2]].range = +words[3];
				} else if(words.length == 6) {
					throw "parseMps(): Wrong number of arguments in RANGES section at line "+ptr;
				}
				next();
			}
		}


		if(words[0] == 'BOUNDS') {
			next();
			while(!newSection) {
				let v = g.cols[words[3]];
				if(typeof v == 'undefined') {
					v = g.vars[words[3]] = {name:words[3]};
				}
				if(words[1] == 'UP') {
					v.up = +words[4];
				} else if(words[1] == 'LO') {
					v.lo = +words[4];
				} else if(words[1] == 'FX') {
					v.lo = +words[4];
					v.hi = +words[4];
					// v.fixed = true;
				} else if(words[1] == 'FR') {
					// v.free = true;
				} else if(words[1] == 'MI') {
					v.hi = 0;
				} else if(words[1] == 'PL') {
					v.lo = 0;
				} else if(words[1] == 'UI') {
					v.hi = +words[4];
					v.int = true;
				} else if(words[1] == 'LI') {
					v.lo = +words[4];
					v.int = true;
				} else if(words[1] == 'BV') {
					v.lo = 0;
					v.lo = 1;
					v.binary = true;
				} else if(words[1] == 'SC') {
					// v.lo = +words[4];
				} else {
					throw "parseMps(): Wrong bound type at line "+ptr;
				}
				next();
			}
		}
		if(words[0] != 'ENDATA') {
			throw "parseMps(): Wrong section at line "+ptr;
		}
	}

	toGeneral() {
		let g = new LpGeneral();

		let cons = Object.keys(this.rows);
		let vars = Object.keys(this.cols);
		let rows = this.rows;
		let cols = this.cols;
		let rsize = cons.length;
		let csize = vars.length;
		g.c = Vector.zeros(csize);
		g.A = Matrix.zeros(rsize,csize);
		g.L = Array(rsize).fill(-Infinity);
		g.U = Array(rsize).fill(Infinity);
		g.l = Array(csize).fill(-Infinity);
		g.u = Array(csize).fill(Infinity);
		g.v = vars;
		g.n = cons;
		g.t = Array(csize).fill(undefined); // Integer (true/false)

		// Set the goal variable
		for(let j=0;j<csize;j++) {
			let vr = this.cols[vars[j]];
			let coeff = this.goal.coeffs[vars[j]];
			if(typeof coeff != 'undefined') {
				g.c.data[j] = coeff;
			}
			if(typeof vr.lo != 'undefined') {
				g.l[j] = vr.lo;
			}
			if(typeof vr.up != 'undefined') {
				g.u[j] = vr.up;
			}
			g.t[j] = (vr.binary || vr.int);
		}

		for(let i=0;i<rsize;i++) {
			let cn = rows[cons[i]];
			if(cn.type == 'E' ) {
				// g.L[i] = g.U[i] = cn.rhs||0;
				// console.log(223,cn.type);

				if(typeof cn.range != 'undefined') {
					// console.log(217,cn.range);
					if(cn.range >= 0) {
						g.L[i] = (cn.rhs||0);
						g.U[i] = (cn.rhs||0) + cn.range;
					} else {
						g.L[i] = (cn.rhs||0) + cn.range;
						g.U[i] = (cn.rhs||0);
					}
				} else {
					// console.log(218,cn.range,cn.rhs);
					g.L[i] = (cn.rhs||0);
					g.U[i] = (cn.rhs||0);		
				}
			} else if(cn.type == 'G') {
				g.L[i] = (cn.rhs||0) ;
				if(typeof cn.range != 'undefined') {
					g.U[i] = (cn.rhs||0) + Math.abs(cn.range||0);
				} else {
					g.U[i] = Infinity;
				}
			} else if(cn.type == 'L') {
				if(typeof cn.range != 'undefined') {
					g.L[i] = (cn.rhs||0) - Math.abs(cn.range||0);
				} else {
					g.L[i] = -Infinity;
				}
				g.U[i] = (cn.rhs||0) ;
			} else {
				throw 'Mps.toGeneral(): wrong contraint type';
			}
		// console.log(229, g.L[i],g.U[i],cn.name);			

		}

		// Set coefficients
		for(let i=0;i<rsize;i++) {
			let cn = rows[cons[i]];

			for(let j=0;j<csize;j++) {
				if(typeof cn.coeffs[vars[j]] != 'undefined') {
					g.A.data[i][j] = cn.coeffs[vars[j]];
				}
			}
		}

		return g;
	}

}

wsolver.LpMps = LpMps;


