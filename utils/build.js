process.env.NODE_ENV = 'production';
let webpack = require("webpack"),
    config = require("../webpack.config");

require("./prepare");

webpack(
  config,
  function (err) { if (err) throw err; }
);
