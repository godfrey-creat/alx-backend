import redis from 'redis';

const subscriberClient = redis.createClient();

subscriberClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

subscriberClient.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

subscriberClient.subscribe('holberton school channel');

subscriberClient.on('message', (channel, message) => {
  console.log(`Received message on channel ${channel}: ${message}`);
  if (message === 'KILL_SERVER') {
    subscriberClient.unsubscribe();
    subscriberClient.quit();
  }
});

