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
