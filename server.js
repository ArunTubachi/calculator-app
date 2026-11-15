const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Only start listening when run directly with "node server.js"
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Calculator app running at http://localhost:${PORT}`);
  });
}

module.exports = app;