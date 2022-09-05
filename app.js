const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const filesPayloadExists = require("./middleware/filesPayloadExists");
const fileExtLimter = require("./middleware/fileExtLimiter");
const fileSizeLimiter = require("./middleware/fileSizeLimiter");

const PORT = process.env.PORT || 3500;

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post(
  "/upload",
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimter([".png", ".jpg", ".jpeg"]), // this needs to recieve the array that has the files extensions that we will accept. This has parantheses, it's a function that is being called immediatly.
  fileSizeLimiter,

  (req, res) => {
    const files = req.files;
    console.log("----", files);

    Object.keys(files).forEach((key) => {
      const filepath = path.join(__dirname, "files", files[key].name);
      files[key].mv(filepath, (err) => {
        if (err)
          return res.status(500).json({ status: "error", message: error });
      });
    });

    return res.json({
      status: "success",
      message: Object.keys(files).toString(),
    });
  }
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
