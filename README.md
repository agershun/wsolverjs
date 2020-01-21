# wsolverjs - JavaScript linear programming solver

Version: 0.1.0

The solver supports the following methods:
* brute-force
* simplex 
* interior-point methods)


## Usage

### In standard form
```
	let {solveLpSimplex, Matrix, Vector} = require('wsolverjs');

	let A = Matrix.init([
		[ 0, 1, 0, 0, 1, 0, 0],
		[-1, 1, 0, 0, 0, 1, 0],
		[ 1, 0,-1,-1, 0, 0, 1],
		[ 0,-1, 1, 1, 0, 0, 0],
	]);
	let b = Vector.init([2,0,-6,6]);
	let c = Vector.init([-1,4,9,9,0,0,0])
	let x = solveLpBrute(c,A,b);
```

### Solve the problem from MPS file
```
	let {LpMps} = require('wsolverjs');

	LpMps.read('prob1.mps').then(function(p) {
		let g = p.solve();
	});
```

## Credits

Many thanks to people who develop the ideas, algorithms and open-source programs used in this library:

* [George Danzig](https://en.wikipedia.org/wiki/George_Dantzig) for [Simplex algorithm](https://en.wikipedia.org/wiki/Simplex_algorithm)
* James Halliday for [Rref](https://github.com/substack/rref) library


## Copyright

Copyright 2019 Andrey Gershun (agershun@gmail.com)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
