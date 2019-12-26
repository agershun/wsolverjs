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

}

wsolver.Matrix = Matrix;
