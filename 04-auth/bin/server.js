const app = require("../app");
const mongoConnect = require("../services/mongoDb");

const PORT = process.env.PORT || 3000;

mongoConnect
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running. Use our API on port: http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.log(`Connection error. Error: ${error.message}`);
    process.exit(1);
  });
