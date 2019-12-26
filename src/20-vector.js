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
