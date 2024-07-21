const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
  })
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log("No connection"));
