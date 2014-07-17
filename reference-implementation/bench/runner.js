var sandwich = require('sandwich');
var CliTable = require('cli-table');

module params from './params';
import scenario from './pipe-chain';

var combinationsIterator = sandwich(...params.keys.map(k => params.possibilities[k]));

var currentComboIndex = 0;
doNextCombo();

function doNextCombo() {
  var combo = combinationsIterator.next();
  if (combo === null) {
    return;
  }

  var table = new CliTable();

  var rows = params.keys.map((k, i) => {
    var name = params.names[k];
    var value = params.formatters[k](combo[i]);
    return { [name]: value };
  });

  table.push(...rows);
  console.log(table.toString());

  var comboParams = {};
  combo.forEach((v, i) => {
    comboParams[params.keys[i]] = v;
  });

  var start = process.hrtime();
  scenario(comboParams).then(() => {
    var diff = process.hrtime(start);
    var nanoseconds = diff[0] * 1e9 + diff[1];
    var milliseconds = nanoseconds / 1e6;
    console.log(milliseconds + ' ms');

    if (++currentComboIndex < 1000) {
      doNextCombo();
    }
  })
  .catch(console.error);
}
