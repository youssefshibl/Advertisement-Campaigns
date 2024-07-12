// coverage-percentage.js

const fs = require('fs');
const path = require('path');

const coverageSummaryPath = path.join(__dirname, 'coverage', 'coverage-summary.json');

fs.readFile(coverageSummaryPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading coverage summary:', err);
    process.exit(1);
  }

  const coverageSummary = JSON.parse(data);
  const total = coverageSummary.total;
  const coveragePercentage = total.statements.pct;

  console.log(`Coverage: ${coveragePercentage}%`);
});
