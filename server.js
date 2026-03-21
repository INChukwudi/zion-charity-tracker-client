const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname + '/dist/zion-charity-tracker-client/browser'));

app.get('/{*all}', function(req,res) {
  res.sendFile(path.join(__dirname + '/dist/zion-charity-tracker-client/browser/index.html'));
});

app.listen(process.env.PORT || 8080);
