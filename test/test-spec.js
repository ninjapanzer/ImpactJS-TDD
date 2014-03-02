window.ImpactPrefix = 'base/';

window.testIndex = 0;

window.gameData = {};


// In order to mix in the impact libs you need to create a module. This will make sure the each module is unique as
// Impact get very upset when the names collide

// Call with testModule(for:"wonderful_test", requires:['some_module'])

window.testModule = function(options) {
  window.testIndex = window.testIndex + 1;
  module = ig.module('tests.' + options.name + '.' + window.testIndex).requires(options.requires.join(','));
  return module;
};
