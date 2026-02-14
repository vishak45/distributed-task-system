module.exports = async function processor(job) {
  const task = job.data;

  console.log("Processing task:", task);

  // Simulate work
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Task completed:", task.id);
};
