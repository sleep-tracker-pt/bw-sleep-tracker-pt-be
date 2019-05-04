require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtKey = process.env.JWT_SECRET || "testing";
const axios = require("axios");
const stripHtml = require("string-strip-html");

module.exports = {
  jwtCheck,
  createHash,
  checkHash,
  blogPosts
};

async function blogPosts(req, res) {
  const blogUrls = [
    "https://sleeplady.com/feed/",
    "http://www.sleepreviewmag.com/feed/",
    "https://babysleepsite.com/feed/",
    "http://feeds.feedburner.com/doctorpark",
    "https://drcraigcanapari.com/feed/",
    "https://sleepjunkies.com/feed/",
    "https://thesleepdoctor.com/feed/"
  ];

  const options = {
    params: {
      api_key: "rb8fh2g4ymevqc44u22dkplpmrp0jsquu9nrocfl"
    }
  };
  const axiosFunction = axios => ({
    sleepLady: async () =>
      await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=${blogUrls[0]}`,
        options
      ),
    sleepReview: async () =>
      await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=${blogUrls[1]}`,
        options
      ),
    babySleep: async () =>
      await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=${blogUrls[2]}`,
        options
      ),
    feedBurner: async () =>
      await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=${blogUrls[3]}`,
        options
      ),
    drCraig: async () =>
      await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=${blogUrls[4]}`,
        options
      ),
    sleepJunk: async () =>
      await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=${blogUrls[5]}`,
        options
      ),
    sleepDoc: async () =>
      await axios.get(
        `https://api.rss2json.com/v1/api.json?rss_url=${blogUrls[6]}`,
        options
      )
  });

  // const noptions = await axios.get("https://api.rss2json.com/v1/api.json", data);
  // console.log(ndata.data);
  try {
    const data = [
      await axiosFunction(axios).sleepLady(),
      await axiosFunction(axios).sleepReview(),
      await axiosFunction(axios).feedBurner(),
      await axiosFunction(axios).drCraig(),
      await axiosFunction(axios).sleepJunk(),
      await axiosFunction(axios).babySleep(),
      await axiosFunction(axios).sleepDoc()
    ];
    const newData = data.map(dat => {
      let strippedBody = stripHtml(dat.data.items[0].content);
      let newPost = {
        title: dat.data.items[0].title,
        author: dat.data.items[0].author,
        body: strippedBody.substring(0, 150),
        pubDate: dat.data.items[0].pubDate,
        thumbnailUrl: dat.data.items[0].thumbnail,
        linkUrl: dat.data.items[0].link
      };
      return newPost;
    });
    console.log(newData[0]);
    res.status(200).json(newData);
  } catch (err) {
    console.log(err);
  }
}

async function jwtCheck(tok, req, res) {
  jwt.verify(tok, jwtKey, (err, decoded) => {
    if (err) {
      i;
      res.status(401).json(err);
    }

    return (req.decoded = decoded);
  });
}

async function createHash(pass, salt) {
  try {
    const newHash = await new Promise((res, rej) => {
      bcrypt.hash(pass, salt, function(err, hash) {
        if (err) rej(err);
        res(hash);
      });
    });
    return newHash;
  } catch (err) {
    console.log(err);
  }
}

async function checkHash(pass, userPass) {
  try {
    const loginCheck = await new Promise((res, rej) => {
      bcrypt.compare(pass, userPass, function(err, pass) {
        if (err) rej(err);
        res(pass);
      });
    });
    return loginCheck;
  } catch (err) {
    console.log(err);
  }
}
