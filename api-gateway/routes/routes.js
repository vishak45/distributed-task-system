const express = require("express");

const queue = require("../queue/queue");

const router = express.Router();

router.post("/addTasks", async(req, res) => {
  try {
    const { 
      taskId,
      taskName,
      description,
      taskType,
      priority,
      timeout,
      retryCount,
      textInput
    } = req.body;

    let fileData = null;
    if (req.file) {
      fileData = {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        buffer: req.file.buffer.toString('base64')
      };
    }

    const task = {
      id: taskId,
      type: taskType,
      payload: {
        taskName,
        description,
        priority,
        timeout: parseInt(timeout),
        retryCount: parseInt(retryCount)
      },
      data: {
        textInput: textInput || null,
        uploadedFile: fileData || null
      }
    };

    await queue.add(`${taskType}`, task);
    console.log("Task queued:", task);
    
    res.status(200).json({
      message: "Task submitted",
      taskId,
    });
  } catch(err) {
    console.error("Error adding task:", err);
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
