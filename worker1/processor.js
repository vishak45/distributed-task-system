import apiFetch from "./tasks/apiFetch";
import sendMail from "./tasks/senMail";
import reoportGen from "./tasks/reportGeneration";
import dataTransform from "./tasks/DataTransform";
module.exports = async function processor(job) {
  const task = job.data;

  // Only process nodeJs tasks
  if (task.type !== "api-integration" || task.type !== "data-transformation") {
    throw new Error(`Invalid task type: ${task.type}. Expected 'nodeJs'.`);
  }

  console.log("Processing Node.js task:", task);

  // Simulate work
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Node.js task completed:", task.id);
  
  return { status: "completed", taskId: task.id };
};
