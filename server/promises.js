const { response } = require("express");
const request = require("request");

exports.awaitReq = (url) => {
  return new Promise(function (resolve, reject) {
    request(url, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};
