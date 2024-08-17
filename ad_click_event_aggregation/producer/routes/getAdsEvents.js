const { faker } = require('@faker-js/faker');
const path = require('path');
const fs = require('fs');

function readJSONFiles(filePath) {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    // console.log(data);
    return JSON.parse(data);
  }
  return [];
}

function writeJSONFiles(filePath, jsonData) {
  const jsonString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync(filePath, jsonString, 'utf8');
  return true;
}

function generateAdIds(count) {
  const adsIdsJSONPath = path.join(__dirname, 'adsIds.json');
  const adIds = readJSONFiles(adsIdsJSONPath);
  if (adIds.length >= count) {
    return adIds.slice(0, count);
  }

  for (let i = 0; i < count - adIds.length; i++) {
    adIds.push(faker.string.uuid());
  }
  writeJSONFiles(adsIdsJSONPath, adIds);

  return adIds;
}

function generateUsers(count) {
  const usersJSONPath = path.join(__dirname, 'users.json');
  const users = readJSONFiles(usersJSONPath);
  if (users.length >= count) {
    return users.slice(0, count);
  }

  for (let i = 0; i < count - users.length; i++) {
    users.push({
      user_id: faker.string.uuid(),
      ip: faker.internet.ipv4(),
      country: faker.location.country(),
    });
  }

  writeJSONFiles(usersJSONPath, users);
  return users;
}

function generateAdsEvents(count) {
  const adsIds = generateAdIds(100);
  const users = generateUsers(10 * 1000);
  const adsEvents = [];
  for (let i = 0; i < count; i++) {
    const adsId = adsIds[Math.floor(Math.random() * adsIds.length)];
    const userIndex = Math.floor(Math.random() * users.length);
    const user = users[userIndex];
    const event = {
      ad_id: adsId,
      ...user,
    }
    adsEvents.push(event);
  }

  return adsEvents;
}

module.exports = {
  generateAdsEvents,
};
