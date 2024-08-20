const express = require('express');
const kafka = require('kafka-node');

const router = express.Router();
const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';
const client = new kafka.KafkaClient({ kafkaHost });
const consumer = new kafka.Consumer(client, [{ topic: 'ad-events', partition: 0 }], {
  autoCommit: true,
});

router.get('/', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  consumer.on('message', (message) => {
    console.log('Consumed:', message.value);
    res.write(`data: ${message.value}\n\n`);
  });

  consumer.on('error', (err) => {
    console.error('Consumer error:', err);
    res.status(500).send('Kafka consumer error');
  });

  req.on('close', () => {
    console.log('Client closed connection');
    res.end();
  });
});

module.exports = router;
