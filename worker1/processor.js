module.exports = async function processor(job) {
  const task = job.data;

  // Only process nodeJs tasks
  if (task.type !== "nodeJs") {
    throw new Error(`Invalid task type: ${task.type}. Expected 'nodeJs'.`);
  }

  console.log("Processing Node.js task:", task);

  // Simulate work
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Node.js task completed:", task.id);
  
  return { status: "completed", taskId: task.id };
};
