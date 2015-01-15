/**
 * Amazon price watch. 
 * Monitor product prices and send an alert when it drops below a desired threshold.
 *
 * https://github.com/1element/product-price-watch
 */
var request = require('request');
var cheerio = require('cheerio');
var push = require('pushover-notifications');
var config = require('./config.json');

var requestHandler = function(productName, priceThreshold) {
  return function(error, response, html) {

    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);

      var prices = $('.a-color-price');
      prices.each(function(i, elem) {
        var price = $(this).text();
        price = price.replace(config.global.currency, ''); // remove currency sign
        price = price.replace(/,/, ".");
        price = price.trim(); 
        var plainPrice = parseFloat(price);
        if (plainPrice < priceThreshold) {
          console.log('Lower price found for ' + productName + ': ' + plainPrice + '. Threshold was: ' + priceThreshold);
          sendPush(productName, plainPrice, priceThreshold);
          return false; 
        }
      });
    }

  };
};

var sendPush = function(productName, price, priceThreshold) { 
  var pushover = new push({
    user: config.pushover.user,
    token: config.pushover.token 
  });

  var message = {
    message: 'Lower price found for ' + productName  + '. Lowest price right now: ' + price + '. Threshold was: ' + priceThreshold,
    title: 'Price Alert'    
  };

  pushover.send(message, function(err, result) {
    if (err) {
      throw err;  
    }
    console.log('Pushover notification was sent.');
  });
};

for (var product in config.products) {
  var productName = config.products[product].name;
  var productId = config.products[product].productId;
  var productPriceThreshold = config.products[product].priceThreshold;

  var url = config.global.urlPrefix + productId + config.global.urlSuffix; 
  request(url, requestHandler(productName, productPriceThreshold));
}
