import kue from 'kue';

const blacklistedNumbers = ['4153518780', '4153518781'];

function sendNotification(phoneNumber, message, job, done) {
  job.progress(0);

  if (blacklistedNumbers.includes(phoneNumber)) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  job.progress(50);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  done();
}

const queue = kue.createQueue({
  jobEvents: false,
});

queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

queue.on('job enqueue', (id, type) => {
  console.log(`Notification job ${id} queued of type ${type}`);
});

queue.on('job complete', (id) => {
  console.log(`Notification job ${id} completed`);
});

queue.on('job failed', (id, err) => {
  console.error(`Notification job ${id} failed: ${err.message}`);
});

queue.on('job progress', (id, progress) => {
  console.log(`Notification job ${id} ${progress}% complete`);
});

