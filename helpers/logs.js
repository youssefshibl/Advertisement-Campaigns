const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");

let logs_dir_name = process.env.SERVICE_LOG_DIR;
let log_file_name = process.env.SERVICE_LOG_FILE;

const logDirectory = path.join(path.resolve("./"), logs_dir_name ?? "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

function getFormattedDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const accessLogStream = rfs.createStream(
  (time, index) => {
    let logDate = new Date();
    if (time) {
      logDate = new Date(time);
    }

    const dir = getFormattedDate(logDate);
    const fullPath = path.join(logDirectory, dir);

    // Create directory if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    return path.join(dir, log_file_name ?? "access.log");
  },
  {
    interval: "1d", // rotate daily
    path: logDirectory,
  }
);

module.exports = accessLogStream;
