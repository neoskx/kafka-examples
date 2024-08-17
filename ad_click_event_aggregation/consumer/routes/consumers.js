const  express = require('express');
const kafka = require('kafka-node');

const router = express.Router();
const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';
const client = new kafka.KafkaClient({ kafkaHost });
const consumer = new kafka.Consumer(
  client,
  [{ topic: 'ad-events', partition: 0 }],
  { autoCommit: true }
);

function startAggregation(){
  const adAggregation = {};

  consumer.on('message', (message) => {
    const event = JSON.parse(message.value);
    const { ad_id } = event;

    if (!adAggregation[ad_id]) {
      adAggregation[ad_id] = { clicks: 0 };
    }

    adAggregation[ad_id].clicks += 1;
    console.log('Current Aggregation:', adAggregation);
  });

  consumer.on('error', (err) => {
    console.error('Consumer error:', err);
  });
}

function stopAggregation(){
  consumer.close(true, () => {
    console.log('Consumer closed');
    process.exit(0);
});
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  const action = req.query.action ?? "stop";
  if(action === 'start'){
    startAggregation()
  }else{
    stopAggregation()
  }

  res.json({
    action
  })
});

module.exports = router;
