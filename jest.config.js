const {defaults} = require('jest-config');


module.exports = {
  verbose: true,
  collectCoverage: true,
  testMatch:[
    "<rootDir>/src/**/*.spec.ts"
  ],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.mock.ts",
    "!src/**/*.module.ts",
    "!src/**/*.model.ts",
    "!src/**/*-routes.ts",
    "!src/**/index.ts",
    "!src/environments/**/*.ts",
    "!src/main.ts",
    "!src/polyfills.ts",
  ]
};
