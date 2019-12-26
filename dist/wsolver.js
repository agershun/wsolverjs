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

			// TODO - add verification for a Matrix class

		} if(b instanceof Vector) {
			let res = 0;
			for(let i=0;i<this.size;i++) {
				res += this.data[i]*b.data[i];
			}
			return res;			
		} else if (typeof b == 'number') {
			let r = this.clone();
			for(let i=0;i<this.size;i++) {
				r *= b;
			}
			return r;
		} else {
			throw 'wring type'
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

	selectRows(rows){
		let a = new Matrix(rows.length, this.csize);
		for(let i=0;i<rows.length;i++) {
			for(let j=0;j<this.csize;j++) {
				a.data[i][j] = this.data[rows[i]][j];
			}
		}
		return a;
	}

	rref() {
		return new RrefMatrix(this);
	}

	// function for finding rank of matrix
	// Based on https://www.geeksforgeeks.org/program-for-rank-of-matrix/
	// 
	rank() {
		let m = this.clone();
    	let rank = m.csize; 
  
    	for (let row = 0; row < rank; row++)  { 
	        if (m.data[row][row] != 0.0) { 
	           for (let col = 0; col < m.rsize; col++) { 
	               if (col != row) { 
	                 	let mult = m.data[col][row] / m.data[row][row]; 
	                 	for (let i = 0; i < rank; i++) {
	                 		m.data[col][i] -= mult * m.data[row][i]; 
	                 	}
	              	} 
	           }
	        } else {
	            let reduce = true; 
	            for (let i = row + 1; i < m.rsize;  i++) {
	                if (m.data[i][row] != 0) {
	                	let tmp = m.data[i];
	                	m.data[i] = m.data[rank];
	                	m.data[rank] = m.data[i];
	                    reduce = false; 
	                    break; 
	                } 
	            } 
	  
	            if (reduce) { 
	                rank--; 
	                for (let i = 0; i < m.rsize; i ++) {
	                    m.data[i][row] = m.data[i][rank]; 
	                }
	            } 
	            row--; 
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

	invert() {
	    if(this.csize !== this.csize){
	    	// assert
	    	return;
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
	            C[i][j] = M[i][j];
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

}

wsolver.Matrix = Matrix;


wsolver.solveLpBrute = function solveLpBrute(c,A,b,opt) {
	// Prepare data
	c = Vector.init(c);
	A = Matrix.init(A);
	b = Vector.init(b);

	let csize = A.csize;
	let rsize = A.rsize;

	if(A.rank() < Math.min(A.rsize, A.csize)) {
		A = A.selectRows(A.trans().rref().pivots);
	}

	let optVal = Infinity;
	let optBasis;
	let optX_b;
	let iteration = 0;

	for(let basicIndices of utils.combinations(utils.range(A.csize),A.rsize)) {
		let B = A.selectRows(basicIndices);
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
}

wsolver.utils = utils;

return wsolver;

}));