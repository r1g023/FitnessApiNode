require("dotenv").config();
const server = require("./api/server.js");

// port 5000
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`server is listening on port ${port}...`);
});
