const { Worker } = require("bullmq");
const processor = require("./processor");

const worker = new Worker(
  "nodeJs",
  processor,
  {
    connection: {
      host: "redis",
      port: 6379,
    },
  }
);

// Start the worker
worker.on("ready", () => {
  console.log("Worker ready and listening for jobs...");
});

worker.on("completed", (job) => {
  console.log("Job finished:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("Job failed:", job.id, err.message);
});

// Handle worker errors (connection failures, etc.)
worker.on("error", (err) => {
  console.error("Worker error:", err);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await worker.close();
  process.exit(0);
});