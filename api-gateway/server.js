const express = require("express");
const multer = require("multer");
const routes = require("./routes/routes");
const { Queue } = require('bullmq');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/", upload.single('uploadedFile'), routes);



app.listen(3000, () => {
  console.log("API running on port 3000");
});
