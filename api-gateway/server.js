const express = require("express");
const routes = require("./routes/routes");
const { Queue } = require('bullmq');


const app = express();

app.use(express.json());
app.use("/api/task", routes);



app.listen(3000, () => {
  console.log("API running on port 3000");
});
