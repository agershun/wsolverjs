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
		const v = new Vector(data.length);
		v.data = data;
		return v;
	}

	// a.dot(b)

	dot(b) {
		// TODO - add verification for a Matrix class
		// if(b instanceof 'Matrix') {}
		let res = 0;
		for(let i=0;i<this.size;i++) {
			res += this.data[i]*b.data[i];
		}
		return res;
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
