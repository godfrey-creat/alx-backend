import redis from 'redis';

const publisherClient = redis.createClient();

publisherClient.on('connect', () => {
  console.log('Redis client connected to the server');
});

publisherClient.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisherClient.publish('holberton school channel', message);
  }, time);
}

// Calling publishMessage for testing
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);

