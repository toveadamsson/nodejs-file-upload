const MB = 5; // 5 megabyte
const FILE_SIZE_LIMIT = MB * 1024 * 2014;

const fileSizeLimiter = (req, res, next) => {
  const files = req.files;

  const filesOverLimit = [];
  //Which files are over the limit?
  Object.keys(files).forEach((key) => {
    if (files[key].size > FILE_SIZE_LIMIT) {
      filesOverLimit.push(files[key].name);
    }
  });
  if (filesOverLimit.length) {
    const properVerb = filesOverLimit.length > 1 ? "are" : "is";
    const sentence =
      `Upload files. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(
        ",",
        ", "
      );

    const message =
      fileSizeLimiter.length > 3
        ? sentence.replace(",", " and")
        : sentence.replace(/,(?=[^,]*$)/, " and");

    return res.status(413).json({ status: "error", message });
  }
  next();
};

module.exports = fileSizeLimiter;
