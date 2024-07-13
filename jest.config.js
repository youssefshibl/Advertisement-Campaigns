module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/"],
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Test Report",
        outputPath: "reports/test-report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
};
