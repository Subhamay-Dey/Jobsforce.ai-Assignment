import { Queue, QueueEvents, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../queue.js";
import { sendEmail } from "../../mails/mail.js";
export const EmailQueueName = "emailqueue";
export const EmailQueue = new Queue(EmailQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueOptions,
});
export const EmailQueueEvents = new QueueEvents(EmailQueueName, {
    connection: redisConnection,
});
export const EmailWorker = new Worker(EmailQueueName, async (job) => {
    const data = job.data;
    console.log("The queue data is", data);
    await sendEmail(data.to, data.subject, data.html);
}, {
    connection: redisConnection,
});
