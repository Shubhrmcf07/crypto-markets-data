const request = require("request");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { awaitReq } = require("./promises");

const app = express();
app.use(express.static("/../public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    allowedHeaders: "*",
    credentials: false,
    exposedHeaders: "*",
    methods: "*",
    origin: "*",
  })
);

app.get("/tickers", async (req, res) => {
  const list = await request.get(
    "https://api.coindcx.com/exchange/ticker",
    async (err, response, body) => {
      const currency = req.query.currency;
      body = JSON.parse(body);
      const regex = new RegExp(`${currency}$`);
      if (currency && currency != "All") {
        for (var value = 0; value < body.length; value++) {
          if (body[value].market.match(regex) == null) {
            body.splice(value, 1);
            value--;
          }
        }
      }
      return res.json(body);
    }
  );
});

app.get("/", async (req, res) => {
  res.sendFile(path.resolve("../index.html"));
});

app.get("/ticker/:market", async (req, res) => {
  var tickerFile = fs.readFileSync(path.resolve(`../ticker.html`));
  tickerFile = tickerFile.toString();

  tickerFile = tickerFile.replace("BTC", req.params.market);
  res.send(tickerFile);
});

app.get("/public/css/style.css", function (req, res) {
  res.sendFile(path.resolve("../public/css/style.css"));
});

app.get("*/public/js/scripts.js", function (req, res) {
  res.sendFile(path.resolve("../public/js/scripts.js"));
});

app.get("/getTicker/:symbol", async (req, res) => {
  try {
    var ticker_data = await awaitReq(
      "https://api.coindcx.com/exchange/v1/markets_details"
    );
    ticker_data = JSON.parse(ticker_data);

    var market_data = await awaitReq("https://api.coindcx.com/exchange/ticker");
    market_data = JSON.parse(market_data);

    var ticker_details;
    for (let i = 0; i < ticker_data.length; i++) {
      if (ticker_data[i].symbol == req.params.symbol) {
        ticker_details = ticker_data[i];
      }
    }

    var ticker_market;
    for (let i = 0; i < market_data.length; i++) {
      if (market_data[i].market == req.params.symbol) {
        ticker_market = market_data[i];
      }
    }

    return res.json({
      ticker_market,
      ticker_details,
    });
  } catch (e) {
    console.log(e);
  }
});

app.listen(5000, () => console.log("Listening at 5000"));
