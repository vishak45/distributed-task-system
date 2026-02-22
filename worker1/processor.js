import apiFetch from "./tasks/apiFetch";

import dataTransform from "./tasks/DataTransform";
module.exports = async function processor(job) {
  const task = job.data;

  // Only process nodeJs tasks
  if (task.taskType !== "api-integration" || task.taskType !== "data-transformation") {
    throw new Error(`Invalid task type: ${task.taskType}. Expected 'nodeJs'.`);
  }

  console.log("Processing Node.js task:", task);

  // Simulate work
  if(task.taskType === "api-integration") {
    await apiFetch(task);
  } else if(task.taskType === "data-transformation") {
    await dataTransform(task);
  }

  console.log("Node.js task completed:", task.id);
  
  return { status: "completed", taskId: task.id };
};
