import { Queue, Worker } from "bullmq";
import logger from "../logger";
import {
  redis,
  QueueName,
  QueueJobs,
  instrument,
} from "@langfuse/shared/src/server";
import { handleCloudUsageMeteringJob } from "../ee/cloudUsageMetering/handleCloudUsageMeteringJob";
import { env } from "../env";

export const cloudUsageMeteringQueue =
  redis && env.STRIPE_SECRET_KEY
    ? new Queue(QueueName.CloudUsageMeteringQueue, {
        connection: redis,
      })
    : null;

if (cloudUsageMeteringQueue) {
  cloudUsageMeteringQueue.add(
    QueueJobs.CloudUsageMeteringJob,
    {},
    {
      repeat: { pattern: "5 * * * *" },
    }
  );

  // add a job to the queue to start the job immediately in case we need to catch up
  cloudUsageMeteringQueue.add(QueueJobs.CloudUsageMeteringJob, {}, {});

  // log the jobs in the queue
  cloudUsageMeteringQueue.getJobCounts().then((counts) => {
    logger.info("Cloud Usage Metering Queue", counts);
  });
}

export const cloudUsageMeteringJobExecutor =
  redis && env.STRIPE_SECRET_KEY
    ? new Worker(
        QueueName.CloudUsageMeteringQueue,
        async (job) => {
          if (job.name === QueueJobs.CloudUsageMeteringJob) {
            return instrument(
              { name: "cloudUsageMeteringJobExecutor" },
              async () => {
                logger.info("Executing Cloud Usage Metering Job", job.data);
                try {
                  return await handleCloudUsageMeteringJob(job);
                } catch (error) {
                  logger.error(
                    "Error executing Cloud Usage Metering Job",
                    error
                  );
                  throw error;
                }
              }
            );
          }
        },
        {
          connection: redis,
          concurrency: 1,
        }
      )
    : null;
