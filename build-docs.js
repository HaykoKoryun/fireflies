var compressor = require('node-minify');

// Using UglifyJS
compressor.minify
({
  compressor: 'uglifyjs',
  input: "fireflies.js",
  output: "docs/fireflies.min.js"
});