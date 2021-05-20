const btn1 = document.querySelector("#ticker-details");
const btn2 = document.querySelector("#ticker-charts");
const btn3 = document.querySelector("#ticker-order-books");
const btn4 = document.querySelector("#ticker-trading-history");

var intervalId;

const getMarkets = async (currency) => {
  var arr = await fetch(`http://localhost:5000/tickers/?currency=${currency}`, {
    method: "GET",
  });
  arr = await arr.json();

  var tab = document.getElementById("tickers").children;

  if (tab.length == 1) {
    document.getElementById("tickers").innerHTML = `<tr>
  <th>Exchange</th>
  <th>24 Hour Change</th>
  <th>High</th>
  <th>Low</th>
  <th>Volume</th>
  <th>LTP</th>
  <th>Updated At</th>
</tr>`;
    for (obj in arr) {
      const row = document.createElement("tr");
      const col1 = document.createElement("td");
      col1.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].market}</a>`;
      const col2 = document.createElement("td");
      col2.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].change_24_hour}</a>`;

      if (arr[obj].change_24_hour < 0) {
        col2.style.color = "red";
      } else {
        col2.style.color = "green";
      }
      const col3 = document.createElement("td");
      col3.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].high}</a>`;
      col3.style.color = "green";
      const col4 = document.createElement("td");
      col4.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].low}</a>`;

      col4.style.color = "red";
      const col5 = document.createElement("td");
      col5.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].volume}</a>`;
      const col6 = document.createElement("td");
      col6.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].last_price}</a>`;
      const col7 = document.createElement("td");
      col7.innerHTML = `<a href="/ticker/${arr[obj].market}">${new Date(
        arr[obj].timestamp * 1000
      ).toLocaleTimeString("en-US")}</a>`;

      col1.id = `col${obj}1`;
      col2.id = `col${obj}2`;
      col3.id = `col${obj}3`;
      col4.id = `col${obj}4`;
      col5.id = `col${obj}5`;
      col6.id = `col${obj}6`;
      col7.id = `col${obj}7`;

      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      row.appendChild(col4);
      row.appendChild(col5);
      row.appendChild(col6);
      row.appendChild(col7);
      document.getElementById("tickers").appendChild(row);
    }
  } else {
    for (obj in arr) {
      const col1 = document.getElementById(`col${obj}1`);
      const col2 = document.getElementById(`col${obj}2`);
      const col3 = document.getElementById(`col${obj}3`);
      const col4 = document.getElementById(`col${obj}4`);
      const col5 = document.getElementById(`col${obj}5`);
      const col6 = document.getElementById(`col${obj}6`);
      const col7 = document.getElementById(`col${obj}7`);

      if (arr[obj].change_24_hour < 0) {
        col2.style.color = "red";
      } else {
        col2.style.color = "green";
      }

      col1.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].market}</a>`;
      col2.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].change_24_hour}</a>`;
      col3.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].high}</a>`;
      col4.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].low}</a>`;
      col5.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].volume}</a>`;
      col6.innerHTML = `<a href="/ticker/${arr[obj].market}">${arr[obj].last_price}</a>`;
      col7.innerHTML = `<a href="/ticker/${arr[obj].market}">${new Date(
        arr[obj].timestamp * 1000
      ).toLocaleTimeString("en-US")}</a>`;
    }
  }
};

const getTickerDetails = async () => {
  const symbol = document.getElementById("symbol").textContent;
  var obj = await fetch(`http://localhost:5000/getTicker/${symbol}`, {
    method: "GET",
  });
  obj = await obj.json();
  document.getElementById("coin-name").innerHTML =
    obj.ticker_details.target_currency_name;

  document.getElementById("LTP").innerHTML =
    obj.ticker_market.last_price +
    " " +
    obj.ticker_details.base_currency_short_name;
  if (obj.ticker_market.change_24_hour < 0) {
    document.getElementById("change_24_hr").style.color = "red";

    document.getElementById("change_24_hr").innerHTML =
      "<i class='fa fa-arrow-down' /> " +
      obj.ticker_market.change_24_hour +
      "%";
  } else {
    document.getElementById("change_24_hr").style.color = "green";

    document.getElementById("change_24_hr").innerHTML =
      "<i class='fas fa-angle-up'/> " + obj.ticker_market.change_24_hour + "%";
  }

  document.getElementById("volume").innerHTML =
    "Volume : " + obj.ticker_market.volume;

  document.getElementById("ticker-details").style.fontSize = "15px";
  document.getElementById("ticker-details").style.color = "darkcyan";

  const tab = document.getElementById("tbl1");
  if (!tab) {
    const tbl = document.createElement("table");
    tbl.style.width = "100%";
    tbl.id = "tbl1";
    row1 = document.createElement("tr");
    r1c1 = document.createElement("td");
    r1c2 = document.createElement("td");

    r1c1.innerHTML = "Target Currency";
    r1c2.innerHTML = obj.ticker_details.target_currency_name;

    row1.appendChild(r1c1);
    row1.appendChild(r1c2);

    row2 = document.createElement("tr");
    r2c1 = document.createElement("td");
    r2c2 = document.createElement("td");

    r2c1.innerHTML = "Base Currency";
    r2c2.innerHTML = obj.ticker_details.base_currency_name;

    row2.appendChild(r2c1);
    row2.appendChild(r2c2);

    row3 = document.createElement("tr");
    r3c1 = document.createElement("td");
    r3c2 = document.createElement("td");

    r3c1.innerHTML = "Maximum Limit Price";
    r3c2.innerHTML = obj.ticker_details.max_price;

    row3.appendChild(r3c1);
    row3.appendChild(r3c2);

    row4 = document.createElement("tr");
    r4c1 = document.createElement("td");
    r4c2 = document.createElement("td");

    r4c1.innerHTML = "Minimum Limit Price";
    r4c2.innerHTML = obj.ticker_details.min_price;

    row4.appendChild(r4c1);
    row4.appendChild(r4c2);

    row5 = document.createElement("tr");
    r5c1 = document.createElement("td");
    r5c2 = document.createElement("td");

    r5c1.innerHTML = "Maximum Buy Quantity";
    r5c2.innerHTML = obj.ticker_details.max_quantity;

    row5.appendChild(r5c1);
    row5.appendChild(r5c2);

    row6 = document.createElement("tr");
    r6c1 = document.createElement("td");
    r6c2 = document.createElement("td");

    r6c1.innerHTML = "Minimum Buy Quantity";
    r6c2.innerHTML = obj.ticker_details.min_quantity;

    row6.appendChild(r6c1);
    row6.appendChild(r6c2);

    row7 = document.createElement("tr");
    r7c1 = document.createElement("td");
    r7c2 = document.createElement("td");

    r7c1.innerHTML = "Ask";
    r7c2.innerHTML = obj.ticker_market.ask;

    row7.appendChild(r7c1);
    row7.appendChild(r7c2);

    row8 = document.createElement("tr");
    r8c1 = document.createElement("td");
    r8c2 = document.createElement("td");

    r8c1.innerHTML = "Bid";
    r8c2.innerHTML = obj.ticker_market.bid;

    row8.appendChild(r8c1);
    row8.appendChild(r8c2);

    row9 = document.createElement("tr");
    r9c1 = document.createElement("td");
    r9c2 = document.createElement("td");

    r9c1.innerHTML = "High";
    r9c2.innerHTML = obj.ticker_market.high;

    row9.appendChild(r9c1);
    row9.appendChild(r9c2);

    row10 = document.createElement("tr");
    r10c1 = document.createElement("td");
    r10c1.className = "pls";
    r10c2 = document.createElement("td");

    r10c1.innerHTML = "Low";
    r10c2.innerHTML = obj.ticker_market.low;

    row10.appendChild(r10c1);
    row10.appendChild(r10c2);

    r1c2.id = "r1c2";
    r2c2.id = "r2c2";
    r3c2.id = "r3c2";
    r4c2.id = "r4c2";
    r5c2.id = "r5c2";
    r6c2.id = "r6c2";
    r7c2.id = "r7c2";
    r8c2.id = "r8c2";
    r9c2.id = "r9c2";
    r10c2.id = "r10c2";

    tbl.appendChild(row7);
    tbl.appendChild(row8);
    tbl.appendChild(row9);
    tbl.appendChild(row10);
    tbl.appendChild(row1);
    tbl.appendChild(row2);
    tbl.appendChild(row3);
    tbl.appendChild(row4);
    tbl.appendChild(row5);
    tbl.appendChild(row6);

    r1c1.className = "pls";
    r2c1.className = "pls";
    r3c1.className = "pls";
    r4c1.className = "pls";
    r5c1.className = "pls";
    r6c1.className = "pls";
    r7c1.className = "pls";
    r8c1.className = "pls";
    r9c1.className = "pls";
    r10c1.className = "pls";
    document.getElementById("ticker-container").appendChild(tbl);
  } else {
    r1c2 = document.getElementById("r1c2");
    r2c2 = document.getElementById("r2c2");
    r3c2 = document.getElementById("r3c2");
    r4c2 = document.getElementById("r4c2");
    r5c2 = document.getElementById("r5c2");
    r6c2 = document.getElementById("r6c2");
    r7c2 = document.getElementById("r7c2");
    r8c2 = document.getElementById("r8c2");
    r9c2 = document.getElementById("r9c2");
    r10c2 = document.getElementById("r10c2");

    r1c2.innerHTML = obj.ticker_details.target_currency_name;
    r2c2.innerHTML = obj.ticker_details.base_currency_name;
    r3c2.innerHTML = obj.ticker_details.max_price;
    r4c2.innerHTML = obj.ticker_details.min_price;
    r5c2.innerHTML = obj.ticker_details.max_quantity;
    r6c2.innerHTML = obj.ticker_details.min_quantity;
    r7c2.innerHTML = obj.ticker_market.ask;
    r8c2.innerHTML = obj.ticker_market.bid;
    r9c2.innerHTML = obj.ticker_market.high;
    r10c2.innerHTML = obj.ticker_market.low;
  }

  btn2.style.color = "black";
  btn1.style.color = "darkcyan";
  btn3.style.color = "black";
  btn4.style.color = "black";

  btn2.style.fontSize = "12px";
  btn1.style.fontSize = "15px";
  btn3.style.fontSize = "12px";
  btn4.style.fontSize = "12px";
};

const getChart = async () => {
  btn1.style.color = "black";
  btn2.style.color = "darkcyan";
  btn3.style.color = "black";
  btn4.style.color = "black";

  btn1.style.fontSize = "12px";
  btn2.style.fontSize = "15px";
  btn3.style.fontSize = "12px";
  btn4.style.fontSize = "12px";
};

const getOrderBooks = async () => {
  btn1.style.color = "black";
  btn3.style.color = "darkcyan";
  btn2.style.color = "black";
  btn4.style.color = "black";

  btn1.style.fontSize = "12px";
  btn3.style.fontSize = "15px";
  btn2.style.fontSize = "12px";
  btn4.style.fontSize = "12px";
};

const getTradingHistory = async () => {
  btn1.style.color = "black";
  btn4.style.color = "darkcyan";
  btn3.style.color = "black";
  btn2.style.color = "black";

  btn1.style.fontSize = "12px";
  btn4.style.fontSize = "15px";
  btn3.style.fontSize = "12px";
  btn2.style.fontSize = "12px";
};

const function2 = (currency) => {
  if (intervalId) clearInterval(intervalId);
  getMarkets(currency);
  intervalId = setInterval(function () {
    getMarkets(currency);
  }, 30000);
};

const tickerFunction = () => {
  if (intervalId) clearInterval(intervalId);
  getTickerDetails();
  intervalId = setInterval(getTickerDetails, 30000);
};
