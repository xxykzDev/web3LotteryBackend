const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(require("body-parser").json());

const drawnum = `
█▀▄ █▀▄ ▄▀▄ █   █ █ █▄ █ ▄▀    █▄ █ █ █ █▄ ▄█ ██▄ ██▀ █▀▄ ▄▀▀
█▄▀ █▀▄ █▀█ ▀▄▀▄▀ █ █ ▀█ ▀▄█   █ ▀█ ▀▄█ █ ▀ █ █▄█ █▄▄ █▀▄ ▄██
`;
const closing = `
▄▀▀ █   ▄▀▄ ▄▀▀ █ █▄ █ ▄▀    █▀▄ █▀▄ ▄▀▄ █   █
▀▄▄ █▄▄ ▀▄▀ ▄██ █ █ ▀█ ▀▄█   █▄▀ █▀▄ █▀█ ▀▄▀▄▀
`;
const winners = `
▄▀  ██▀ ▀█▀ ▀█▀ █ █▄ █ ▄▀    █   █ █ █▄ █ █▄ █ ██▀ █▀▄ ▄▀▀
▀▄█ █▄▄  █   █  █ █ ▀█ ▀▄█   ▀▄▀▄▀ █ █ ▀█ █ ▀█ █▄▄ █▀▄ ▄██
`;

const open = `
 ▄▀▄ █▀▄ ██▀ █▄ █   █   ▄▀▄ ▀█▀ ▀█▀ ▄▀▄
 ▀▄▀ █▀  █▄▄ █ ▀█   █▄▄ ▀▄▀  █   █  ▀▄▀
`;

const {
  getDrawTimer,
  storeTime,
  openLotto,
  closeLotto,
  drawNumbers,
  countWinners,
  currentLotto,
  getBalance,
  getDrawJackpot,
  getLotteryInfo,
  viewTickets,
} = require("./interfaces");

app.post("/currentlotto", function (req, res) {
  return new Promise((resolve, reject) => {
    currentLotto()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/getdrawjackpot", function (req, res) {
  return new Promise((resolve, reject) => {
    getDrawJackpot()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/backendtimer", function (req, res) {
  return new Promise((resolve, reject) => {
    getDrawTimer()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/getbalance", function (req, res) {
  return new Promise((resolve, reject) => {
    getBalance()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/viewlotto", function (req, res) {
  const lottoId = req.body.lottoId;
  return new Promise((resolve, reject) => {
    getLotteryInfo(lottoId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

app.post("/viewtickets", function (req, res) {
  const ticketId = req.body.ticketId;
  return new Promise((resolve, reject) => {
    viewTickets(ticketId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=180000");
        res.end(JSON.stringify(response));
        resolve();
      })
      .catch((error) => {
        res.json(error);
        res.status(405).end();
      });
  });
});

const runtimer = async () => {
  const response = await getDrawTimer();
  let timeleft = response.documents[0].time;
  setInterval(function () {
    if (timeleft <= 0) {
      console.log("Closing Draw");
      executeLotto();
      let drawreset = 100000;
      storeTime(drawreset);
      timeleft = drawreset;
    } else {
      timeleft -= 1000;
      storeTime(timeleft);
    }
  }, 1000);
};

function executeLotto() {
  console.log(closing);
  closeLotto();
  console.log("");
  console.log("");
  setTimeout(function () {
    console.log(drawnum);
    drawNumbers();
    console.log("");
    console.log("");
    setTimeout(function () {
      console.log(winners);
      countWinners();
      console.log("");
      console.log("");
      setTimeout(function () {
        console.log(open);
        openLotto();
        console.log("");
        console.log("");
      }, 90000);
    }, 90000);
  }, 60000);
}

const server = app.listen(8082, function () {
  const port = server.address().port;
  console.log("");
  console.log("Welcome to the wildestLottery on earth");
  runtimer();
  console.log("Backend API listening over port: " + port);
});
