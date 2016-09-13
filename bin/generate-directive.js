#! /usr/bin/env node

var tools = require('./api/tools');

var component = process.argv.slice('2');

var data = tools.getRuntimeData(component[1], 'class', {
	baseTs : __dirname + '/base/directive-ts.txt',
});

var name = data[0];
var paths = data[1];

var replace = tools.setupReplace(name);

if (tools.fileExists(paths.ts)) {
	tools.throwError("Directive already exists!");
}

if (!name) tools.throwError('You need to provide a name!');

try {
	tools.copyBaseComponent(paths.baseTs, (paths.ts), function () {
		try {
			tools.replaceInFile(paths.ts, replace.query, replace.result, (paths.ts), function () {
				tools.updateIndex(paths.pathBefore);
				tools.logSuccess('Successfully created directive \'' + name + '\'')
				tools.logSuccess('Created ' + paths.ts)
			});
		} catch (error) {
			throw error;
		}
	});
} catch (error) {
	throw error;
}
