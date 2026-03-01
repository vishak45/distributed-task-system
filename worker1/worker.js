const { Worker } = require("bullmq");
const processor = require("./processor");

const connection = {
  host: "redis",
  port: 6379,
};

// Create separate workers for each queue type
const queueTypes = ["api-integration", "data-transformation"];
const workers = [];

queueTypes.forEach((queueName) => {
  const worker = new Worker(queueName, processor, { connection });

  worker.on("ready", () => {
    console.log(`Worker for '${queueName}' ready and listening...`);
  });

  worker.on("completed", (job) => {
    console.log(`[${queueName}] Job completed:`, job.id);
  });

  worker.on("failed", (job, err) => {
    console.error(`[${queueName}] Job failed:`, job.id, err.message);
  });

  worker.on("error", (err) => {
    console.error(`[${queueName}] Worker error:`, err);
  });

  workers.push(worker);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
});