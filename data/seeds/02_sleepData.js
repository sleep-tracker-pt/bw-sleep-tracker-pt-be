const moment = require("moment");

const randomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
exports.seed = function(knex, Promise) {
  let data = [];
  for (let i = 0; i < 100; i++) {
    const hoursNumber = randomNumber(5, 15);
    const userNumber = randomNumber(3, 23);
    const bscaleNumber = randomNumber(1, 5);
    const wscaleNumber = randomNumber(1, 5);
    const ascaleNumber = randomNumber(1, 5);
    const time = moment();
    time.add(i, "d");
    const anotherTime = moment();
    anotherTime.add(i, "d");
    anotherTime.add(hoursNumber, "h");
    const diff = anotherTime.diff(time, "h");
    const formatTime = time.format("YYYY-M-D HH:mm");
    const formatAntherTime = anotherTime.format("YYYY-M-D HH:mm");
    const newObj = {
      userID: userNumber,
      start: formatTime,
      end: formatAntherTime,
      hours: diff,
      bed_t_rating: bscaleNumber,
      work_t_rating: wscaleNumber,
      average_rating: ascaleNumber
    };
    data.push(newObj);
  }
  // Deletes ALL existing entries
  return knex("sleepData")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("sleepData").insert(data);
    });
};
