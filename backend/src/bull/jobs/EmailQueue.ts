// import {Job, Queue, QueueEvents, Worker} from "bullmq";
// import { defaultQueueOptions, redisConnection } from "../queue.js";
// import { sendEmail } from "../../mails/mail.js";

// interface EmailJobDataType {
//     to: string;
//     subject: string;
//     html: string;
// }

// export const EmailQueueName:string = "emailqueue";

// export const EmailQueue:Queue = new Queue(EmailQueueName, {
//     connection: redisConnection,
//     defaultJobOptions: defaultQueueOptions,
// });

// export const EmailQueueEvents:QueueEvents = new QueueEvents(EmailQueueName, {
//     connection: redisConnection,
// });

// export const EmailWorker = new Worker(EmailQueueName, async(job:Job) => {
//     const data:EmailJobDataType = job.data;
//     console.log("The queue data is", data);

//     await sendEmail(data.to,data.subject,data.html,)
// },
// {
//     connection: redisConnection,
// });