# Amazon Price Watch

Simple script to watch Amazon product prices and send a notification when the price drops below a desired threshold. Useful to watch out for "Warehouse Deals" or used items that are only available for a short time.

Script written in [Node.js](http://nodejs.org/). Uses the [pushover API](https://pushover.net/api/) to send notifications.


## Installation

Beside [Node.js](http://nodejs.org/download/) you need the following modules: [Request](https://github.com/request/request), [Cheerio](https://github.com/cheeriojs/cheerio) and [Pushover-Notifications](https://github.com/qbit/node-pushover).

To install the required dependencies execute:

```shell
npm install request cheerio pushover-notifications
```

## Configuration

Configuration is done in ```config.json```:

```js
{
  "pushover": {
    "user": "XXX",
    "token": "XXX"
  },
  "global": {
    "currency": "EUR",
    "urlPrefix": "http://www.amazon.de/gp/offer-listing/",
    "urlSuffix": "/ref=olp_tab_all"
  },
  "products": [
    { "name": "Name of product",
      "productId": "B00CKPCJNO",
      "priceThreshold": "28.00"
    },
    { "name": "Name of product #2",
      "productId": "B000PKFFNW",
      "priceThreshold": "90.00"
    }
  ]
}
```

Change ```pushover.user``` and ```pushover.token``` to your Pushover user and application token.

Depending on your locale you need to change ```global.currency``` and the Amazon domain in ```global.urlPrefix```.

If you only want to monitor new products change the value of ```global.urlSuffix``` to ```/ref=olp_tab_new?condition=new```. To track only used products change it to ```/ref=olp_tab_used?condition=used```.


## Usage

Create a crontab entry to execute ```node app.js``` once in a while.
