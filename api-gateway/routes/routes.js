const express = require("express");

const { getQueue } = require("../queue/queue");

const router = express.Router();

// Define valid task types and their corresponding queue names
const TASK_TYPE_MAPPING = {
  "api-integration": "api-integration",
  "data-transformation": "data-transformation",
  "email-spam": "email-spam",
  "dataset-validator": "dataset-validator"
};

const VALID_TASK_TYPES = Object.keys(TASK_TYPE_MAPPING);

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
      textInput,
      outputFormat,
      apiName
    } = req.body;

    // Validate task type
    if (!VALID_TASK_TYPES.includes(taskType)) {
      return res.status(400).json({
        error: `Invalid taskType. Allowed types: ${VALID_TASK_TYPES.join(", ")}`
      });
    }

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
        uploadedFile: fileData || null,
        outputFormat:outputFormat||null,
        apiName:apiName||null
      },
     
    };

    // Route task to the correct queue
    const queueName = TASK_TYPE_MAPPING[taskType];
    const queue = getQueue(queueName);
    await queue.add(task.type, task);
    console.log(`Task queued to "${queueName}":`, task);
    
    res.status(200).json({
      message: "Task submitted",
      taskId,
      queueName
    });
  } catch(err) {
    console.error("Error adding task:", err);
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
