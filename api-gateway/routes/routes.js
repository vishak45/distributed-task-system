const express = require("express");

const queue = require("../queue/queue");

const router = express.Router();

router.post("/addTasks", async(req,res) =>{
  try{
    const { taskId,taskName,
    description,
    taskType,
    priority,
    timeout,
    retryCount} = req.body;

   const task = {
     id: taskId,
     type: taskType,
     payload: {
       taskName,
       description,
       priority,
       timeout,
       retryCount
     }

   } 

    await queue.add(`${taskType}`, task);
    console.log("Task queued:", task);
    res.status(200).json({
      message: "Task submitted",
      taskId,
    });
  }
  catch(err)
  {
    res.status(500).json({error: err.message});
  }
});

module.exports = router;
