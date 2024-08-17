const express = require('express');
const kafka = require('kafka-node');
var debug = require('debug')('producer:send');
const { generateAdsEvents } = require('./getAdsEvents');

const router = express.Router();
const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';
const client = new kafka.KafkaClient({ kafkaHost });
const producer = new kafka.Producer(client);

producer.on('ready', () => {
  producerIsReady = true
  console.log("Producer is ready")
});

producer.on('error', (err) => {
  console.error('Producer error:', err);
});

let producerIsReady = false

client.createTopics(
  [
    {
      topic: 'ad-events',
      partitions: 1,
      replicationFactor: 1,
    },
  ],
  (error, result) => {
    if (error && error.message.includes('TopicExistsException')) {
      console.log('Topic already exists');
    } else if (error) {
      console.error('Error creating topic:', error);
    } else {
      console.log('Topic created successfully:', result);
    }
  },
);

let producerIntervalHandler = null;

const adsEvents = generateAdsEvents(1000 * 1000);

function startProducer(count) {
  clearInterval(producerIntervalHandler);
  producerIntervalHandler = setInterval(() => {
    if(!producerIsReady){
      return;
    }
    count *= 1;
    for (let i = 0; i < count; i++) {
      const event = adsEvents[Math.floor(Math.random() * adsEvents.length)];
      event.click_timestamp = Date.now();
      const payloads = [{ topic: 'ad-events', messages: JSON.stringify(event) }];
      debug(`payloads: `, payloads);
      producer.send(payloads, (err, data) => {
        if (err) {
          console.error('Error sending message', err);
        } else {
          console.log('Message sent successfully', data);
        }
      });
    }
    console.log(`sending ${count} message`)
  }, 1000);

}

function stopProducer() {
  clearInterval(producerIntervalHandler);
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  const action = req.query.action ?? 'stop';
  const count = req.query.count ?? 100;
  if (action === 'start') {
    startProducer(count);
  } else {
    stopProducer();
  }

  res.json({
    action,
    count,
    // eventId: producerIntervalHandler,
  });
});

module.exports = router;
