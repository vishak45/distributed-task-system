const express = require("express");
const { v4: uuidv4 } = require("uuid");
const queue = require("../queue/queue");

const router = express.Router();

router.post("/task", async (req, res) => {
  const taskId = uuidv4();

  const task = {
    id: taskId,
    type: req.body.type || "TEST",
    payload: req.body.payload || {},
    name: req.body.name || "Anonymous",
  };

  await queue.add("new-task", task);

  console.log("Task queued:", task);

  res.json({
    message: "Task submitted",
    taskId,
  });
});

module.exports = router;
