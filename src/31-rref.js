// Reduced Row Echelon Form

class RrefMatrix extends Matrix {

	// The algoritm based on:
	// https://github.com/substack/rref/blob/master/index.js

	constructor(m) {
		super(m.rsize,m.csize);
		this.data = m.cloneData();
		this.rank = 0;
		this.pivots = [];

		let lead = 0;

		for(let k=0; k<this.rsize; k++) {
			if(lead >= this.csize) {
				return this;
			}
			let i = k;
			while(m.data[i][lead] == 0.0) {
				i++;
				if(i == this.rsize) {
					i = k;
					lead++;
					if(lead == this.csize) {
						return this;
					}
				}
			}
			this.pivots[this.rank] = k;
			this.rank++;
			// Swap rows
			if(i != k) {
				let tmp = this.data[i];
				this.data[i] = this.data[k];
				this.data[k] = tmp;
			}

	        let val = this.data[k][lead];
	        if(val != 0.0) {
		        for (let j = 0; j < this.csize; j++) {
		            this.data[k][j] /= val;
		        }
		   	}
	 
	        for (let i = 0; i < this.rsize; i++) {
	            if (k == i) continue;
	            val = this.data[i][lead];
	            for (let j = 0; j < this.csize; j++) {
	                this.data[i][j] -= val * this.data[k][j];
	            }
	        }
	        lead++;
	    }
		return this;
	}
}

wsolver.RrefMatrix = RrefMatrix;