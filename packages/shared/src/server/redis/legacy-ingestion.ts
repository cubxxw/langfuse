import { Queue } from "bullmq";
import { QueueName, TQueueJobTypes } from "../queues";
import { redis } from "./redis";

let legacyIngestionQueue: Queue<
  TQueueJobTypes[QueueName.LegacyIngestionQueue]
> | null = null;

export const getLegacyIngestionQueue = () => {
  if (legacyIngestionQueue) return legacyIngestionQueue;

  legacyIngestionQueue = redis
    ? new Queue<TQueueJobTypes[QueueName.LegacyIngestionQueue]>(
        QueueName.LegacyIngestionQueue,
        {
          connection: redis,
          defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: 100,
            attempts: 5,
          },
        }
      )
    : null;

  return legacyIngestionQueue;
};
