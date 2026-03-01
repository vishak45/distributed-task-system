const apiFetch = require("./tasks/apiFetch");
const dataTransform = require("./tasks/DataTransform");

module.exports = async function processor(job) {
  const task = job.data;

  // Only process valid task types
  if (task.type !== "api-integration" && task.type !== "data-transformation") {
    throw new Error(`Invalid task type: ${task.type}. Expected 'api-integration' or 'data-transformation'.`);
  }

  console.log("Processing Node.js task:", task);

  // Process based on task type
  if (task.type === "api-integration") {
    return await apiFetch(task);
  } else if (task.type === "data-transformation") {
    return await dataTransform(task);
  }

  console.log("Node.js task completed:", task.id);
  
  return { status: "completed", taskId: task.id };
};
