const { Worker } = require("bullmq");
const processor = require("./processor");

const worker = new Worker(
  "task-queue",
  processor,
  {
    connection: {
      host: "redis",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log("Job finished:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Job failed:", err);
});
