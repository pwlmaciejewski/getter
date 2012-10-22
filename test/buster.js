var config = module.exports;

config.browser = {
  environment: 'browser',
  rootPath: "../",
  sources: ["lib/getter.js"],
  tests: [
    "test/test*.js"
  ]
};

config.amd = {
  environment: 'browser',
  autoRun: false,
  rootPath: "../",
  deps: ["test/amd/require.js"],
  resources: ["lib/getter.js"],
  tests: [
    "test/test*.js"
  ]
};

config.node = {
  environment: 'node',
  rootPath: "../",
  tests: [
    "test/test*.js"
  ]
};
