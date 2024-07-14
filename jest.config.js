module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "testing/coverage",
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "testing/report/index.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
};
