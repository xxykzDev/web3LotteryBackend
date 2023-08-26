const axios = require("axios");
const ethers = require("ethers");
const LotteryABI = require("./LotteryABI.json");

const lottery = "0x97BeCC9da2Ac95cad0073317EA8f25fD0232A521";
const rpc = "https://sepolia.infura.io/v3/cd82553e73a54f738d65ec3897942279";
const provider = new ethers.providers.JsonRpcProvider(rpc);
const key = "287b95b9310caebe273d9bd68b00a09c13d360feb0cdb46a8fc0131bf779229c";
const wallet = new ethers.Wallet(key, provider);
const apikey =
  "EByv7nlOoKhcPQkur0DiOua3L5LyG3Is4tP5d8IDyDGTjEJyUNwpZnlT7YNWaEGr";
const url =
  "https://data.mongodb-api.com/app/data-kaaww/endpoint/data/v1/action/";
const Contract = new ethers.Contract(lottery, LotteryABI, wallet);

const getDrawTimer = async () => {
  try {
    const response = await axios.post(
      url + "find",
      {
        collection: "LotteryTimer",
        database: "devlabsLottery",
        dataSource: "DevlabsLottery",
        filter: {
          name: "interval",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apikey,
        },
      }
    );

    const output = response.data;
    return output;
  } catch (error) {
    console.error("Error fetching draw timer:", error);
    throw error;
  }
};

const storeTime = async (timeleft) => {
  const response = await axios.post(
    url + "updateOne",
    {
      collection: "LotteryTimer",
      database: "devlabsLottery",
      dataSource: "DevlabsLottery",
      filter: { name: "interval" },
      update: {
        name: "interval",
        time: timeleft,
      },
    },
    {
      "Content-Type": "application/json",
      "api-key": apikey,
    }
  );
  return response;
};

const openLotto = async () => {
  const gasLimit = 2000000;
  try {
    const tx = await Contract.openLottery({ gasLimit });
    await tx.wait();
    console.log("complete");
    return "complete";
  } catch (error) {
    console.log(error, "error calling the open lottery function");
    return "error";
  }
};

const closeLotto = async () => {
  const gasLimit = 2000000;
  try {
    const tx = await Contract.closeLottery({ gasLimit });
    await tx.wait();
    console.log("complete");
    return "complete";
  } catch (error) {
    console.log(error, "error calling the CLOSE lottery function");
    return "error";
  }
};

const drawNumbers = async () => {
  const gasLimit = 2000000;
  try {
    const tx = await Contract.drawNumbers({ gasLimit });
    await tx.wait();
    console.log("complete");
    return "complete";
  } catch (error) {
    console.log(error, "error calling the DRAWNUMBERS lottery function");
    return "error";
  }
};

const countWinners = async () => {
  const gasLimit = 2000000;
  try {
    const tx = await Contract.countWinners({ gasLimit });
    await tx.wait();
    console.log("complete");
    return "complete";
  } catch (error) {
    console.log(error, "error calling the COUNTWINNERS lottery function");
    return "error";
  }
};

const currentLotto = async () => {
  const gasLimit = 2000000;
  const output = await Contract.currentLottoLotteryId({ gasLimit }).catch(
    (error) => {
      console.log("error calling the current LOTTOID");
    }
  );
  const lottoId = output.toString();
  return lottoId;
};

const getBalance = async () => {
  const gasLimit = 2000000;

  const output = await Contract.getBalance({ gasLimit }).catch((error) => {
    console.log("error calling the current lotto id");
  });
  const balance = output.toString();
  return balance;
};

const getDrawJackpot = async () => {
  const gasLimit = 2000000;

  const output = await Contract.currentLottoLotteryId({ gasLimit }).catch(
    (error) => {
      console.log("error calling the current lotto id");
    }
  );
  const lottoId = output.toString();
  const lottoData = await Contract.viewLottery(lottoId).catch((error) => {
    console.log("Error calling draJackpot function");
  });
  return lottoData;
};

module.exports = {
  getDrawTimer,
  storeTime,
  openLotto,
  closeLotto,
  drawNumbers,
  countWinners,
  currentLotto,
  getBalance,
  getDrawJackpot,
};
