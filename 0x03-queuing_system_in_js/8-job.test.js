import kue from 'kue';
import { createPushNotificationsJobs } from './8-job';

describe('createPushNotificationsJobs', () => {
  let queue;

  beforeEach(() => {
    // Create a new Kue queue and enter test mode
    queue = kue.createQueue({ redis: { createClientFactory: () => kue.redisClient() }, testMode: true });
  });

  afterEach(() => {
    // Clear the queue and exit test mode
    queue.testMode.exit();
  });

  it('should create jobs in the queue', () => {
    const jobs = [
      { phoneNumber: '4151234567', message: 'Message 1' },
      { phoneNumber: '4159876543', message: 'Message 2' },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Validate that the correct number of jobs are in the queue
    expect(queue.testMode.jobs.length).toEqual(jobs.length);

    // Validate individual job properties if needed
    jobs.forEach((jobData, index) => {
      const createdJob = queue.testMode.jobs[index];
      expect(createdJob.type).toEqual('push_notification_code_3');
      expect(createdJob.data).toEqual(jobData);
    });
  });

  // Add more test cases as needed
});

