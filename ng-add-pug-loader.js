/**
 * Adds the pug-loader inside Angular CLI's webpack config, if not there yet.
 * @see https://github.com/danguilherme/ng-cli-pug-loader
 */
const fs = require('fs');
const commonCliConfig = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/common.js';
const pugRule = '{ test: /.pug$/, use: [ { loader: "apply-loader" }, { loader: "pug-loader" } ] },';

fs.readFile(commonCliConfig, (err, data) => {
  if (err) { throw err; }

  const configText = data.toString();
  // make sure we don't add the rule if it already exists
  if (configText.indexOf(pugRule) > -1) { return; }

  // Insert the pug webpack rule
  const position = configText.indexOf('rules: [') + 8;
  const output = [configText.slice(0, position), pugRule, configText.slice(position)].join('');
  const file = fs.openSync(commonCliConfig, 'r+');
  fs.writeFile(file, output);
  fs.close(file);
});
