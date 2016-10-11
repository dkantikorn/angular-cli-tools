var path = require('path');
var tools = require('../../api/tools');
var cliConfig = require('../../cli-config');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var merge = require('merge');


var install = {
    localTemplates : function (vFlags) {

        //find the project's node_modules folder
        var nodeModulesPath = tools.getNodeModulesPath();
        if (nodeModulesPath) {
            var localTemplatesDirectory = path.resolve(nodeModulesPath, cliConfig.user.templates.location);

            //check if local templates already exist
            if (tools.fileExists(localTemplatesDirectory)) {
                if (tools.isvFlagPresent(vFlags, '--force')) {
                    install.copyLocalTemplates(localTemplatesDirectory);
                } else {
                    tools.throwError(
                        'Local templates already exist in directory: ' + tools.logColorYellow(localTemplatesDirectory) +
                        tools.logColorRed('\nTo overwrite local templates run command with ' +
                            tools.logColorYellow('\'-f\'') +
                            tools.logColorRed('. For example: ') +
                            tools.logColorYellow('\'ngt install templates -f\'') +
                            tools.logColorRed(' or ') +
                            tools.logColorYellow('\'ngt i t -f\''))
                    );
                }

            } else {
                install.copyLocalTemplates(localTemplatesDirectory);
            }
        } else {
            tools.throwError('Could not find project\'s node_modules folder. Make sure the node_modules folder is present at the root of your project where local templates will be installed.');
        }
    },
    copyLocalTemplates : function (localTemplatesDirectory, callback) {
        callback = callback || tools.emptyFunction();
        //first make the './angular-cli-tools/templates' directory
        mkdirp(localTemplatesDirectory, function (err) {
            if (err) throw err;

            //then copy templates to './angular-cli-tools/templates'
            var templatesDirectory = cliConfig.appRoot + cliConfig.templates.root;
            ncp(templatesDirectory, localTemplatesDirectory, {clobber : true}, function (err) {
                if (err) throw err;
                tools.log(
                    tools.logColorYellow('Local (editable) templates installed in: '),
                    tools.logColorCyan(localTemplatesDirectory)
                );
                callback();
            })
        })
    },
    localConfig : function () {

        //find the project's node_modules folder
        var nodeModulesPath = tools.getNodeModulesPath();
        if (nodeModulesPath) {
            var localConfigFilePath = path.resolve(nodeModulesPath, cliConfig.user.config.location);

            //check if local templates already exist
            if (tools.fileExists(localConfigFilePath)) {
                var userConfig = JSON.parse(tools.readFile(localConfigFilePath));
                var templateConfig = JSON.parse(tools.readFile(cliConfig.appRoot + cliConfig.config.root));
                var mergedConfig = merge.recursive(true, templateConfig, userConfig);
                tools.writeFile(localConfigFilePath, JSON.stringify(mergedConfig, null, 4));
                tools.log(
                    tools.logColorYellow('Config file for Angular CLI Tools was updated ')
                );

            } else {
                install.copyLocalConfig(localConfigFilePath);
            }
        } else {
            tools.throwError('Could not find project\'s node_modules folder. Make sure the node_modules folder is present at the root of your project where local templates will be installed.');
        }
    },
    copyLocalConfig : function (localConfigFilePath, callback) {
        callback = callback || tools.emptyFunction();
        //then copy config.json to './angular-cli-tools/config.json'
        var configFileRoot = cliConfig.appRoot + cliConfig.config.root;
        ncp(configFileRoot, localConfigFilePath, function (err) {
            if (err) throw err;
            tools.log(
                tools.logColorYellow('Config file for Angular CLI Tools installed in: '),
                tools.logColorCyan(localConfigFilePath)
            );
            callback();
        })
    },
};
module.exports = install;

