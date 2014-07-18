var sandwich = require('sandwich');
var util = require('util');

module params from './params';
import scenario from './pipe-chain';

var MAX_COMBOS = 2000; // TODO: set to Infinity once things are fast enough

var possibilities = params.quickTestPossibilities;
var combinationsIterator = sandwich(...params.keys.map(k => possibilities[k]));

if (combinationsIterator.possibilities > MAX_COMBOS) {
  console.log(`Preparing to run ${MAX_COMBOS} tests, out of ${combinationsIterator.possibilities} possible`);
} else {
  console.log(`Preparing to run ${combinationsIterator.possibilities} tests`);
}

doNextCombo().catch(console.error);

var currentComboIndex = 0;
function doNextCombo() {
  var comboValues = combinationsIterator.next();
  if (comboValues === null) {
    return;
  }
  var comboParams = comboParamsFromComboValues(comboValues);

  var start = process.hrtime();
  return scenario(comboParams).then(results => {
    var milliseconds = msSinceHrtime(start);
    console.log(`${JSON.stringify(comboValues)}: ${milliseconds} ms, ${util.format(results)}`);

    if (++currentComboIndex < MAX_COMBOS) {
      return doNextCombo();
    }
  });
}

function comboParamsFromComboValues(comboValues) {
  var comboParams = {};
  comboValues.forEach((v, i) => {
    comboParams[params.keys[i]] = v;
  });
  return comboParams;
}

function msSinceHrtime(hrtimeStart) {
  var diff = process.hrtime(hrtimeStart);
  var nanoseconds = diff[0] * 1e9 + diff[1];
  return nanoseconds / 1e6;
}
