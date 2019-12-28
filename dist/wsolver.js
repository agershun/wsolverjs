/*

   Copyright (c) Andrey Gershun (agershun@gmail.com), 2019

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
    	/** alasql main function */
        module.exports = factory();
    } else {
        root.wsolver = factory();
    }
}(this, function () {

const wsolver = function() {

};

wsolver.version = '0.0.1';


// Tolerance constant for almost()

wsolver.EPSILON = 0.00000001;
wsolver.MAX_ITERATIONS = 100000;

// Vector library

class Vector {
	constructor(size) {
		this.size = size;
		this.data = Array(size);
		return this;
	}

	static zeros(size) {
		const v = new Vector(size);
		v.data.fill(0.0);
		return v;
	}

	static ones(size) {
		const v = new Vector(size);
		v.data.fill(1.0);
		return v;
	}

	static init(data) {
		if(data instanceof Vector) {
			return data;
		}
		const v = new Vector(data.length);
		v.data = data;
		return v;
	}

	// a.dot(b)

	dot(b) {
		if(b instanceof Matrix) {
			if(this.size != b.rsize) {
				throw "not equal sizes of vector and matrix";
			}
			let v = Vector.zeros(b.csize);
			for(let i=0;i<this.size;i++) {
				for(let j=0;j<b.csize;j++) {
					v.data[j] += this.data[i]*b.data[i][j];
				}
			}
			return v;
		} else if(b instanceof Vector) {
			let res = 0;
			for(let i=0;i<this.size;i++) {
				res += this.data[i]*b.data[i];
			}
			return res;			
		} else if (typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] *= b;
			}
			return r;
		} else {
			throw 'wrong type'
		}
	}	

	clone() {
		const v = new Vector(this.size);
		v.data = this.data.slice();
		return v;
	}

	cloneData() {
		return this.data.slice();
	}

	almost(b) {
    	let res = true;
    	if(this.size != b.size) {
    		throw 'Size is different';
    	}
    	for(let i=0;i<this.size;i++) {
    		if(!almost(this.data[i],b.data[i])) res = false;
    	}
    	return res;		
	}

	add(b) {
		if(b instanceof Vector) {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] += b.data[i];
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] += b;
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	sub(b) {
		if(b instanceof Vector) {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] -= b.data[i];
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] -= b;
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	mul(b) {
		if(b instanceof Vector) {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] *= b.data[i];
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] *= b;
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	div(b) {
		if(b instanceof Vector) {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] /= b.data[i];
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r.data[i] /= b;
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	copyFrom(v,start) {
		for(let i=0;i<v.size;i++) {
			this.data[start+i] = v.data[i];
		}
	}

	neg() {
		let v = new Vector(this.size);
		for(let i=0;i<this.size;i++) {
			v.data[i] = -this.data[i];
		}
		return v;
	}

	slice(start,finish) {
		if(typeof finish == 'undefined') {
			finish = this.size;
		}
		let v = new Vector(finish-start);
		v.data = this.data.slice(start,finish);
		return v;
	}

	diag() {
		let m = Matrix.zeros(this.size,this.size);
		for(let i=0;i<this.size;i++) {
			m.data[i][i] = this.data[i];
		}
		return m;
	}

}

wsolver.Vector = Vector;

// Vector library

class Matrix {

	constructor(rsize,csize) {
		this.rsize = rsize;
		this.csize = csize;
		this.data = Array(rsize);
		for(let i=0;i<rsize;i++){
			this.data[i] = Array(csize);
		}
		return this;
	}

	clone() {
		const m = new Matrix(this.rsize,this.csize);
		m.data = this.cloneData();
		return m;
	}

	cloneData() {
		const data = new Array(this.rsize);
		for(let i=0;i<this.rsize;i++){
			data[i] = this.data[i].slice();
		}
		return data;
	}


	static zeros(rsize,csize) {
		const m = new Matrix(rsize,csize);
		for(let i=0;i<rsize;i++){
			m.data[i].fill(0.0);
		}
		return m;
	}

	static ones(rsize,csize) {
		const m = new Matrix(rsize,csize);
		for(let i=0;i<rsize;i++){
			m.data[i].fill(1.0);
		}
		return m;
	}


	static init(data) {
		if(data instanceof Matrix) {
			return data;
		}
		const m = new Matrix(data.length,data[0].length);
		m.data = data;
		return m;
	}

	trans() {
		const m = new Matrix(this.csize,this.rsize);
		for(let i=0;i<this.rsize;i++){
			for(let j=0;j<this.csize;j++) {
				m.data[j][i] = this.data[i][j];	
			}
		}
		return m;
	}

	// SImirar to A[:,rows] in Python

	selectRows(rows) {
		let M = new Matrix(rows.length, this.csize);
		for(let i=0;i<rows.length;i++) {
			for(let j=0;j<this.csize;j++) {
				M.data[i][j] = this.data[rows[i]][j];
			}
		}
		return M;
	}

	selectCols(cols) {
		let M = new Matrix(this.rsize,cols.length);
		for(let i=0;i<this.rsize;i++) {
			for(let j=0;j<cols.length;j++) {
				M.data[i][j] = this.data[i][cols[j]];
			}
		}
		return M;
	}


/*
	// function for finding rank of matrix
	// Based on https://www.geeksforgeeks.org/program-for-rank-of-matrix/
	// 
	rank2() {
		let m = this.clone();
    	let rank = m.csize; 
  
    	for (let row = 0; row < rank; row++)  { 
    		if(row >= m.rsize) break;

  	        if (!utils.eq(m.data[row][row],0.0)) { 
	           for (let col = 0; col < m.rsize; col++) { 
	               if (col != row) { 
	                 	let mult = m.data[col][row] / m.data[row][row]; 
	                 	// let mult = m.data[row][col] / m.data[row][row]; 
	                 	for (let i = 0; i < rank; i++) {
	                 		m.data[col][i] -= mult * m.data[row][i]; 
	                 	}
	              	} 
	           }
	        } else {
	            let reduce = true; 
	            for (let i = row + 1; i < m.rsize;  i++) {
	                if (!utils.eq(m.data[i][row],0.0)) {
	                	let tmp = m.data[i];
	                	m.data[i] = m.data[rank];
	                	m.data[rank] = m.data[i];
	                    reduce = false; 
	                    break; 
	                } 
	            } 
	  
	            if (reduce) { 
	                rank--; 
	                for (let i = 0; i < m.rsize; i++) {
	                    m.data[i][row] = m.data[i][rank]; 
	                }
	            } 
	            row--; 
	        } 
	        console.log(125,rank);
	    } 
    	return rank; 
    }
*/
    // Matrix rank
    // Source: https://cp-algorithms.com/linear_algebra/rank-matrix.html

    rank() {
    	let A = this.clone();
    	let rank = 0;
    	let selected = new Array(A.rsize);
    	selected.fill(false);

    	for(let i=0; i<A.csize;i++) {
    		let j;
    		for(j=0;j<A.rsize;j++) {
    			if(!selected[j] && !almost(A.data[j][i],0)) {
    				break;
    			}
    		}

    		if(j != A.rsize) {
    			rank++;
    			selected[j]=true;
    			for(let p=i+1;p<A.csize;p++) {
    				A.data[j][p] /= A.data[j][i];
    			}
    			for(let k=0;k<A.rsize;k++) {
    				if (k != j && !almost(A.data[k][i],0)) {
    					for(let p = i+1; p<A.csize;p++) {
    						A.data[k][p] -= A.data[j][p]*A.data[k][i];
    					}
    				}
    			}
    		}
    	}
    	return rank;
    }


	rref() {
		let m = this.clone();
		m.pivots = [];

		let lead = 0;

		for(let k=0; k<m.rsize; k++) {
			if(lead >= m.csize) {
				return m;
			}
			let i = k;
			while(m.data[i][lead] == 0.0) {
				i++;
				if(i == m.rsize) {
					i = k;
					lead++;
					if(lead == m.csize) {
						return m;
					}
				}
			}
			m.pivots.push(k);
			// Swap rows
			if(i != k) {
				let tmp = m.data[i];
				m.data[i] = m.data[k];
				m.data[k] = tmp;
			}

	        let val = m.data[k][lead];
	        if(val != 0.0) {
		        for (let j = 0; j < m.csize; j++) {
		            m.data[k][j] /= val;
		        }
		   	}
	 
	        for (let i = 0; i < m.rsize; i++) {
	            if (k == i) continue;
	            val = m.data[i][lead];
	            for (let j = 0; j < m.csize; j++) {
	                m.data[i][j] -= val * m.data[k][j];
	            }
	        }
	        lead++;
	    }
		return m;
	}

	// TODO rewrite

	inv() {
	    if(this.csize !== this.csize){
	    	throw "The number of rows and columns should be equal for matrix inversion";
	    }
	    let i=0, ii=0, j=0, dim=this.csize, e=0, t=0;
	    let I = [], C = [];
	    for(i=0; i<dim; i+=1){
	        // Create the row
	        I[I.length]=[];
	        C[C.length]=[];
	        for(j=0; j<dim; j+=1){
	            if(i==j){ I[i][j] = 1; }
	            else{ I[i][j] = 0; }
	            C[i][j] = this.data[i][j];
	        }
	    }
	    
	    // Perform elementary row operations
	    for(i=0; i<dim; i+=1){
	        // get the element e on the diagonal
	        e = C[i][i];
	        
	        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
	        if(e==0){
	            //look through every row below the i'th row
	            for(ii=i+1; ii<dim; ii+=1){
	                //if the ii'th row has a non-0 in the i'th col
	                if(C[ii][i] != 0){
	                    //it would make the diagonal have a non-0 so swap it
	                    for(j=0; j<dim; j++){
	                        e = C[i][j];       //temp store i'th row
	                        C[i][j] = C[ii][j];//replace i'th row by ii'th
	                        C[ii][j] = e;      //repace ii'th by temp
	                        e = I[i][j];       //temp store i'th row
	                        I[i][j] = I[ii][j];//replace i'th row by ii'th
	                        I[ii][j] = e;      //repace ii'th by temp
	                    }
	                    //don't bother checking other rows since we've swapped
	                    break;
	                }
	            }
	            //get the new diagonal
	            e = C[i][i];
	            //if it's still 0, not invertable (error)
	            if(e==0){return}
	        }
	        
	        // Scale this row down by e (so we have a 1 on the diagonal)
	        for(j=0; j<dim; j++){
	            C[i][j] = C[i][j]/e; //apply to original matrix
	            I[i][j] = I[i][j]/e; //apply to identity
	        }
	        
	        // Subtract this row (scaled appropriately for each row) from ALL of
	        // the other rows so that there will be 0's in this column in the
	        // rows above and below this one
	        for(ii=0; ii<dim; ii++){
	            // Only apply to other rows (we want a 1 on the diagonal)
	            if(ii==i){continue;}
	            
	            // We want to change this element to 0
	            e = C[ii][i];
	            
	            // Subtract (the row above(or below) scaled by e) from (the
	            // current row) but start at the i'th column and assume all the
	            // stuff left of diagonal is 0 (which it should be if we made this
	            // algorithm correctly)
	            for(j=0; j<dim; j++){
	                C[ii][j] -= e*C[i][j]; //apply to original matrix
	                I[ii][j] -= e*I[i][j]; //apply to identity
	            }
	        }
	    }
	    
	    //we've done all operations, C should be the identity
	    //matrix I should be the inverse:
	    let m = new Matrix(this.csize,this.rsize);
	    m.data = I;

	    return m;

	}

	// Matrix multiplication

	dot(d) {
		if(d instanceof Vector) {
		    if(this.csize != d.size){ 
		    	throw "Matrix.dot(Vector): Matrix number of rows is not equal to vector size";
		    }
		    const r = Vector.zeros(this.rsize);
	        for(var i=0; i<this.rsize; i++){
	            for(var m=0; m<this.csize; m++){
	                r.data[i] += this.data[i][m] * d.data[m];                      
	            }
	        }
		    return r;
    	} else if (d instanceof Matrix) {
		    if(this.csize != d.rsize){ 
		    	throw "Matrix.dot(Matrix): Number of rows of the first matrix is not equal to the number of columns of the second matrix";
		    }

		    const r = Matrix.zeros(this.rsize,d.csize);
		    for(let i=0;i<this.rsize;i++) {
		    	for(let j=0;j<this.csize;j++) {
			    	for(let k=0;k<d.csize;k++) {
			    		r.data[i][k] += this.data[i][j]*d.data[j][k];
			    	}
			    } 
		    }
		    return r;
    	} else if (typeof d == 'number') {
    		const r = this.clone();
    		for(let i=0;i<this.rsize;i++) {
    			for(let j=0;j<this.csize;j++) {
    				r.data[i][j] *= d;
    			}
    		}
    		return r;
    	} else {
    		throw 'Error'
    	}
    }

    // About

    almost(B) {
    	let res = true;
    	if(this.csize != B.csize) res = false;
    	if(this.rsize != B.rsize) res = false;
    	for(let i=0;i<this.rsize;i++) {
    		for(let j=0;j<this.csize;j++) {
    			if(!almost(this.data[i][j],B.data[i][j])) res = false;
    		}
    	}
    	return res;
    }

	add(b) {
		if(b instanceof Matrix) {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] += b.data[i][j];
				}
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] += b;
				}
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	sub(b) {
		if(b instanceof Matrix) {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] -= b.data[i][j];
				}
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] -= b;
				}
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	mul(b) {
		if(b instanceof Matrix) {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] *= b.data[i][j];
				}
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] *= b;
				}
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}

	div(b) {
		if(b instanceof Matrix) {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] /= b.data[i][j];
				}
			}
			return r;
		} else if(typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.rsize;i++) {
				for(let j=0;j<this.csize;j++) {
					r.data[i][j] /= b;
				}
			}
			return r;
		} else {
			throw 'Wrong operand type';
		}
	}




	copyFrom(m,srow, scol) {
		for(let i=0;i<m.rsize;i++) {
			for(let j=0;j<m.csize;j++) {
				this.data[srow+i][scol+j] = m.data[i][j];
			}
		}
	}

	neg() {
		let m = new Matrix(this.rsize,this.csize);
		for(let i=0;i<this.rsize;i++) {
			for(let j=0;j<this.csize;j++) {
				m.data[i][j] = -this.data[i][j];
			}
		}
		return m;
	}

	slice(rstart,cstart,rfinish,cfinish) {
		if(typeof rfinish == 'undefined') {
			rfinish = this.rsize;
		}
		if(typeof cfinish == 'undefined') {
			cfinish = this.csize;
		}
		let m = new Matrix(rfinish-rstart,cfinish-cstart);
		for(let i=0;i<rfinish-rstart;i++) {
			m.data[i] = this.data[rstart+i].slice(cstart,cfinish);
		}
		return m;
	}

	static eye(size) {
		let m = Matrix.zeros(size,size);
		for(let i=0;i<size;i++) {
			m.data[i][i] = 1;
		}
		return m;
	}



}	

wsolver.Matrix = Matrix;

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

wsolver.solveLpBrute = function solveLpBrute(c,A,b,opt) {
	// Prepare data
	c = Vector.init(c);
	A = Matrix.init(A);
	b = Vector.init(b);

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		A = A.selectRows(A.trans().rref().pivots);
	}

	let csize = A.csize;
	let rsize = A.rsize;

	let optVal = Infinity;
	let optBasis;
	let optX_b;
	let iteration = 0;

	for(let basicIndices of utils.combinations(utils.range(A.csize),A.rsize)) {
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


class utils {
	//
	// Generate array of numbers from 0 to size-1
	//
	static range(size) {
		return [ ...Array(size).keys() ];
	}

	static *combinations(pool, r) {
		const n = pool.length;
		if (r > n) {
			return;
		}

	  	let indices = utils.range(r);
	  
	  	function ret() {
	    	let ret = [];
	    	for (let i=0; i < indices.length; i++) {
	      		ret.push(pool[indices[i]])
	    	}
	    	return ret;
	  	}
	  
	  	yield ret();
	  
	  	while (true) {
	    	let broken = false;
	    	let i = r-1;
	    	for (; i >= 0; i--) {
	      		if (indices[i] != i + n - r) {
	        		broken = true;
	        		break;
	      		}
	    	}
		    if (!broken) {
				return;
		    }
	    	indices[i]++;
	    	for (let j=i+1; j < r; j++) {
	      		indices[j] = indices[j-1] + 1;
	    	}
	    	yield ret();
	  	}
	}

	static almost(a,b) {
		return Math.abs(a-b)<wsolver.EPSILON;
	}

}

const almost = wsolver.almost = utils.almost;
wsolver.utils = utils;


return wsolver;

}));