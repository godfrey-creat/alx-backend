import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Redis client setup
const redisClient = redis.createClient();
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Kue queue setup
const queue = kue.createQueue();

// Reserve seat functions
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const availableSeats = await getAsync('available_seats');
  return availableSeats ? parseInt(availableSeats, 10) : 0;
}

// Initialize available seats and reservationEnabled
reserveSeat(50);
let reservationEnabled = true;

// Express routes
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats });
});

app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }

  const reserveSeatJob = queue.create('reserve_seat').save((err) => {
    if (!err) {
      res.json({ status: 'Reservation in process' });
    } else {
      res.json({ status: 'Reservation failed' });
    }
  });

  reserveSeatJob.on('complete', (result) => {
    console.log(`Seat reservation job ${reserveSeatJob.id} completed`);
  });

  reserveSeatJob.on('failed', (err) => {
    console.error(`Seat reservation job ${reserveSeatJob.id} failed: ${err.message}`);
  });
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentAvailableSeats = await getCurrentAvailableSeats();
    const remainingSeats = currentAvailableSeats - 1;

    if (remainingSeats >= 0) {
      await reserveSeat(remainingSeats);
      done();
    } else {
      done(new Error('Not enough seats available'));
    }

    if (remainingSeats === 0) {
      reservationEnabled = false;
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

