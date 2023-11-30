import kue from 'kue';

function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach((jobData) => {
    const notificationJob = queue.create('push_notification_code_3', jobData);

    notificationJob.save((err) => {
      if (!err) {
        console.log(`Notification job created: ${notificationJob.id}`);
      } else {
        console.error(`Error creating notification job: ${err.message}`);
      }
    });

    notificationJob.on('complete', () => {
      console.log(`Notification job ${notificationJob.id} completed`);
    });

    notificationJob.on('failed', (err) => {
      console.error(`Notification job ${notificationJob.id} failed: ${err.message}`);
    });

    notificationJob.on('progress', (progress) => {
      console.log(`Notification job ${notificationJob.id} ${progress}% complete`);
    });
  });
}

const queue = kue.createQueue();

// Example usage:
const jobs = [
  { phoneNumber: '4151234567', message: 'Message 1' },
  { phoneNumber: '4159876543', message: 'Message 2' },
  // Add more jobs as needed
];

createPushNotificationsJobs(jobs, queue);

