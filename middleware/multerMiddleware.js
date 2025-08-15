const multer=require("multer")
const path=require("path")
const storage=multer.diskStorage({
    destination: "./profileImages/",
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
  });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  };
  const upload=multer({storage,fileFilter})
  module.exports=upload

