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
        outputPath: "reports/index.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
      },
    ],
  ],
};
