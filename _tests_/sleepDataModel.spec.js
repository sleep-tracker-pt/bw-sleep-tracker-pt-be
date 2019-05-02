const sData = require("../data/models/sleepDataModel.js");
const db = require("../data/knexConfig.js");
const moment = require("moment");
const Promise = require("bluebird");

const testUsers = [
  {
    username: "test",
    password: "testing",
    birthdate: new Date(),
    role: "user"
  },
  {
    username: "ad",
    password: "adRole",
    birthdate: new Date(),
    role: "admin"
  }
];

const seedSleepData = async () => {
  const usersid = await db("users");
  let data = [];
  for (let i = 0; i < 10; i++) {
    const hoursNumber = randomNumber(5, 15);
    const userNumber = randomNumber(usersid[0].id, usersid[1].id + 1);
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
  await db("sleepdata").insert(data);
  const sdat = await db("sleepdata");
};

const randomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const mytruncate = async () => {
  await db.schema.raw("TRUNCATE TABLE users CASCADE");
  await db.schema.raw("TRUNCATE TABLE sleepdata CASCADE");
};

const seed = async () => {
  await db("users").insert(testUsers);
  await seedSleepData();
};

beforeEach(() => {
  return seed();
});
afterEach(() => {
  return mytruncate();
});
describe("sleep Data Model", () => {
  describe("delete night", () => {
    it("should recieve an id and delete the corresponding night", async () => {
      let nights = await db("sleepdata");
      expect(nights.length).toBe(10);
      const del = await sData.delNight(nights[0].id);
      nights = await db("sleepdata");
      expect(del).toEqual(1);
      expect(nights.length).toBe(9);
    });
  });
  describe("getSingleNight", () => {
    it("should recieve an id and return the corresponding night", async () => {
      let nights = await db("sleepdata");
      const theNight = await sData.getSingleNight(nights[0].id);
      expect(typeof theNight).toBe("object");
      expect(theNight).toHaveProperty("id", nights[0].id);
      expect(theNight).toHaveProperty("userID");
      expect(theNight).toHaveProperty("start");
      expect(theNight).toHaveProperty("end");
      expect(theNight).toHaveProperty("hours");
      expect(theNight).toHaveProperty("bed_t_rating");
      expect(theNight).toHaveProperty("work_t_rating");
      expect(theNight).toHaveProperty("average_rating");
    });
  });
  describe("get Data of single user", () => {
    it("should return the all the sleep data of a single user based on the id", async () => {
      const users = await db("users");
      let nightsOfUser = await db("sleepdata").where("userID", users[0].id);
      const nights = await sData.getDataSingleUser(users[0].id);
      expect(Array.isArray(nights)).toBe(true);
      expect(nights).toEqual(nightsOfUser);
    });
  });
  describe("update Data", () => {
    it("should recieve an id and update the matching night with the new data", async () => {
      const nights = await db("sleepdata");
      const thenight = nights[0];
      const newData = { ...thenight, hours: 22 };
      await sData.updateData(thenight.id, newData);
      const updatedNight = await db("sleepdata")
        .where("id", thenight.id)
        .first();
      expect(thenight.hours).not.toEqual(updatedNight.hours);
      expect(updatedNight.hours).toEqual(22);
    });
  });
  describe("add Sleep Data", () => {
    it("should take in an object and insert into sleep data db", async () => {
      const users = await db("users");
      let sleepData = await db("sleepdata");
      const userSleepData = await db("sleepdata").where("userID", users[0].id);
      const length = userSleepData.length;
      const newData = {
        userID: users[0].id,
        start: "2019-5-8 18:21",
        end: "2019-5-8 18:21",
        hours: 22,
        bed_t_rating: "1",
        work_t_rating: "2",
        average_rating: "1"
      };
      await sData.addSleepData(newData);
      sleepData = await db("sleepdata");
      expect(sleepData.length).toBe(11);
      expect(sleepData[10].hours).toBe(22);
    });
  });
});
