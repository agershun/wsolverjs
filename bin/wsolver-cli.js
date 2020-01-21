#!/usr/bin/env node
//
// Command line interface for wsolver
// Version: 0.0.2
// Date: 29.12.2019
// (c) 2019-2020, Andrey Gershun
//

let wsolver = require('..');
let path = require('path');
let fs = require('fs');
let stdin = process.openStdin();
let yargs = require('yargs')
	.strict()
	.usage('wsolver - linear programming solver (version ' + wsolver.version + ')\n\nUsage: wsolver [params]')

.version('v', 'Echo wsolver version', wsolver.version)
	.alias('v', 'version')

.help('h','Show help message')
	.alias('h', 'help')

// .boolean('m')
// 	.describe('m', 'Minify json output')
// 	.alias('m', 'minify')

.describe('m', 'Read the problem from the .MPS file')
	.alias('m', 'mps')
	.nargs('m', 1)
	.normalize('m')

.describe('s', 'Solve the problem')
	.alias('s', 'solve')
	.nargs('s', 0)
	.normalize('s')

.example('wsolver -mps example.mps -solve', 'Read the .MPS file and solve it')
.example('wsolver -m example.mps -s', 'Read the .MPS file and solve it')
// .example('')
// .example('$0 -mod example.mod -dat example.dat -solve', 'Read the GMPL file and solve it')
// .example('')

.epilog('\nMore information about the library: github.com/agershun/wsolver')

let argv = yargs.argv;
let sql = '';
let params = [];
let pipedData = ''
stdin.on('data', function (chunk) {
	pipedData += chunk;
});

if (argv.v) {
	console.log(wsolver.version);
	process.exit(0);
}

if (argv.mps) {
	if (!fs.existsSync(argv.mps)) {
		console.error('Error: file not found');
		process.exit(1);
	}

	if (isDirectory(argv.mps)) {
		console.error('Error: file expected but directory found');
		process.exit(1);
	}

	mps = fs.readFileSync(argv.f, 'utf8').toString();

	wsolver.readMps();

	//TODO - execute
	// execute(sql, argv._);

} else {
	// sql = argv._.shift() || '';

	// // if data is not piped
	// if (Boolean(process.stdin.isTTY)) {
	// 	execute(sql, argv._);
	// }
}

// if data is piped
stdin.on('end', function () {
	execute(pipedData, argv._);
});

/**
 * Execute SQL query
 *
 * @sql {String} SQL query
 * @param {String} Parameters
 * @returns {null} Result will be printet to console.log
 */
function execute(mps, params) {

	// if (0 === sql.trim().length) {
	// 	console.error("\nNo SQL to process\n");
	// 	yargs.showHelp();
	// 	process.exit(1);
	// }

	// for (var i = 1; i < params.length; i++) {
	// 	var a = params[i];
	// 	if (a[0] !== '"' && a[0] !== "'") {
	// 		if (+a == a) { // jshint ignore:line
	// 			params[i] = +a;
	// 		}
	// 	}
	// }

	// alasql.promise(sql, params)
	// 	.then(function (res) {
	// 		if (!alasql.options.stdout) {
	// 			console.log(formatOutput(res));
	// 		}
	// 		process.exit(0);
	// 	}).catch(function (err) {
	// 		let errorJsonObj = JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));
	// 		console.error(formatOutput({
	// 			error: errorJsonObj
	// 		}));
	// 		process.exit(1);
	// 	});
}

/**
 * Is this padh a Directory
 *
 * @param {String} filePath
 * @returns {Boolean}
 */
function isDirectory(filePath) {
	var isDir = false;
	try {
		var absolutePath = path.resolve(filePath);
		isDir = fs.lstatSync(absolutePath).isDirectory();
	} catch (e) {
		isDir = e.code === 'ENOENT';
	}
	return isDir;
}


/**
 * Format output
 *
 * @param {Object} Object to be formatted according to -p flag
 * @returns {JSON string}
 */
function formatOutput(obj) {
	if (argv.m) {
		return JSON.stringify(obj);
	}
	return JSON.stringify(obj, null, 2);
}
