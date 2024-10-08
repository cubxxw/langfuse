import { Queue, Worker } from "bullmq";

import { redis, QueueJobs, QueueName } from "@langfuse/shared/src/server";
import { enqueueBatchExportJobs } from "../features/batchExport/enqueueBatchExportJobs";

export const repeatQueue = redis
  ? new Queue(QueueName.RepeatQueue, {
      connection: redis,
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
    })
  : null;

if (repeatQueue) {
  repeatQueue.add(
    QueueJobs.EnqueueBatchExportJobs,
    {},
    {
      repeat: { pattern: "*/10 * * * *" },
    }
  );
}

export const repeatQueueExecutor = redis
  ? new Worker(
      QueueName.RepeatQueue,
      async (job) => {
        if (job.name === QueueJobs.EnqueueBatchExportJobs) {
          return enqueueBatchExportJobs();
        }
      },
      {
        connection: redis,
      }
    )
  : null;
